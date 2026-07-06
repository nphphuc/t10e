using SWD392_LMS.Application.DTOs;

namespace SWD392_LMS.Application.Interfaces;

public interface ICourseService
{
    Task<List<CourseDto>> GetAllCoursesAsync(string? userId = null);
    Task<CourseDetailDto?> GetCourseByIdAsync(int courseId, string? userId = null);
    Task<ChapterDto?> GetChapterByIdAsync(int chapterId, string? userId = null);
    Task<LessonDto?> GetLessonByIdAsync(int lessonId);
}
