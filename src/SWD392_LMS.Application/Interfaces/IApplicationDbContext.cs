using Microsoft.EntityFrameworkCore;
using SWD392_LMS.Domain.Entities;

namespace SWD392_LMS.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Course> Courses { get; }
    DbSet<Chapter> Chapters { get; }
    DbSet<Lesson> Lessons { get; }
    DbSet<QuizQuestion> QuizQuestions { get; }
    DbSet<QuizOption> QuizOptions { get; }
    DbSet<UserProgress> UserProgresses { get; }
    DbSet<UserQuizAttempt> UserQuizAttempts { get; }
    DbSet<ApplicationUser> Users { get; }
    DbSet<TEntity> Set<TEntity>() where TEntity : class;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
