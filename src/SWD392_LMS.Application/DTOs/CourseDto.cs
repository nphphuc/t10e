using SWD392_LMS.Domain.Enums;

namespace SWD392_LMS.Application.DTOs;

public class CourseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? ColorHex { get; set; }
    public string Level { get; set; } = "Beginner";
    public int OrderIndex { get; set; }
    public string? IconName { get; set; }
    public int ChapterCount { get; set; }
    public int TotalEstimatedMinutes { get; set; }
    public double UserProgressPercent { get; set; }
    public bool IsUserCompleted { get; set; }
}

public class CourseDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? ColorHex { get; set; }
    public string Level { get; set; } = "Beginner";
    public int OrderIndex { get; set; }
    public string? IconName { get; set; }
    public List<ChapterDto> Chapters { get; set; } = new();
    public double UserProgressPercent { get; set; }
    public bool IsUserCompleted { get; set; }
}

public class ChapterDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
    public int EstimatedMinutes { get; set; }
    public int LessonCount { get; set; }
    public int QuizQuestionCount { get; set; }
    public bool IsCompleted { get; set; }
    public List<LessonDto> Lessons { get; set; } = new();
    public List<QuizQuestionDto> QuizQuestions { get; set; } = new();
}

public class LessonDto
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
    public int EstimatedMinutes { get; set; }
}
