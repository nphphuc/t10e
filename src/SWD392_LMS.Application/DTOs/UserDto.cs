namespace SWD392_LMS.Application.DTOs;

public class UserProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CoursesInProgress { get; set; }
    public int CoursesCompleted { get; set; }
    public int TotalQuizAttempts { get; set; }
    public double AverageQuizScore { get; set; }
}

public class UserProgressDto
{
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string? CourseColorHex { get; set; }
    public string? CourseIconName { get; set; }
    public int CompletedLessons { get; set; }
    public int TotalLessons { get; set; }
    public double ProgressPercent { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime LastAccessedAt { get; set; }
}

public class DashboardDto
{
    public UserProfileDto Profile { get; set; } = null!;
    public List<UserProgressDto> RecentCourses { get; set; } = new();
    public int TotalCourses { get; set; }
    public int CompletedCourses { get; set; }
    public int OngoingCourses { get; set; }
}
