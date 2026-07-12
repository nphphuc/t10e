using Microsoft.EntityFrameworkCore;
using SWD392_LMS.Application.DTOs;
using SWD392_LMS.Application.Interfaces;
using SWD392_LMS.Domain.Entities;

namespace SWD392_LMS.Application.Services;

public class QuizService : IQuizService
{
    private readonly IApplicationDbContext _context;

    public QuizService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<QuizQuestionDto>> GetQuizQuestionsAsync(int chapterId)
    {
        var questions = await _context.QuizQuestions
            .Where(q => q.ChapterId == chapterId)
            .Include(q => q.Options.OrderBy(o => o.OrderIndex))
            .OrderBy(q => q.OrderIndex)
            .ToListAsync();

        return questions.Select(q => new QuizQuestionDto
        {
            Id = q.Id,
            ChapterId = q.ChapterId,
            QuestionText = q.QuestionText,
            Explanation = q.Explanation,
            Type = q.Type.ToString(),
            Difficulty = q.Difficulty.ToString(),
            OrderIndex = q.OrderIndex,
            Points = q.Points,
            Options = q.Options.Select(o => new QuizOptionDto
            {
                Id = o.Id,
                QuizQuestionId = o.QuizQuestionId,
                OptionText = o.OptionText,
                OrderIndex = o.OrderIndex
            }).ToList()
        }).ToList();
    }

    public async Task<QuizResultDto> SubmitQuizAsync(string userId, QuizSubmitDto submit)
    {
        var questions = await _context.QuizQuestions
            .Where(q => q.ChapterId == submit.ChapterId)
            .Include(q => q.Options)
            .OrderBy(q => q.OrderIndex)
            .ToListAsync();

        var chapter = await _context.Chapters
            .FirstOrDefaultAsync(c => c.Id == submit.ChapterId);

        var totalQuestions = questions.Count;
        var totalPoints = questions.Sum(q => Math.Max(q.Points, 0));
        var correctCount = 0;
        var earnedPoints = 0;
        var questionResults = new List<QuestionResultDto>();

        foreach (var question in questions)
        {
            var answer = submit.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
            var optionIds = question.Options.Select(o => o.Id).ToHashSet();
            var selectedIds = (answer?.SelectedOptionIds ?? new List<int>())
                .Where(optionIds.Contains)
                .Distinct()
                .OrderBy(id => id)
                .ToList();
            var correctIds = question.Options
                .Where(o => o.IsCorrect)
                .Select(o => o.Id)
                .OrderBy(id => id)
                .ToList();

            var isCorrect = correctIds.Any() && selectedIds.SequenceEqual(correctIds);
            var awardedPoints = isCorrect ? Math.Max(question.Points, 0) : 0;
            if (isCorrect)
            {
                correctCount++;
                earnedPoints += awardedPoints;
            }

            questionResults.Add(new QuestionResultDto
            {
                QuestionId = question.Id,
                QuestionText = question.QuestionText,
                IsCorrect = isCorrect,
                Points = Math.Max(question.Points, 0),
                EarnedPoints = awardedPoints,
                Explanation = question.Explanation,
                SelectedOptionIds = selectedIds,
                CorrectOptionIds = correctIds
            });
        }

        var scorePercent = totalPoints > 0 ? (double)earnedPoints / totalPoints * 100 : 0;
        var isPassed = scorePercent >= 70;

        // Save attempt
        var attempt = new UserQuizAttempt
        {
            UserId = userId,
            ChapterId = submit.ChapterId,
            TotalQuestions = totalQuestions,
            CorrectAnswers = correctCount,
            ScorePercent = scorePercent,
            IsPassed = isPassed,
            AttemptedAt = DateTime.UtcNow
        };

        _context.UserQuizAttempts.Add(attempt);

        // Update user progress
        var courseId = chapter?.CourseId ?? 0;
        var userProgress = await _context.UserProgresses
            .FirstOrDefaultAsync(up => up.UserId == userId && up.CourseId == courseId);

        if (courseId > 0)
        {
            var chapters = await _context.Chapters
                .Where(ch => ch.CourseId == courseId)
                .ToListAsync();
            var chapterIds = chapters.Select(c => c.Id).ToList();
            var completedChapterIds = await _context.UserQuizAttempts
                .Where(qa => qa.UserId == userId && qa.IsPassed && chapterIds.Contains(qa.ChapterId))
                .Select(qa => qa.ChapterId)
                .Distinct()
                .ToListAsync();

            if (isPassed)
            {
                completedChapterIds.Add(submit.ChapterId);
            }

            var completedChapters = completedChapterIds.Distinct().Count();

            if (userProgress == null)
            {
                userProgress = new UserProgress
                {
                    UserId = userId,
                    CourseId = courseId,
                    StartedAt = DateTime.UtcNow
                };
                _context.UserProgresses.Add(userProgress);
            }

            userProgress.LastAccessedAt = DateTime.UtcNow;
            userProgress.CurrentChapterId = submit.ChapterId;
            userProgress.ProgressPercent = chapters.Count > 0 ? (double)completedChapters / chapters.Count * 100 : 0;
            userProgress.CompletedLessons = completedChapters;
            userProgress.TotalLessons = chapters.Count;
            if (userProgress.ProgressPercent >= 100 && !userProgress.IsCompleted)
            {
                userProgress.IsCompleted = true;
                userProgress.CompletedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        return new QuizResultDto
        {
            ChapterId = submit.ChapterId,
            ChapterTitle = chapter?.Title ?? "",
            TotalQuestions = totalQuestions,
            CorrectAnswers = correctCount,
            EarnedPoints = earnedPoints,
            TotalPoints = totalPoints,
            ScorePercent = scorePercent,
            IsPassed = isPassed,
            AttemptId = attempt.Id,
            QuestionResults = questionResults
        };
    }

    public async Task<List<QuizResultDto>> GetQuizHistoryAsync(string userId, int chapterId)
    {
        var attempts = await _context.UserQuizAttempts
            .Where(qa => qa.UserId == userId && qa.ChapterId == chapterId)
            .OrderByDescending(qa => qa.AttemptedAt)
            .ToListAsync();

        return attempts.Select(a => new QuizResultDto
        {
            ChapterId = a.ChapterId,
            TotalQuestions = a.TotalQuestions,
            CorrectAnswers = a.CorrectAnswers,
            ScorePercent = a.ScorePercent,
            IsPassed = a.IsPassed,
            AttemptId = a.Id
        }).ToList();
    }
}
