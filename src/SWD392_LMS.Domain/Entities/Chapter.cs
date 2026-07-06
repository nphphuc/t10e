namespace SWD392_LMS.Domain.Entities;

public class Chapter
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
    public int EstimatedMinutes { get; set; } = 10;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Course Course { get; set; } = null!;
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public ICollection<QuizQuestion> QuizQuestions { get; set; } = new List<QuizQuestion>();
}
