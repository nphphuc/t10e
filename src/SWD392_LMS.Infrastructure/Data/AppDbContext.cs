using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SWD392_LMS.Application.Interfaces;
using SWD392_LMS.Domain.Entities;

namespace SWD392_LMS.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Chapter> Chapters => Set<Chapter>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<QuizOption> QuizOptions => Set<QuizOption>();
    public DbSet<UserProgress> UserProgresses => Set<UserProgress>();
    public DbSet<UserQuizAttempt> UserQuizAttempts => Set<UserQuizAttempt>();
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Course
        builder.Entity<Course>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Title).HasMaxLength(200).IsRequired();
            entity.Property(c => c.Description).HasMaxLength(2000);
            entity.Property(c => c.Subtitle).HasMaxLength(300);
            entity.Property(c => c.ThumbnailUrl).HasMaxLength(500);
            entity.Property(c => c.ColorHex).HasMaxLength(9);
            entity.Property(c => c.IconName).HasMaxLength(100);
            entity.Property(c => c.SlideFileName).HasMaxLength(200);
            entity.HasIndex(c => c.OrderIndex);
        });

        // Chapter
        builder.Entity<Chapter>(entity =>
        {
            entity.HasKey(ch => ch.Id);
            entity.Property(ch => ch.Title).HasMaxLength(200).IsRequired();
            entity.Property(ch => ch.Description).HasMaxLength(1000);
            entity.HasOne(ch => ch.Course)
                .WithMany(c => c.Chapters)
                .HasForeignKey(ch => ch.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(ch => new { ch.CourseId, ch.OrderIndex });
        });

        // Lesson
        builder.Entity<Lesson>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.Property(l => l.Title).HasMaxLength(200).IsRequired();
            entity.HasOne(l => l.Chapter)
                .WithMany(ch => ch.Lessons)
                .HasForeignKey(l => l.ChapterId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(l => new { l.ChapterId, l.OrderIndex });
        });

        // QuizQuestion
        builder.Entity<QuizQuestion>(entity =>
        {
            entity.HasKey(q => q.Id);
            entity.Property(q => q.QuestionText).HasMaxLength(2000).IsRequired();
            entity.HasOne(q => q.Chapter)
                .WithMany(ch => ch.QuizQuestions)
                .HasForeignKey(q => q.ChapterId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(q => new { q.ChapterId, q.OrderIndex });
        });

        // QuizOption
        builder.Entity<QuizOption>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.OptionText).HasMaxLength(500).IsRequired();
            entity.HasOne(o => o.QuizQuestion)
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuizQuestionId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(o => new { o.QuizQuestionId, o.OrderIndex });
        });

        // UserProgress
        builder.Entity<UserProgress>(entity =>
        {
            entity.HasKey(up => up.Id);
            entity.HasOne(up => up.User)
                .WithMany(u => u.UserProgresses)
                .HasForeignKey(up => up.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(up => up.Course)
                .WithMany(c => c.UserProgresses)
                .HasForeignKey(up => up.CourseId)
                .OnDelete(DeleteBehavior.NoAction);
            entity.HasIndex(up => new { up.UserId, up.CourseId }).IsUnique();
        });

        // UserQuizAttempt
        builder.Entity<UserQuizAttempt>(entity =>
        {
            entity.HasKey(qa => qa.Id);
            entity.HasOne(qa => qa.User)
                .WithMany(u => u.QuizAttempts)
                .HasForeignKey(qa => qa.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(qa => qa.Chapter)
                .WithMany()
                .HasForeignKey(qa => qa.ChapterId)
                .OnDelete(DeleteBehavior.NoAction);
            entity.HasIndex(qa => new { qa.UserId, qa.ChapterId, qa.AttemptedAt });
        });
    }
}
