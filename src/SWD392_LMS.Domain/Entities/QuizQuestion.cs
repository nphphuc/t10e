using SWD392_LMS.Domain.Enums;

namespace SWD392_LMS.Domain.Entities;

public class QuizQuestion
{
    public int Id { get; set; }
    public int ChapterId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string? Explanation { get; set; }
    public QuestionType Type { get; set; } = QuestionType.MultipleChoice;
    public QuizDifficulty Difficulty { get; set; } = QuizDifficulty.Easy;
    public int OrderIndex { get; set; }
    public int Points { get; set; } = 1;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Chapter Chapter { get; set; } = null!;
    public ICollection<QuizOption> Options { get; set; } = new List<QuizOption>();
}
