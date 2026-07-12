using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SWD392_LMS.Domain.Entities;
using SWD392_LMS.Domain.Enums;

namespace SWD392_LMS.Infrastructure.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Seed Roles
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        if (!await roleManager.RoleExistsAsync("User"))
            await roleManager.CreateAsync(new IdentityRole("User"));

        // Seed users
        await EnsureSeedUserAsync(
            userManager,
            email: "admin@swd392.com",
            userName: "admin@swd392.com",
            password: "Admin@123",
            role: "Admin",
            fullName: "Admin");

        await EnsureSeedUserAsync(
            userManager,
            email: "demo@swd392.com",
            userName: "demo@swd392.com",
            password: "Demo@123",
            role: "User",
            fullName: "Demo Learner",
            bio: "Software Engineering student exploring software design and architecture.");

        // Seed Courses if empty
        if (!await context.Courses.AnyAsync())
        {
            var courses = GetSeedCourses();
            context.Courses.AddRange(courses);
            await context.SaveChangesAsync();
        }

        await EnsureChapterQuizQuestionCountsAsync(context);
    }

    private static async Task EnsureSeedUserAsync(
        UserManager<ApplicationUser> userManager,
        string email,
        string userName,
        string password,
        string role,
        string fullName,
        string? bio = null)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = userName,
                Email = email,
                EmailConfirmed = true,
                FullName = fullName,
                Bio = bio,
                CreatedAt = DateTime.UtcNow
            };

            var createResult = await userManager.CreateAsync(user, password);
            ThrowIfFailed(createResult, $"create seed user {email}");
        }
        else
        {
            user.UserName = userName;
            user.Email = email;
            user.EmailConfirmed = true;
            user.FullName = fullName;
            user.Bio = bio ?? user.Bio;
            user.LockoutEnd = null;
            user.AccessFailedCount = 0;

            var updateResult = await userManager.UpdateAsync(user);
            ThrowIfFailed(updateResult, $"update seed user {email}");

            if (!await userManager.CheckPasswordAsync(user, password))
            {
                if (await userManager.HasPasswordAsync(user))
                {
                    var removeResult = await userManager.RemovePasswordAsync(user);
                    ThrowIfFailed(removeResult, $"remove old seed password for {email}");
                }

                var addPasswordResult = await userManager.AddPasswordAsync(user, password);
                ThrowIfFailed(addPasswordResult, $"reset seed password for {email}");
            }
        }

        if (!await userManager.IsInRoleAsync(user, role))
        {
            var roleResult = await userManager.AddToRoleAsync(user, role);
            ThrowIfFailed(roleResult, $"assign {role} role to {email}");
        }
    }

    private static void ThrowIfFailed(IdentityResult result, string action)
    {
        if (result.Succeeded) return;

        var errors = string.Join("; ", result.Errors.Select(error => error.Description));
        throw new InvalidOperationException($"Failed to {action}: {errors}");
    }

    private static async Task EnsureChapterQuizQuestionCountsAsync(AppDbContext context)
    {
        const int targetQuestionCount = 10;

        var chapters = await context.Chapters
            .Include(ch => ch.Course)
            .Include(ch => ch.Lessons)
            .Include(ch => ch.QuizQuestions)
            .ToListAsync();

        foreach (var chapter in chapters)
        {
            var existingCount = chapter.QuizQuestions.Count;
            if (existingCount >= targetQuestionCount)
            {
                continue;
            }

            var nextOrderIndex = chapter.QuizQuestions.Any()
                ? chapter.QuizQuestions.Max(q => q.OrderIndex) + 1
                : 1;

            var supplementalQuestions = BuildSupplementalQuizQuestions(chapter);
            foreach (var question in supplementalQuestions.Take(targetQuestionCount - existingCount))
            {
                question.ChapterId = chapter.Id;
                question.OrderIndex = nextOrderIndex++;
                context.QuizQuestions.Add(question);
            }
        }

        await context.SaveChangesAsync();
    }

    private static List<QuizQuestion> BuildSupplementalQuizQuestions(Chapter chapter)
    {
        var courseTitle = CleanQuizText(chapter.Course.Title);
        var chapterTitle = CleanQuizText(chapter.Title);
        var chapterDescription = CleanQuizText(chapter.Description ?? $"core ideas in {chapterTitle}");
        var lessonTitles = chapter.Lessons
            .OrderBy(l => l.OrderIndex)
            .Select(l => CleanQuizText(l.Title))
            .Where(title => !string.IsNullOrWhiteSpace(title))
            .Take(4)
            .ToList();

        var firstLesson = lessonTitles.ElementAtOrDefault(0) ?? chapterTitle;
        var secondLesson = lessonTitles.ElementAtOrDefault(1) ?? "supporting concepts";
        var thirdLesson = lessonTitles.ElementAtOrDefault(2) ?? "practical application";
        var fourthLesson = lessonTitles.ElementAtOrDefault(3) ?? "review and assessment";

        return new List<QuizQuestion>
        {
            CreateMultipleChoiceQuestion(
                $"What is the main focus of the chapter '{chapterTitle}'?",
                $"The chapter focuses on {chapterDescription}.",
                $"Understanding {chapterDescription}",
                "Memorizing unrelated implementation details",
                "Ignoring the course context",
                "Replacing software design with deployment only",
                QuizDifficulty.Easy,
                1),

            CreateMultipleChoiceQuestion(
                $"Which course does the chapter '{chapterTitle}' belong to?",
                $"'{chapterTitle}' is part of the course '{courseTitle}'.",
                courseTitle,
                "Database Administration",
                "Computer Graphics Rendering",
                "Network Cabling Fundamentals",
                QuizDifficulty.Easy,
                1),

            CreateMultipleChoiceQuestion(
                $"Which lesson topic should be reviewed first in '{chapterTitle}'?",
                $"The first listed lesson is '{firstLesson}', making it a natural starting point.",
                firstLesson,
                secondLesson,
                thirdLesson,
                fourthLesson,
                QuizDifficulty.Easy,
                1),

            CreateMultipleChoiceQuestion(
                $"Why are quiz questions included after studying '{chapterTitle}'?",
                "The quiz checks whether the learner can recall, distinguish, and apply the chapter concepts.",
                "To verify understanding of the chapter concepts",
                "To skip all lesson content",
                "To replace reading with random guessing",
                "To hide the learner's progress",
                QuizDifficulty.Easy,
                1),

            CreateMultipleChoiceQuestion(
                $"In '{chapterTitle}', what is the best way to approach a design concept?",
                "Design concepts should be connected to requirements, structure, behavior, and trade-offs.",
                "Relate it to requirements, structure, behavior, and trade-offs",
                "Treat it as a fixed rule with no context",
                "Only memorize the term spelling",
                "Avoid comparing alternatives",
                QuizDifficulty.Medium,
                2),

            CreateMultipleChoiceQuestion(
                $"Which activity best supports learning '{chapterTitle}'?",
                "Reviewing lesson examples and checking them against the quiz feedback reinforces understanding.",
                "Review examples and compare them with quiz feedback",
                "Close the lesson before reading it",
                "Select answers without reading the options",
                "Ignore explanations after submission",
                QuizDifficulty.Medium,
                2),

            CreateMultipleChoiceQuestion(
                $"What should a learner do after missing a question in '{chapterTitle}'?",
                "The answer review explains the correct choice and points learners back to the relevant concept.",
                "Use the answer review to revisit the concept",
                "Assume the score cannot improve",
                "Skip the rest of the course",
                "Delete previous progress",
                QuizDifficulty.Easy,
                1),

            CreateMultipleChoiceQuestion(
                $"Which topic is most directly connected to this chapter's learning path?",
                $"The chapter lessons include '{firstLesson}', '{secondLesson}', and related topics.",
                secondLesson,
                "Unrelated hardware assembly",
                "Personal finance budgeting",
                "Image color correction",
                QuizDifficulty.Medium,
                2),

            CreateMultipleChoiceQuestion(
                $"What does a passing quiz score indicate for '{chapterTitle}'?",
                "A passing score indicates enough understanding to mark progress for the chapter.",
                "The learner has demonstrated enough understanding to progress",
                "The course content has been removed",
                "The learner no longer needs any future review",
                "All other chapters are automatically completed",
                QuizDifficulty.Medium,
                2),

            CreateMultipleChoiceQuestion(
                $"How should the score and answer review be used after completing '{chapterTitle}'?",
                "The score summarizes performance, while the review shows correct and incorrect selections.",
                "Use the score for performance and the review for correction",
                "Only look at the score and ignore explanations",
                "Use the review before answering any question",
                "Treat incorrect answers as already correct",
                QuizDifficulty.Easy,
                1)
        };
    }

    private static QuizQuestion CreateMultipleChoiceQuestion(
        string questionText,
        string explanation,
        string correctOption,
        string optionTwo,
        string optionThree,
        string optionFour,
        QuizDifficulty difficulty,
        int points)
    {
        return new QuizQuestion
        {
            QuestionText = questionText,
            Explanation = explanation,
            Type = QuestionType.MultipleChoice,
            Difficulty = difficulty,
            Points = points,
            Options = new List<QuizOption>
            {
                new() { OptionText = correctOption, IsCorrect = true, OrderIndex = 1 },
                new() { OptionText = optionTwo, IsCorrect = false, OrderIndex = 2 },
                new() { OptionText = optionThree, IsCorrect = false, OrderIndex = 3 },
                new() { OptionText = optionFour, IsCorrect = false, OrderIndex = 4 }
            }
        };
    }

    private static string CleanQuizText(string text)
    {
        return string.IsNullOrWhiteSpace(text)
            ? "the current topic"
            : text.Replace("\"", "'").Trim();
    }

    private static List<Course> GetSeedCourses()
    {
        var courses = new List<Course>
        {
            new()
            {
                Title = "Introduction to Software Engineering",
                Subtitle = "Foundations of software development and engineering principles",
                Description = "This course provides a comprehensive introduction to software engineering, covering the fundamental concepts, principles, and practices that form the foundation of modern software development. Learn about the software crisis, engineering approach, and key process models.",
                ColorHex = "#6366F1",
                IconName = "bi-laptop",
                Level = CourseLevel.Beginner,
                OrderIndex = 1,
                SlideFileName = "Ch01_Introduction.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "What is Software Engineering?",
                        Description = "Understanding the discipline and its importance",
                        OrderIndex = 1,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Definition and Scope", ContentHtml = "<p>Software engineering is the systematic application of engineering approaches to the development of software. Unlike programming, which focuses on writing code, software engineering encompasses the entire lifecycle of software — from conception and design to testing, deployment, and maintenance.</p><p>Key aspects include: <ul><li><strong>Systematic approach</strong> — following structured methodologies</li><li><strong>Engineering principles</strong> — applying proven practices</li><li><strong>Quality focus</strong> — ensuring reliability and maintainability</li><li><strong>Team collaboration</strong> — working effectively in groups</li></ul></p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "The Software Crisis", ContentHtml = "<p>The <strong>software crisis</strong> refers to the challenges faced in software development during the 1960s-1980s:</p><ul><li>Projects running over budget and schedule</li><li>Software being unreliable and hard to maintain</li><li>Poor performance and quality</li><li>Difficulty meeting user requirements</li></ul><p>This led to the birth of software engineering as a discipline at the NATO Conference in 1968.</p>", OrderIndex = 2, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is the primary difference between software engineering and programming?",
                                Explanation = "Software engineering encompasses the entire software lifecycle with systematic engineering approaches, while programming focuses mainly on writing code.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 1, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Software engineering includes the entire software lifecycle with engineering principles", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "Software engineering only focuses on testing", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Programming is broader than software engineering", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "There is no difference between them", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "When did the term 'software engineering' first emerge?",
                                Explanation = "The term was coined at the NATO Software Engineering Conference in 1968 as a response to the software crisis.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 2, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "NATO Conference 1968", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "MIT Lab 1975", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "IEEE Symposium 1980", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Microsoft 1990", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    },
                    new()
                    {
                        Title = "Key Software Engineering Concepts",
                        Description = "Essential concepts every software engineer should know",
                        OrderIndex = 2,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Software Processes", ContentHtml = "<p>A <strong>software process</strong> is a structured set of activities required to develop a software system. Common activities include:</p><ul><li><strong>Specification</strong> — defining what the system should do</li><li><strong>Design & Implementation</strong> — defining the system architecture and writing code</li><li><strong>Validation</strong> — checking that the system meets requirements</li><li><strong>Evolution</strong> — modifying the system in response to changing needs</li></ul>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Quality Attributes", ContentHtml = "<p>Software quality attributes (non-functional requirements) are critical for successful software:</p><ul><li><strong>Reliability</strong> — system operates without failure</li><li><strong>Maintainability</strong> — ease of making changes</li><li><strong>Usability</strong> — ease of use by end users</li><li><strong>Performance</strong> — responsiveness and throughput</li><li><strong>Security</strong> — protection against threats</li></ul>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Software Development Life Cycle (SDLC)", ContentHtml = "<p>The SDLC defines phases of software development:</p><ol><li><strong>Planning</strong> — project scope and feasibility</li><li><strong>Analysis</strong> — gathering requirements</li><li><strong>Design</strong> — system architecture and design</li><li><strong>Implementation</strong> — coding and development</li><li><strong>Testing</strong> — verification and validation</li><li><strong>Deployment</strong> — releasing to production</li><li><strong>Maintenance</strong> — ongoing support and updates</li></ol>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which of the following is NOT a typical software process activity?",
                                Explanation = "Software process activities include specification, design/implementation, validation, and evolution. Marketing is a business activity, not part of the core software development process.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 1, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Specification", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Marketing", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Design & Implementation", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Validation", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "What is the correct order of the SDLC phases?",
                                Explanation = "SDLC follows: Planning → Analysis → Design → Implementation → Testing → Deployment → Maintenance.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Planning → Analysis → Design → Implementation → Testing → Deployment → Maintenance", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "Design → Planning → Analysis → Implementation → Testing → Maintenance → Deployment", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Analysis → Planning → Design → Testing → Implementation → Deployment → Maintenance", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Implementation → Testing → Planning → Analysis → Design → Deployment → Maintenance", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            },
            new()
            {
                Title = "Overview of UML Notation",
                Subtitle = "Visual modeling with the Unified Modeling Language",
                Description = "Learn how to use UML (Unified Modeling Language) to visually represent software systems. This course covers class diagrams, use case diagrams, sequence diagrams, and more — essential tools for every software engineer.",
                ColorHex = "#8B5CF6",
                IconName = "bi-diagram-3",
                Level = CourseLevel.Beginner,
                OrderIndex = 2,
                SlideFileName = "Ch02_Overview of UML Notation.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Introduction to UML",
                        Description = "What is UML and why use it?",
                        OrderIndex = 1,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "What is UML?", ContentHtml = "<p><strong>Unified Modeling Language (UML)</strong> is a standardized general-purpose modeling language used in software engineering to visualize, specify, construct, and document software systems.</p><p>UML was created by Grady Booch, Ivar Jacobson, and James Rumbaugh (the \"Three Amigos\") and is maintained by the OMG (Object Management Group).</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Types of UML Diagrams", ContentHtml = "<p>UML has <strong>14 types of diagrams</strong> divided into two categories:</p><h4>Structural Diagrams</h4><ul><li>Class Diagram</li><li>Component Diagram</li><li>Deployment Diagram</li><li>Object Diagram</li><li>Package Diagram</li><li>Composite Structure Diagram</li><li>Profile Diagram</li></ul><h4>Behavioral Diagrams</h4><ul><li>Use Case Diagram</li><li>Activity Diagram</li><li>State Machine Diagram</li><li>Sequence Diagram</li><li>Communication Diagram</li><li>Interaction Overview Diagram</li><li>Timing Diagram</li></ul>", OrderIndex = 2, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Who created UML?",
                                Explanation = "UML was created by Grady Booch, Ivar Jacobson, and James Rumbaugh (the \"Three Amigos\").",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 1, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Booch, Jacobson, and Rumbaugh", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "Microsoft Corporation", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "IBM Research", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "MIT Computer Science Lab", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "Class Diagram belongs to which category of UML diagrams?",
                                Explanation = "Class diagrams are structural diagrams because they describe the static structure of a system.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 2, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Behavioral Diagrams", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Structural Diagrams", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Interaction Diagrams", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "All of the above", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    },
                    new()
                    {
                        Title = "Key UML Diagrams for SWD",
                        Description = "Most commonly used UML diagrams in software design",
                        OrderIndex = 2,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Use Case Diagrams", ContentHtml = "<p><strong>Use Case Diagrams</strong> show the interactions between actors (users/external systems) and the system's functionality. They help capture system requirements and scope.</p><p>Key elements: Actors (stick figures), Use Cases (ovals), System Boundary (rectangle), Relationships (lines).</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Class Diagrams", ContentHtml = "<p><strong>Class Diagrams</strong> represent the static structure of a system, showing classes, attributes, methods, and relationships (inheritance, association, aggregation, composition). They are the most widely used UML diagrams.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Sequence Diagrams", ContentHtml = "<p><strong>Sequence Diagrams</strong> show how objects interact over time, illustrating the message flow between components. They help visualize the dynamic behavior of the system for specific use cases.</p>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which UML diagram is best for capturing system requirements from a user's perspective?",
                                Explanation = "Use Case Diagrams capture functional requirements by showing how actors interact with the system.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 1, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Class Diagram", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Use Case Diagram", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Sequence Diagram", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Deployment Diagram", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "Which diagram is best for showing object interactions over time?",
                                Explanation = "Sequence diagrams show the sequence of messages exchanged between objects over time.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 2, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Activity Diagram", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Component Diagram", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Sequence Diagram", IsCorrect = true, OrderIndex = 3 },
                                    new() { OptionText = "Use Case Diagram", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            },
            new()
            {
                Title = "Software Life Cycle Models",
                Subtitle = "Understanding different development process models",
                Description = "Explore various software life cycle models including Waterfall, Agile, Spiral, and Incremental models. Understand when to use each approach and their respective advantages and disadvantages.",
                ColorHex = "#EC4899",
                IconName = "bi-arrow-repeat",
                Level = CourseLevel.Beginner,
                OrderIndex = 3,
                SlideFileName = "Ch03_Software Life Cycle Models and Processes.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Traditional Process Models",
                        Description = "Waterfall, V-Model, and Incremental models",
                        OrderIndex = 1,
                        EstimatedMinutes = 12,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Waterfall Model", ContentHtml = "<p>The <strong>Waterfall Model</strong> is the earliest SDLC approach, with sequential phases flowing downward like a waterfall:</p><ol><li>Requirements Analysis</li><li>System Design</li><li>Implementation</li><li>Testing</li><li>Deployment</li><li>Maintenance</li></ol><p><strong>Pros:</strong> Simple, easy to manage, clear milestones. <strong>Cons:</strong> Inflexible, hard to accommodate changes, late feedback.</p>", OrderIndex = 1, EstimatedMinutes = 6 },
                            new() { Title = "V-Model", ContentHtml = "<p>The <strong>V-Model</strong> (Verification and Validation model) is an extension of the Waterfall model. Each development phase has a corresponding testing phase, creating a V-shape.</p><p>Left side (Verification): Requirements → Design → Implementation<br/>Right side (Validation): Unit Testing → Integration Testing → System Testing → Acceptance Testing</p>", OrderIndex = 2, EstimatedMinutes = 6 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is a major disadvantage of the Waterfall model?",
                                Explanation = "The Waterfall model is inflexible — it's difficult to go back to a previous phase once completed.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 1, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "It is difficult to accommodate changes after moving to the next phase", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "It requires too much customer involvement", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "It works only for web applications", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "It has no testing phase", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    },
                    new()
                    {
                        Title = "Agile Methodology",
                        Description = "Modern iterative and adaptive approaches",
                        OrderIndex = 2,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Agile Manifesto", ContentHtml = "<p>The <strong>Agile Manifesto</strong> (2001) values:</p><ul><li><strong>Individuals and interactions</strong> over processes and tools</li><li><strong>Working software</strong> over comprehensive documentation</li><li><strong>Customer collaboration</strong> over contract negotiation</li><li><strong>Responding to change</strong> over following a plan</li></ul><p>Agile emphasizes iterative development, frequent delivery, and adaptive planning.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Scrum Framework", ContentHtml = "<p><strong>Scrum</strong> is the most popular Agile framework. Key concepts:</p><ul><li><strong>Sprints</strong> — time-boxed iterations (1-4 weeks)</li><li><strong>Product Backlog</strong> — prioritized list of features</li><li><strong>Sprint Backlog</strong> — tasks for the current sprint</li><li><strong>Daily Standup</strong> — 15-minute daily sync meeting</li><li><strong>Sprint Review & Retrospective</strong> — inspect and adapt</li></ul>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "When to Use Agile", ContentHtml = "<p>Agile is best suited for:</p><ul><li>Projects with changing requirements</li><li>Innovative or exploratory development</li><li>Small to medium-sized teams</li><li>Customer-centric products</li></ul><p>Agile may be less suitable for large-scale systems requiring extensive upfront planning.</p>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which value is NOT part of the Agile Manifesto?",
                                Explanation = "The Agile Manifesto values individuals and interactions, working software, customer collaboration, and responding to change. It does not emphasize comprehensive documentation over working software.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Individuals and interactions over processes and tools", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Working software over comprehensive documentation", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Comprehensive planning over responding to change", IsCorrect = true, OrderIndex = 3 },
                                    new() { OptionText = "Customer collaboration over contract negotiation", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "How long does a typical Scrum sprint last?",
                                Explanation = "Sprints are time-boxed iterations typically lasting 1-4 weeks.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 2, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "1-4 weeks", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "6-8 weeks", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "3-6 months", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "1 year", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            },
            new()
            {
                Title = "Software Design & Architecture Concepts",
                Subtitle = "Core principles of software design",
                Description = "Master the fundamental concepts of software design and architecture, including modularity, abstraction, encapsulation, coupling, cohesion, and design patterns.",
                ColorHex = "#F59E0B",
                IconName = "bi-puzzle",
                Level = CourseLevel.Intermediate,
                OrderIndex = 4,
                SlideFileName = "Ch04_Software Design and Architecture Concepts.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Design Fundamentals",
                        Description = "Abstraction, modularity, and design principles",
                        OrderIndex = 1,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Abstraction and Modularity", ContentHtml = "<p><strong>Abstraction</strong> is the process of hiding complex implementation details and exposing only essential features. It helps manage complexity by focusing on what something does rather than how it does it.</p><p><strong>Modularity</strong> divides a system into separate modules that can be developed and tested independently. Each module has a well-defined interface and encapsulates its implementation.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Coupling and Cohesion", ContentHtml = "<p><strong>Coupling</strong> measures how dependent modules are on each other. Low coupling is desirable — modules should be as independent as possible.</p><p><strong>Cohesion</strong> measures how related the elements within a module are. High cohesion is desirable — elements within a module should work together closely.</p><p>Good design = <strong>Low Coupling + High Cohesion</strong></p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "SOLID Principles", ContentHtml = "<p>The <strong>SOLID</strong> principles are five design principles for OOP:</p><ul><li><strong>S</strong>ingle Responsibility — A class should have one reason to change</li><li><strong>O</strong>pen/Closed — Open for extension, closed for modification</li><li><strong>L</strong>iskov Substitution — Subtypes must be substitutable for base types</li><li><strong>I</strong>nterface Segregation — Many specific interfaces > one general interface</li><li><strong>D</strong>ependency Inversion — Depend on abstractions, not concretions</li></ul>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which combination describes good software design?",
                                Explanation = "Good design has low coupling (modules are independent) and high cohesion (related elements are grouped together).",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "High coupling, high cohesion", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Low coupling, low cohesion", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Low coupling, high cohesion", IsCorrect = true, OrderIndex = 3 },
                                    new() { OptionText = "High coupling, low cohesion", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "Which SOLID principle states 'A class should have only one reason to change'?",
                                Explanation = "The Single Responsibility Principle states that a class should have one, and only one, reason to change.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Open/Closed Principle", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Single Responsibility Principle", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Liskov Substitution Principle", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Dependency Inversion Principle", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            },
            new()
            {
                Title = "Overview of Software Architecture",
                Subtitle = "Understanding software architecture styles and patterns",
                Description = "Dive into software architecture — the high-level structure of software systems. Explore architectural styles like Layered, Client-Server, Microservices, and Event-Driven architectures.",
                ColorHex = "#10B981",
                IconName = "bi-layers",
                Level = CourseLevel.Intermediate,
                OrderIndex = 5,
                SlideFileName = "Ch12_Overview of Software Architecture.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Architectural Styles",
                        Description = "Common architectural patterns and their use cases",
                        OrderIndex = 1,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Layered Architecture", ContentHtml = "<p><strong>Layered Architecture (N-Tier)</strong> organizes a system into layers, each with a specific responsibility. Common layers include:</p><ul><li><strong>Presentation Layer</strong> — UI and user interaction</li><li><strong>Application Layer</strong> — business logic and orchestration</li><li><strong>Domain/Business Layer</strong> — core business rules</li><li><strong>Infrastructure/Data Layer</strong> — data access and external services</li></ul><p>Each layer communicates only with the layer directly below it.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Client-Server Architecture", ContentHtml = "<p><strong>Client-Server Architecture</strong> separates a system into two types of components: clients (request services) and servers (provide services). This is the foundation of web applications.</p><p>Benefits include centralized data management, scalability, and security. The case study of a Banking System (Ch21) demonstrates this architecture.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Microservices Architecture", ContentHtml = "<p><strong>Microservices</strong> decompose a system into small, independent services that communicate via APIs. Each service:</p><ul><li>Is independently deployable</li><li>Has its own data store</li><li>Focuses on a specific business capability</li><li>Communicates via lightweight protocols (REST, gRPC, messaging)</li></ul><p>Benefits include scalability, team autonomy, and technology diversity.</p>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "In a layered architecture, which layer handles user interface concerns?",
                                Explanation = "The Presentation Layer is responsible for UI and user interaction.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 1, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Data Layer", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Business Layer", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Presentation Layer", IsCorrect = true, OrderIndex = 3 },
                                    new() { OptionText = "Infrastructure Layer", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "Which of the following is NOT a characteristic of microservices?",
                                Explanation = "Microservices use independent data stores, not a shared database. Each service owns its data.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Independent deployment", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Shared database", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Focused on a specific business capability", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Communicates via lightweight protocols", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    },
                    new()
                    {
                        Title = "Architectural Design Decisions",
                        Description = "Factors influencing architecture choices",
                        OrderIndex = 2,
                        EstimatedMinutes = 12,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Quality Attributes in Architecture", ContentHtml = "<p>Architecture decisions are driven by quality attributes (non-functional requirements):</p><ul><li><strong>Performance</strong> — response time, throughput</li><li><strong>Scalability</strong> — ability to handle growth</li><li><strong>Security</strong> — protection against threats</li><li><strong>Availability</strong> — uptime and fault tolerance</li><li><strong>Maintainability</strong> — ease of changes</li><li><strong>Testability</strong> — ease of testing</li></ul>", OrderIndex = 1, EstimatedMinutes = 6 },
                            new() { Title = "Architecture Documentation", ContentHtml = "<p>Good architecture documentation includes:</p><ul><li><strong>Architecture Overview</strong> — high-level diagram and description</li><li><strong>Views</strong> — multiple perspectives (4+1 View Model by Philippe Kruchten)</li><ul><li><strong>Logical View</strong> — functional requirements</li><li><strong>Process View</strong> — concurrency and performance</li><li><strong>Development View</strong> — module organization</li><li><strong>Physical View</strong> — deployment topology</li><li><strong>Scenarios</strong> — use cases tying views together</li></ul></ul>", OrderIndex = 2, EstimatedMinutes = 6 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which architecture view focuses on concurrency and performance?",
                                Explanation = "The Process View focuses on concurrency, distribution, and performance aspects of the system.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Hard,
                                OrderIndex = 1, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Logical View", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Process View", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Development View", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Physical View", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            },
            new()
            {
                Title = "Design Patterns",
                Subtitle = "Reusable solutions to common software problems",
                Description = "Learn the most important design patterns in software engineering: Creational, Structural, and Behavioral patterns. Understand Singleton, Factory, Observer, Adapter, and more.",
                ColorHex = "#EF4444",
                IconName = "bi-collection",
                Level = CourseLevel.Intermediate,
                OrderIndex = 6,
                SlideFileName = "SWD392_Design Partern.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Creational Patterns",
                        Description = "Patterns for object creation mechanisms",
                        OrderIndex = 1,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Singleton Pattern", ContentHtml = "<p><strong>Singleton</strong> ensures a class has only one instance and provides a global access point to it.</p><p><strong>Example use case:</strong> Logger, Configuration manager, Database connection pool.</p><pre><code>public class Singleton {\n    private static Singleton? _instance;\n    private static readonly object _lock = new();\n    \n    private Singleton() { }\n    \n    public static Singleton Instance {\n        get {\n            if (_instance == null) {\n                lock (_lock) {\n                    _instance ??= new Singleton();\n                }\n            }\n            return _instance;\n        }\n    }\n}</code></pre>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Factory Method Pattern", ContentHtml = "<p><strong>Factory Method</strong> defines an interface for creating an object but lets subclasses decide which class to instantiate.</p><p><strong>Example use case:</strong> Creating different types of documents (Word, PDF, HTML) from a common creator interface.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Builder Pattern", ContentHtml = "<p><strong>Builder</strong> separates the construction of a complex object from its representation, allowing the same construction process to create different representations.</p><p><strong>Example use case:</strong> Building complex objects with many optional parameters (e.g., constructing a query or a meal order).</p>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which pattern ensures a class has only one instance?",
                                Explanation = "Singleton ensures only one instance of a class exists and provides a global access point.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 1, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Factory Method", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Singleton", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Builder", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Observer", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "Which category does the Factory Method pattern belong to?",
                                Explanation = "Factory Method is a Creational pattern — it deals with object creation.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 2, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Structural", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Behavioral", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Creational", IsCorrect = true, OrderIndex = 3 },
                                    new() { OptionText = "Architectural", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    },
                    new()
                    {
                        Title = "Structural & Behavioral Patterns",
                        Description = "Patterns for composition and interaction",
                        OrderIndex = 2,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Adapter Pattern", ContentHtml = "<p><strong>Adapter</strong> allows incompatible interfaces to work together. It acts as a wrapper, converting one interface to another that clients expect.</p><p><strong>Example use case:</strong> Integrating a third-party payment API with your system's payment interface.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Observer Pattern", ContentHtml = "<p><strong>Observer</strong> defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified automatically.</p><p><strong>Example use case:</strong> Event handling systems, real-time notifications, UI update propagation.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Strategy Pattern", ContentHtml = "<p><strong>Strategy</strong> defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it.</p><p><strong>Example use case:</strong> Different sorting algorithms, payment processing methods, shipping cost calculators.</p>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which pattern is used to make incompatible interfaces compatible?",
                                Explanation = "The Adapter pattern allows classes with incompatible interfaces to work together by converting one interface to another.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 1, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Adapter", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "Observer", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Strategy", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Decorator", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "In the Observer pattern, what is the relationship between the subject and observers?",
                                Explanation = "Observer defines a one-to-many dependency — one subject notifies many observers when its state changes.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "One-to-one", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "One-to-many", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Many-to-one", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Many-to-many", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            },
            new()
            {
                Title = "GenAI & Software Engineering",
                Subtitle = "The impact of Generative AI on software development",
                Description = "Explore how Generative AI is transforming software engineering — from code generation to testing, documentation, and design. Understand the opportunities and challenges of AI-assisted development.",
                ColorHex = "#06B6D4",
                IconName = "bi-robot",
                Level = CourseLevel.Intermediate,
                OrderIndex = 7,
                SlideFileName = "SWD392_GenAI.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "AI in Software Development",
                        Description = "How GenAI is changing the way we code",
                        OrderIndex = 1,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "AI-Powered Code Generation", ContentHtml = "<p>Generative AI tools like GitHub Copilot, Codebuff, and Cursor are transforming how developers write code:</p><ul><li><strong>Auto-completion</strong> — AI suggests code as you type</li><li><strong>Code generation</strong> — generate entire functions from comments</li><li><strong>Code explanation</strong> — AI explains complex code</li><li><strong>Refactoring assistance</strong> — AI suggests improvements</li></ul><p>These tools act as an <strong>AI pair programmer</strong>, boosting productivity significantly.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "AI for Testing & QA", ContentHtml = "<p>AI is revolutionizing software testing:</p><ul><li><strong>Test generation</strong> — automatically create test cases</li><li><strong>Bug detection</strong> — identify potential bugs before they reach production</li><li><strong>Test maintenance</strong> — automatically update tests when code changes</li><li><strong>Visual testing</strong> — detect UI changes and regressions</li></ul>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Prompt Engineering for Developers", ContentHtml = "<p><strong>Prompt engineering</strong> is becoming a crucial skill for developers working with AI:</p><ul><li><strong>Be specific</strong> — provide context and constraints</li><li><strong>Provide examples</strong> — few-shot prompting improves results</li><li><strong>Iterate</strong> — refine prompts based on output</li><li><strong>Use system prompts</strong> — set the AI's role and tone</li><li><strong>Chain of thought</strong> — ask AI to reason step by step</li></ul>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which of the following is NOT a current application of GenAI in software engineering?",
                                Explanation = "While AI can assist in many areas, automatically making architectural decisions for entire enterprise systems is still a human-driven process that AI is not fully capable of managing.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Code generation", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Test generation", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Automatic architectural decisions for enterprise systems", IsCorrect = true, OrderIndex = 3 },
                                    new() { OptionText = "Code explanation and documentation", IsCorrect = false, OrderIndex = 4 }
                                }
                            },
                            new()
                            {
                                QuestionText = "What is 'prompt engineering' in the context of AI?",
                                Explanation = "Prompt engineering is the practice of carefully crafting input prompts to get desired outputs from AI models.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Easy,
                                OrderIndex = 2, Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Writing code faster", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Crafting effective prompts for AI models", IsCorrect = true, OrderIndex = 2 },
                                    new() { OptionText = "Designing user interfaces", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Testing software performance", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            },
            new()
            {
                Title = "Client-Server Architecture: Banking System Case Study",
                Subtitle = "Practical application of client-server architecture",
                Description = "A comprehensive case study of a Banking System designed using Client-Server Architecture. Understand how the architecture is applied to handle transactions, account management, and security.",
                ColorHex = "#3B82F6",
                IconName = "bi-bank",
                Level = CourseLevel.Advanced,
                OrderIndex = 8,
                SlideFileName = "Ch21_Client Server Software Architecture Case Study-Banking System.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Banking System Architecture",
                        Description = "Overview of the banking system case study",
                        OrderIndex = 1,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "System Overview", ContentHtml = "<p>The <strong>Banking System</strong> case study demonstrates a Client-Server architecture for managing financial operations:</p><ul><li><strong>Client Tier</strong> — ATM interfaces, web applications, mobile apps</li><li><strong>Application Server</strong> — business logic, transaction processing</li><li><strong>Database Server</strong> — account data, transaction history</li></ul><p>Key concerns include security, transaction integrity, and concurrency management.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Transaction Management", ContentHtml = "<p>Transaction management in banking systems ensures <strong>ACID</strong> properties:</p><ul><li><strong>Atomicity</strong> — all-or-nothing execution</li><li><strong>Consistency</strong> — data remains valid</li><li><strong>Isolation</strong> — concurrent transactions don't interfere</li><li><strong>Durability</strong> — committed changes persist</li></ul><p>The server manages locks, handles rollbacks, and ensures data integrity.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Security Architecture", ContentHtml = "<p>Security is critical in banking systems:</p><ul><li><strong>Authentication</strong> — verifying user identity (PIN, biometrics)</li><li><strong>Authorization</strong> — controlling access to accounts</li><li><strong>Encryption</strong> — protecting data in transit (TLS) and at rest</li><li><strong>Audit Logging</strong> — tracking all transactions</li><li><strong>Fraud Detection</strong> — monitoring suspicious activity</li></ul>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "Which ACID property ensures that partially completed transactions are rolled back?",
                                Explanation = "Atomicity ensures that a transaction is all-or-nothing — if any part fails, the entire transaction is rolled back.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Atomicity", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "Consistency", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "Isolation", IsCorrect = false, OrderIndex = 3 },
                                    new() { OptionText = "Durability", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            },
            new()
            {
                Title = "SOA Case Study: Online Shopping System",
                Subtitle = "Service-Oriented Architecture in practice",
                Description = "Explore how Service-Oriented Architecture (SOA) is applied in building an Online Shopping System. Understand service composition, orchestration, and enterprise integration patterns.",
                ColorHex = "#14B8A6",
                IconName = "bi-cart3",
                Level = CourseLevel.Advanced,
                OrderIndex = 9,
                SlideFileName = "Ch22_SOA Case Study-Online Shopping System.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "E-Commerce System Architecture",
                        Description = "SOA for online shopping",
                        OrderIndex = 1,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Service Decomposition", ContentHtml = "<p>The Online Shopping System is decomposed into services:</p><ul><li><strong>Product Service</strong> — catalog management, search, inventory</li><li><strong>Order Service</strong> — order creation, tracking, history</li><li><strong>Payment Service</strong> — payment processing, refunds</li><li><strong>User Service</strong> — accounts, authentication, profiles</li><li><strong>Shipping Service</strong> — logistics, tracking, delivery</li></ul>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Service Orchestration", ContentHtml = "<p>Service <strong>orchestration</strong> coordinates multiple services to fulfill a business process. For example, placing an order involves:</p><ol><li>User Service — authenticate user</li><li>Product Service — check inventory and reserve items</li><li>Order Service — create order record</li><li>Payment Service — process payment</li><li>Shipping Service — arrange delivery</li></ol><p>The <strong>Order Orchestrator</strong> coordinates these service calls.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Benefits of SOA for E-Commerce", ContentHtml = "<p>SOA brings key benefits to e-commerce platforms:</p><ul><li><strong>Reusability</strong> — services can be used across different channels (web, mobile, API)</li><li><strong>Scalability</strong> — individual services can scale independently based on demand</li><li><strong>Maintainability</strong> — services can be updated independently</li><li><strong>Integration</strong> — easier integration with third-party services (payment gateways, shipping carriers)</li></ul>", OrderIndex = 3, EstimatedMinutes = 5 }
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is the role of an orchestrator in SOA?",
                                Explanation = "An orchestrator coordinates multiple services to execute a business process by managing the sequence of service calls.",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1, Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "It stores all service data", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "It manages database connections", IsCorrect = false, OrderIndex = 2 },
                                    new() { OptionText = "It coordinates multiple services to execute business processes", IsCorrect = true, OrderIndex = 3 },
                                    new() { OptionText = "It handles user authentication", IsCorrect = false, OrderIndex = 4 }
                                }
                            }
                        }
                    }
                }
            }
        };

        return courses;
    }
}
