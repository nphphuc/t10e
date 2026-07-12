using Microsoft.EntityFrameworkCore;
using SWD392_LMS.Application.DTOs;
using SWD392_LMS.Application.Interfaces;
using SWD392_LMS.Domain.Entities;

namespace SWD392_LMS.Application.Services;

public class UserService : IUserService
{
    private readonly IApplicationDbContext _context;

    public UserService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfileDto?> GetUserProfileAsync(string userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;

        var inProgress = await _context.UserProgresses
            .CountAsync(up => up.UserId == userId && !up.IsCompleted);
        var completed = await _context.UserProgresses
            .CountAsync(up => up.UserId == userId && up.IsCompleted);
        var totalAttempts = await _context.UserQuizAttempts
            .CountAsync(qa => qa.UserId == userId);
        var avgScore = await _context.UserQuizAttempts
            .Where(qa => qa.UserId == userId)
            .Select(qa => (double?)qa.ScorePercent)
            .AverageAsync() ?? 0;

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? "",
            AvatarUrl = user.AvatarUrl,
            Bio = user.Bio,
            CreatedAt = user.CreatedAt,
            CoursesInProgress = inProgress,
            CoursesCompleted = completed,
            TotalQuizAttempts = totalAttempts,
            AverageQuizScore = Math.Round(avgScore, 1)
        };
    }

    public async Task<DashboardDto> GetDashboardAsync(string userId)
    {
        var profile = await GetUserProfileAsync(userId);
        var recentProgress = await _context.UserProgresses
            .Where(up => up.UserId == userId)
            .Include(up => up.Course)
            .OrderByDescending(up => up.LastAccessedAt)
            .Take(5)
            .ToListAsync();

        var totalCourses = await _context.Courses.CountAsync(c => c.IsPublished);
        var completedCourses = await _context.UserProgresses
            .CountAsync(up => up.UserId == userId && up.IsCompleted);
        var ongoingCourses = await _context.UserProgresses
            .CountAsync(up => up.UserId == userId && !up.IsCompleted);

        return new DashboardDto
        {
            Profile = profile!,
            RecentCourses = recentProgress.Select(up => new UserProgressDto
            {
                CourseId = up.CourseId,
                CourseTitle = up.Course.Title,
                CourseColorHex = up.Course.ColorHex,
                CourseIconName = up.Course.IconName,
                CompletedLessons = up.CompletedLessons,
                TotalLessons = up.TotalLessons,
                ProgressPercent = up.ProgressPercent,
                IsCompleted = up.IsCompleted,
                StartedAt = up.StartedAt,
                CompletedAt = up.CompletedAt,
                LastAccessedAt = up.LastAccessedAt
            }).ToList(),
            TotalCourses = totalCourses,
            CompletedCourses = completedCourses,
            OngoingCourses = ongoingCourses
        };
    }

    public async Task<List<UserProgressDto>> GetUserProgressAsync(string userId)
    {
        var progresses = await _context.UserProgresses
            .Where(up => up.UserId == userId)
            .Include(up => up.Course)
            .OrderByDescending(up => up.LastAccessedAt)
            .ToListAsync();

        return progresses.Select(up => new UserProgressDto
        {
            CourseId = up.CourseId,
            CourseTitle = up.Course.Title,
            CourseColorHex = up.Course.ColorHex,
            CourseIconName = up.Course.IconName,
            CompletedLessons = up.CompletedLessons,
            TotalLessons = up.TotalLessons,
            ProgressPercent = up.ProgressPercent,
            IsCompleted = up.IsCompleted,
            StartedAt = up.StartedAt,
            CompletedAt = up.CompletedAt,
            LastAccessedAt = up.LastAccessedAt
        }).ToList();
    }

    public async Task<bool> UpdateProfileAsync(string userId, string? fullName, string? bio)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return false;

        if (fullName != null) user.FullName = fullName;
        if (bio != null) user.Bio = bio;

        await _context.SaveChangesAsync();
        return true;
    }
}
