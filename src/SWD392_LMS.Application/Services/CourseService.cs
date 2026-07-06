using Microsoft.EntityFrameworkCore;
using SWD392_LMS.Application.DTOs;
using SWD392_LMS.Application.Interfaces;
using SWD392_LMS.Domain.Entities;

namespace SWD392_LMS.Application.Services;

public class CourseService : ICourseService
{
    private readonly IApplicationDbContext _context;

    public CourseService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CourseDto>> GetAllCoursesAsync(string? userId = null)
    {
        var query = _context.Courses
            .Include(c => c.Chapters)
                .ThenInclude(ch => ch.Lessons)
            .Where(c => c.IsPublished)
            .OrderBy(c => c.OrderIndex);

        var courses = await query.ToListAsync();

        var courseDtos = new List<CourseDto>();
        foreach (var course in courses)
        {
            var totalMinutes = course.Chapters.Sum(ch => ch.EstimatedMinutes);
            var totalLessons = course.Chapters.Sum(ch => ch.Lessons.Count);

            double progress = 0;
            bool completed = false;
            if (userId != null)
            {
                var userProgress = await _context.UserProgresses
                    .FirstOrDefaultAsync(up => up.UserId == userId && up.CourseId == course.Id);
                if (userProgress != null)
                {
                    progress = userProgress.ProgressPercent;
                    completed = userProgress.IsCompleted;
                }
            }

            courseDtos.Add(new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Subtitle = course.Subtitle,
                Description = course.Description,
                ThumbnailUrl = course.ThumbnailUrl,
                ColorHex = course.ColorHex,
                Level = course.Level.ToString(),
                OrderIndex = course.OrderIndex,
                IconName = course.IconName,
                ChapterCount = course.Chapters.Count,
                TotalEstimatedMinutes = totalMinutes,
                UserProgressPercent = progress,
                IsUserCompleted = completed
            });
        }

        return courseDtos;
    }

    public async Task<CourseDetailDto?> GetCourseByIdAsync(int courseId, string? userId = null)
    {
        var course = await _context.Courses
            .Include(c => c.Chapters.OrderBy(ch => ch.OrderIndex))
                .ThenInclude(ch => ch.Lessons.OrderBy(l => l.OrderIndex))
            .Include(c => c.Chapters)
                .ThenInclude(ch => ch.QuizQuestions)
            .FirstOrDefaultAsync(c => c.Id == courseId);

        if (course == null) return null;

        double progress = 0;
        bool completed = false;
        if (userId != null)
        {
            var userProgress = await _context.UserProgresses
                .FirstOrDefaultAsync(up => up.UserId == userId && up.CourseId == course.Id);
            if (userProgress != null)
            {
                progress = userProgress.ProgressPercent;
                completed = userProgress.IsCompleted;
            }
        }

        var completedChapterIds = new HashSet<int>();
        if (userId != null)
        {
            var completedChapters = await _context.UserQuizAttempts
                .Where(qa => qa.UserId == userId && qa.IsPassed)
                .Select(qa => qa.ChapterId)
                .ToListAsync();
            completedChapterIds = completedChapters.ToHashSet();
        }

        return new CourseDetailDto
        {
            Id = course.Id,
            Title = course.Title,
            Subtitle = course.Subtitle,
            Description = course.Description,
            ThumbnailUrl = course.ThumbnailUrl,
            ColorHex = course.ColorHex,
            Level = course.Level.ToString(),
            OrderIndex = course.OrderIndex,
            IconName = course.IconName,
            Chapters = course.Chapters.Select(ch => new ChapterDto
            {
                Id = ch.Id,
                CourseId = ch.CourseId,
                Title = ch.Title,
                Description = ch.Description,
                OrderIndex = ch.OrderIndex,
                EstimatedMinutes = ch.EstimatedMinutes,
                LessonCount = ch.Lessons.Count,
                QuizQuestionCount = ch.QuizQuestions.Count,
                IsCompleted = completedChapterIds.Contains(ch.Id),
                Lessons = ch.Lessons.Select(l => new LessonDto
                {
                    Id = l.Id,
                    ChapterId = l.ChapterId,
                    Title = l.Title,
                    ContentMarkdown = l.ContentMarkdown,
                    ContentHtml = l.ContentHtml,
                    ImageUrl = l.ImageUrl,
                    CodeExample = l.CodeExample,
                    CodeLanguage = l.CodeLanguage,
                    OrderIndex = l.OrderIndex,
                    EstimatedMinutes = l.EstimatedMinutes
                }).ToList()
            }).ToList(),
            UserProgressPercent = progress,
            IsUserCompleted = completed
        };
    }

    public async Task<ChapterDto?> GetChapterByIdAsync(int chapterId, string? userId = null)
    {
        var chapter = await _context.Chapters
            .Include(ch => ch.Lessons.OrderBy(l => l.OrderIndex))
            .Include(ch => ch.QuizQuestions.OrderBy(q => q.OrderIndex))
                .ThenInclude(q => q.Options.OrderBy(o => o.OrderIndex))
            .FirstOrDefaultAsync(ch => ch.Id == chapterId);

        if (chapter == null) return null;

        bool isCompleted = false;
        if (userId != null)
        {
            isCompleted = await _context.UserQuizAttempts
                .AnyAsync(qa => qa.UserId == userId && qa.ChapterId == chapterId && qa.IsPassed);
        }

        return new ChapterDto
        {
            Id = chapter.Id,
            CourseId = chapter.CourseId,
            Title = chapter.Title,
            Description = chapter.Description,
            OrderIndex = chapter.OrderIndex,
            EstimatedMinutes = chapter.EstimatedMinutes,
            LessonCount = chapter.Lessons.Count,
            QuizQuestionCount = chapter.QuizQuestions.Count,
            IsCompleted = isCompleted,
            Lessons = chapter.Lessons.Select(l => new LessonDto
            {
                Id = l.Id,
                ChapterId = l.ChapterId,
                Title = l.Title,
                ContentMarkdown = l.ContentMarkdown,
                ContentHtml = l.ContentHtml,
                ImageUrl = l.ImageUrl,
                CodeExample = l.CodeExample,
                CodeLanguage = l.CodeLanguage,
                OrderIndex = l.OrderIndex,
                EstimatedMinutes = l.EstimatedMinutes
            }).ToList(),
            QuizQuestions = chapter.QuizQuestions.Select(q => new QuizQuestionDto
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
            }).ToList()
        };
    }

    public async Task<LessonDto?> GetLessonByIdAsync(int lessonId)
    {
        var lesson = await _context.Lessons
            .FirstOrDefaultAsync(l => l.Id == lessonId);

        if (lesson == null) return null;

        return new LessonDto
        {
            Id = lesson.Id,
            ChapterId = lesson.ChapterId,
            Title = lesson.Title,
            ContentMarkdown = lesson.ContentMarkdown,
            ContentHtml = lesson.ContentHtml,
            ImageUrl = lesson.ImageUrl,
            CodeExample = lesson.CodeExample,
            CodeLanguage = lesson.CodeLanguage,
            OrderIndex = lesson.OrderIndex,
            EstimatedMinutes = lesson.EstimatedMinutes
        };
    }
}
