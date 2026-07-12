namespace SWD392_LMS.Domain.Entities;

public class UserQuizAttempt
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int ChapterId { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public double ScorePercent { get; set; }
    public bool IsPassed { get; set; }
    public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public Chapter Chapter { get; set; } = null!;
}
