using SWD392_LMS.Application.DTOs;

namespace SWD392_LMS.Application.Interfaces;

public interface IUserService
{
    Task<UserProfileDto?> GetUserProfileAsync(string userId);
    Task<DashboardDto> GetDashboardAsync(string userId);
    Task<List<UserProgressDto>> GetUserProgressAsync(string userId);
    Task<bool> UpdateProfileAsync(string userId, string? fullName, string? bio);
}
