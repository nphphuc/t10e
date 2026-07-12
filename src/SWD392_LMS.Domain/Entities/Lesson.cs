namespace SWD392_LMS.Domain.Entities;

public class Lesson
{
    public int Id { get; set; }
    public int ChapterId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? ContentMarkdown { get; set; }
    public string? ContentHtml { get; set; }
    public string? ImageUrl { get; set; }
    public string? CodeExample { get; set; }
    public string? CodeLanguage { get; set; }
    public int OrderIndex { get; set; }
    public int EstimatedMinutes { get; set; } = 5;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Chapter Chapter { get; set; } = null!;
}
