using SWD392_LMS.Domain.Enums;

namespace SWD392_LMS.Domain.Entities;

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? ColorHex { get; set; }
    public CourseLevel Level { get; set; } = CourseLevel.Beginner;
    public int OrderIndex { get; set; }
    public string? IconName { get; set; }
    public string? SlideFileName { get; set; }
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
    public ICollection<UserProgress> UserProgresses { get; set; } = new List<UserProgress>();
}
