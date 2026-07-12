namespace SWD392_LMS.Domain.Entities;

public class UserProgress
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public int? CurrentChapterId { get; set; }
    public int CompletedLessons { get; set; }
    public int TotalLessons { get; set; }
    public double ProgressPercent { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime LastAccessedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
