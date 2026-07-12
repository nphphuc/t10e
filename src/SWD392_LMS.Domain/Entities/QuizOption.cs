namespace SWD392_LMS.Domain.Entities;

public class QuizOption
{
    public int Id { get; set; }
    public int QuizQuestionId { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public int OrderIndex { get; set; }

    // Navigation properties
    public QuizQuestion QuizQuestion { get; set; } = null!;
}
