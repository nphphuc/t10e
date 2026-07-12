using SWD392_LMS.Application.DTOs;

namespace SWD392_LMS.Application.Interfaces;

public interface IQuizService
{
    Task<List<QuizQuestionDto>> GetQuizQuestionsAsync(int chapterId);
    Task<QuizResultDto> SubmitQuizAsync(string userId, QuizSubmitDto submit);
    Task<List<QuizResultDto>> GetQuizHistoryAsync(string userId, int chapterId);
}
