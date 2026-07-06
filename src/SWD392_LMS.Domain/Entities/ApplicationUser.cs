using Microsoft.AspNetCore.Identity;

namespace SWD392_LMS.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public ICollection<UserProgress> UserProgresses { get; set; } = new List<UserProgress>();
    public ICollection<UserQuizAttempt> QuizAttempts { get; set; } = new List<UserQuizAttempt>();
}
