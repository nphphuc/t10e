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

        await context.Database.EnsureCreatedAsync();

        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        if (!await roleManager.RoleExistsAsync("User"))
            await roleManager.CreateAsync(new IdentityRole("User"));

        if (await userManager.FindByEmailAsync("admin@swd392.com") == null)
        {
            var admin = new ApplicationUser
            {
                UserName = "admin",
                Email = "admin@swd392.com",
                FullName = "Admin",
                CreatedAt = DateTime.UtcNow
            };
            var result = await userManager.CreateAsync(admin, "Admin@123");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }

        if (await userManager.FindByEmailAsync("demo@swd392.com") == null)
        {
            var demoUser = new ApplicationUser
            {
                UserName = "demo",
                Email = "demo@swd392.com",
                FullName = "Demo Learner",
                Bio = "SWD392 student exploring software design and architecture.",
                CreatedAt = DateTime.UtcNow
            };
            var result = await userManager.CreateAsync(demoUser, "Demo@123");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(demoUser, "User");
        }

        if (!await context.Courses.AnyAsync())
        {
            var courses = GetSeedCourses();
            context.Courses.AddRange(courses);
            await context.SaveChangesAsync();
        }
    }

    private static List<Course> GetSeedCourses()
    {
        var courses = new List<Course>
        {
            new()
            {
                Title = "Chapter 01 Introduction",
                Subtitle = "Foundations of software engineering and the COMET/UML approach",
                Description = "﻿Modelling is the designing of SW applications before coding. Models are built and analysed prior to the implementation of the system, and are used to direct the subsequent implementation.. ﻿A graphic",
                ColorHex = "#6366F1",
                IconName = "bi-laptop",
                Level = CourseLevel.Beginner,
                OrderIndex = 1,
                SlideFileName = "Ch01_Introduction.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "﻿Modelling is the designing of SW applications before coding",
                        OrderIndex = 1,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch01 – Introduction", ContentHtml = "<p>Ch01 – Introduction</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Software Modeling", ContentHtml = "<p>Software Modeling</p>
<p>﻿Modelling is the designing of SW applications before coding</p>
<p>Models are built and analysed prior to the implementation of the system, and are used to direct the subsequent implementation.</p>
<p>﻿A graphical modelling language such as UML helps in developing, understanding, and communicating the different views.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "OO Methods & the UML", ContentHtml = "<p>OO Methods & the UML</p>
<p>OO concepts</p>
<p>﻿Address fundamental issues of software modifiability, adaptation, and evolution</p>
<p>Methods based on concepts of ﻿information hiding, classes, and inheritance</p>
<p>UML ~ Unified Modeling Language (UML)</p>
<p>Developed to provide a standardized graphical language and notation for describing object-oriented models.</p>
<p>UC modeling: functional requirements</p>
<p>Static modeling: structural view of the system</p>
<p>Dynamic modeling: behav", OrderIndex = 3, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Modelling is the designing of SW applications before coding?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Models are built and analysed prior to the implementation of the system, and are...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Models are built and analysed prior to the implementation of the system", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿A graphical modelling language such as UML helps in developing, understanding, and communicating th?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Address fundamental issues of software modifiability, adaptation, and evolution...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Address fundamental issues of software modifiability", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Methods based on concepts of ﻿information hiding, classes, and inheritance?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Software Architectural Design",
                        Description = "Software Architectural Design",
                        OrderIndex = 2,
                        EstimatedMinutes = 15,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Software Architectural Design", ContentHtml = "<p>Software Architectural Design</p>
<p>Sometimes referred to as a high-level design</p>
<p>Describe ﻿decomposition of the software system into subsystems.</p>
<p>Address software quality attributes</p>
<p>Starting point for the detailed design and implementation (decomposition of subsystems into modules or components).</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Method & Notation", ContentHtml = "<p>Method & Notation</p>
<p>﻿Software design notation: graphically, textually</p>
<p>﻿A software design concept is a fundamental idea that can be applied to designing a system - ie information hiding.</p>
<p>A software design strategy is an overall plan and direction for developing a design – i.e OO decomposition</p>
<p>Software structuring criteria are heuristics or guidelines used to help a designer in structuring a software system into its components. i.e: object structuring criteria provide ", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "COMET & UML", ContentHtml = "<p>COMET & UML</p>
<p>﻿The Collaborative Object Modeling and Design Method, or COMET, uses the UML notation to describe the design</p>
<p>﻿UML: a standard modeling language and notation for describing object-oriented designs</p>
<p>Latest version 2.5.1, published Dec/2017</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Sometimes referred to as a high-level design?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Describe ﻿decomposition of the software system into subsystems....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Describe ﻿decomposition of the software system into subsyste", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Starting point for the detailed design and implementation (decomposition of subs...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Starting point for the detailed design and implementation (d", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Multiple Views of SW Architecture",
                        Description = "Multiple Views of SW Architecture",
                        OrderIndex = 3,
                        EstimatedMinutes = 5,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Multiple Views of SW Architecture", ContentHtml = "<p>Multiple Views of SW Architecture</p>
<p>﻿Use case view: use case diagrams</p>
<p>Static view: class diagrams</p>
<p>﻿Dynamic interaction view: objects & interaction messages between them</p>
<p>﻿Dynamic state machine view: state machine / state chart diagram</p>
<p>﻿Structural component view: structured class diagrams</p>
<p>﻿Dynamic concurrent view: concurrent communication diagrams</p>
<p>﻿Deployment view: deployment diagrams</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: '﻿Use case view: use case diagrams...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Use case view: use case diagrams", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Dynamic interaction view: objects & interaction messages between them?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Dynamic state machine view: state machine / state chart diagram...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Dynamic state machine view: state machine / state chart dia", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Structural component view: structured class diagrams?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 02 Overview of UML Notation",
                Subtitle = "Standardized graphical language for describing object-oriented models",
                Description = "Ch02 – Overview of THE uml notation. A use case defines a sequence of interactions between the actor and the system.. To distinguish between a class (the type) and an object (an instance of the type),",
                ColorHex = "#8B5CF6",
                IconName = "bi-diagram-3",
                Level = CourseLevel.Beginner,
                OrderIndex = 2,
                SlideFileName = "Ch02_Overview of UML Notation.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "An actor initiates a use case.",
                        OrderIndex = 1,
                        EstimatedMinutes = 20,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch02 – Overview of THE uml notation", ContentHtml = "<p>Ch02 – Overview of THE uml notation</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "UML Diagrams", ContentHtml = "<p>UML Diagrams</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Diagrams", ContentHtml = "<p>Use Case Diagrams</p>
<p>An actor initiates a use case.</p>
<p>A use case defines a sequence of interactions between the actor and the system.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Classes & Objects", ContentHtml = "<p>Classes & Objects</p>
<p>To distinguish between a class (the type) and an object (an instance of the type), an object name is shown underlined.</p>
<p>An object can be depicted in full with the object name separated by a colon from the class name</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, A use case defines a sequence of interactions between the actor and the system.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'To distinguish between a class (the type) and an object (an instance of the type...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "To distinguish between a class (the type) and an object (an instance of the type)", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, An object can be depicted in full with the object name separated by a colon from the class name?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Class DiagramsRelationship Hierarchies",
                        Description = "Class DiagramsRelationship Hierarchies",
                        OrderIndex = 2,
                        EstimatedMinutes = 20,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Class DiagramsRelationship Hierarchies", ContentHtml = "<p>Class DiagramsRelationship Hierarchies</p>
<p>An association is a static, structural relationship between two or more classes.The multiplicity of an association specifies how many instances of one class     may relate to a single instance of another classA generalization/specialization hierarchy is an inheritance relationship Aggregation and composition hierarchies are whole/part relationships</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Class DiagramsVisibility", ContentHtml = "<p>Class DiagramsVisibility</p>
<p>Public visibility, denoted with a + symbol, means that the element is visible from outside the class.</p>
<p>Private visibility, denoted with a – symbol, means that the element is visible only from within the class that defines it and is thus hidden from other classes.</p>
<p>Protected visibility, denoted with a # symbol, means that the element is visible from within the class that defines it and within all subclasses of the class.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Interaction DiagramsCommunication Diagram", ContentHtml = "<p>Interaction DiagramsCommunication Diagram</p>
<p>UML has two main kinds of interaction diagrams, which depict how objects interact: the communication diagram and the sequence diagram</p>
<p>Communication Diagram</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Interaction DiagramsSequence Diagram", ContentHtml = "<p>Interaction DiagramsSequence Diagram</p>
<p>Sequence Diagram</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'An association is a static, structural relationship between two or more classes....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "An association is a static", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Public visibility, denoted with a + symbol, means that the element is visible from outside the class?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Private visibility, denoted with a – symbol, means that the element is visible o...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Private visibility", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Protected visibility, denoted with a # symbol, means that the element is visible from within the cla?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "State Machine Diagrams",
                        Description = "State Machine Diagrams",
                        OrderIndex = 3,
                        EstimatedMinutes = 20,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "State Machine Diagrams", ContentHtml = "<p>State Machine Diagrams</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Package Diagrams", ContentHtml = "<p>Package Diagrams</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Concurrent Communication Diagrams", ContentHtml = "<p>Concurrent Communication Diagrams</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Deployment Diagrams", ContentHtml = "<p>Deployment Diagrams</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                        },
                    },
                    new()
                    {
                        Title = "UML Extension Mechanisms 1/2",
                        Description = "UML Extension Mechanisms 1/2",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "UML Extension Mechanisms 1/2", ContentHtml = "<p>UML Extension Mechanisms 1/2</p>
<p>UML provides three mechanisms to allow the language to be extended (Booch, Rumbaugh, and Jacobson 2005; Rumbaugh, Booch, and Jacobson 2005)</p>
<p>A tagged value extends the properties of a UML building block, thereby adding new information. A tagged value is enclosed in braces in the form {tag = value}. Commas separate additional tagged values</p>
<p>A constraint specifies a condition that must be true. In UML, a constraint is an extension of the semantics", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "UML Extension Mechanisms 2/2", ContentHtml = "<p>UML Extension Mechanisms 2/2</p>
<p>A stereotype defines a new building block that is derived from an existing UML modeling element but tailored to the modeler’s problem. Stereotypes are indicated by guillemets (« »)</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, UML provides three mechanisms to allow the language to be extended (Booch, Rumbaugh, and Jacobson 20?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A tagged value extends the properties of a UML building block, thereby adding ne...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A tagged value extends the properties of a UML building block", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, A constraint specifies a condition that must be true. In UML, a constraint is an extension of the se?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A stereotype defines a new building block that is derived from an existing UML m...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A stereotype defines a new building block that is derived fr", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 03 Software Life Cycle Models and Processes",
                Subtitle = "Waterfall, prototyping, incremental, spiral, and RUP process models",
                Description = "Ch03 – Software Life Cycle Models and Processes. Does not show iteration in the life cycle. Does not show overlap between phases",
                ColorHex = "#EC4899",
                IconName = "bi-arrow-repeat",
                Level = CourseLevel.Beginner,
                OrderIndex = 3,
                SlideFileName = "Ch03_Software Life Cycle Models and Processes.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Does not show iteration in the life cycle",
                        OrderIndex = 1,
                        EstimatedMinutes = 20,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch03 – Software Life Cycle Models and Processes", ContentHtml = "<p>Ch03 – Software Life Cycle Models and Processes</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Waterfall Model", ContentHtml = "<p>Waterfall Model</p>
<p>Limitations</p>
<p>Does not show iteration in the life cycle</p>
<p>Does not show overlap between phases</p>
<p>Software requirements are tested late in life cycle</p>
<p>Operational system available late in life cycle</p>
<p>Idealized process model in which each phase is completed before the next phase is started, and a project moves from one phase to the next without</p>
<p>iteration or overlap.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Waterfall Model﻿Waterfall model with iteration between phas", ContentHtml = "<p>Waterfall Model﻿Waterfall model with iteration between phases</p>
<p>The waterfall model is a major improvement over the undisciplined approach used on early software projects and has been used successfully on many projects.</p>
<p>In practice, however, some overlap is often necessary between successive phases of the life cycle, as well as some iteration between phases when errors are detected</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Throwaway Prototyping﻿ 1/3", ContentHtml = "<p>Throwaway Prototyping﻿ 1/3</p>
<p>Impact of Throwaway prototyping and its revolution</p>
<p>Particularly useful for getting feedback on the User Interface</p>
<p>Is developed after a preliminary requirements specification</p>
<p>Is an effective solution to the problem of specifying the requirements for interactive information system</p>
<p>Helps overcome the communication barrier that existed between the users and the developers</p>
<p>Evolutionary prototyping approach is a form of incrementa", OrderIndex = 4, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Does not show iteration in the life cycle?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Does not show overlap between phases...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Does not show overlap between phases", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Software requirements are tested late in life cycle?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Operational system available late in life cycle...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Operational system available late in life cycle", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Idealized process model in which each phase is completed before the next phase is started, and a pro?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Throwaway Prototyping﻿ 2/3",
                        Description = "Throwaway Prototyping﻿ 2/3",
                        OrderIndex = 2,
                        EstimatedMinutes = 20,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Throwaway Prototyping﻿ 2/3", ContentHtml = "<p>Throwaway Prototyping﻿ 2/3</p>
<p>Throwaway prototyping of requirements</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Throwaway Prototyping﻿ 3/3", ContentHtml = "<p>Throwaway Prototyping﻿ 3/3</p>
<p>﻿﻿Throwaway prototyping of architectural design</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "﻿Incremental development model", ContentHtml = "<p>﻿Incremental development model</p>
<p>﻿Evolutionary Prototyping by Incremental Development</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "﻿Incremental development modelCombine throwaway prototyping", ContentHtml = "<p>﻿Incremental development modelCombine throwaway prototyping</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: '﻿﻿Throwaway prototyping of architectural design...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿﻿Throwaway prototyping of architectural design", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Incremental development modelCombine throwaway prototyping...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Incremental development modelCombine throwaway prototyping", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Spiral Process Model (SPM)",
                        Description = "Spiral Process Model (SPM)",
                        OrderIndex = 3,
                        EstimatedMinutes = 20,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Spiral Process Model (SPM)", ContentHtml = "<p>Spiral Process Model (SPM)</p>
<p>Define objectives, alternatives, and constraints. Detailed planning for this cycle: identify goals and alternative approaches to achieving them.</p>
<p>Analyze risks. Detailed assessment of current project risks; plan activities to be performed to alleviate these risks.</p>
<p>Develop product. Work on developing product, such as requirements analysis, design, or coding.</p>
<p>Plan next cycle. Assess progress made on this cycle and start planning for next cyc", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "﻿Rational Unified Process (RUP)", ContentHtml = "<p>﻿Rational Unified Process (RUP)</p>
<p>AKA ﻿Unified Software Development Process (USDP)</p>
<p>﻿Consists of five core workflows and four iterative phases</p>
<p>Inception: idea, concepts</p>
<p>Elaboration: software architecture</p>
<p>Construction: ready for release to the user community</p>
<p>Transition: the software is turned over to the user community</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Design Verification & Validation", ContentHtml = "<p>Design Verification & Validation</p>
<p>﻿The goal of software validation is to ensure that the software development team “builds the right system,” that is, to ensure that the system conforms to the user’s needs.</p>
<p>The goal of software verification is to ensure that the software development team “builds the system right,” that is, to ensure that each phase of the software system is built according to the specification defined in the previous phase.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Design Verification & ValidationVerification & Validation A", ContentHtml = "<p>Design Verification & ValidationVerification & Validation Activities</p>
<p>﻿Software Quality Assurance – activities to ensure the quality of the software product</p>
<p>Throwaway prototyping: ﻿validation of the system (before it is developed) against the user requirements</p>
<p>﻿Software technical reviews can help considerably with software verification and validation. In software verification, it is important to ensure that the design conforms to the software requirements specification</p", OrderIndex = 4, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Define objectives, alternatives, and constraints. Detailed planning for this cycle: identify goals a?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Analyze risks. Detailed assessment of current project risks; plan activities to ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Analyze risks. Detailed assessment of current project risks;", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Develop product. Work on developing product, such as requirements analysis, design, or coding.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Plan next cycle. Assess progress made on this cycle and start planning for next ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Plan next cycle. Assess progress made on this cycle and star", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Software Lifecycle Activities",
                        Description = "Software Lifecycle Activities",
                        OrderIndex = 4,
                        EstimatedMinutes = 5,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Software Lifecycle Activities", ContentHtml = "<p>Software Lifecycle Activities</p>
<p>﻿Requirements Analysis & Specification: BRD/URD => SRS</p>
<p>﻿Architectural Design: ﻿define overall system structures</p>
<p>﻿Detailed Design: define algorithms, internal structures,..</p>
<p>Coding: ﻿each component is coded in the programming language selected for the project</p>
<p>Software Testing</p>
<p>Functional testing</p>
<p>Load testing</p>
<p>Stress testing</p>
<p>Volume testing</p>
<p>Unit Test</p>
<p>Tests on individual components</p>
<p>Uses ", OrderIndex = 1, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Requirements Analysis & Specification: BRD/URD => SRS?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Architectural Design: ﻿define overall system structures...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Architectural Design: ﻿define overall system structures", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Detailed Design: define algorithms, internal structures,..?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Coding: ﻿each component is coded in the programming language selected for the pr...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Coding: ﻿each component is coded in the programming language", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Involves combining tested components into progressively complex grouping?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 04 Software Design and Architecture Concepts",
                Subtitle = "OO concepts, concurrency, design patterns, and quality attributes",
                Description = "Ch04 – Software Design and Architecture Concepts. Software Architecture & Components",
                ColorHex = "#F59E0B",
                IconName = "bi-puzzle",
                Level = CourseLevel.Intermediate,
                OrderIndex = 4,
                SlideFileName = "Ch04_Software Design and Architecture Concepts.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Object Oriented Concepts",
                        OrderIndex = 1,
                        EstimatedMinutes = 20,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Object Oriented Concepts</p>
<p>Concurrent Processing</p>
<p>Design Patterns</p>
<p>Software Architecture & Components</p>
<p>﻿Software Quality Attributes</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Object Oriented ConceptsObjects & Classes 1/2", ContentHtml = "<p>Object Oriented ConceptsObjects & Classes 1/2</p>
<p>An object is a real-world physical or conceptual entity that provides an understanding of the real world and, hence, forms the basis for a software solution</p>
<p>A real-world object can have physical properties (they can be seen or touched): door, motor, lamp,..</p>
<p>A conceptual object is a more abstract concept: an account, a transaction,..</p>
<p>An object (object instance) is a single “thing”:  John’s car or Mary’s account</p>
<p>A", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Object Oriented ConceptsObjects & Classes 2/2", ContentHtml = "<p>Object Oriented ConceptsObjects & Classes 2/2</p>
<p>An object groups both data & procedures that operate on the data</p>
<p>The procedures are usually called operations or methods.</p>
<p>Some approaches, including the UML notation, refer to the operation as the speciﬁcation of a function performed by an object and the method as the implementation of the function</p>
<p>An attribute is a data value held by an object in a class. Each object has a speciﬁc value of an attribute.</p>
<p>An oper", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Object Oriented ConceptsInformation Hiding 1/2", ContentHtml = "<p>Object Oriented ConceptsInformation Hiding 1/2</p>
<p>﻿Information hiding is used in designing the object: decide what information should be visible, what should be hidden</p>
<p>Hidden parts of an object ﻿need not be visible to other objects</p>
<p>﻿If the internals of the object change -> affect this object only</p>
<p>Encapsulation: the potential change to the hidden information that could potentially change is encapsulated inside an object</p>
<p>Other objects may only indirectly access ", OrderIndex = 4, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Object Oriented ConceptsObjects & Classes 1/2...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Object Oriented ConceptsObjects & Classes 1/2", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, An object is a real-world physical or conceptual entity that provides an understanding of the real w?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A real-world object can have physical properties (they can be seen or touched): ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A real-world object can have physical properties (they can be seen or touched): door", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, A conceptual object is a more abstract concept: an account, a transaction,..?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Object Oriented ConceptsInformation Hiding 2/2",
                        Description = "Object Oriented ConceptsInformation Hiding 2/2",
                        OrderIndex = 2,
                        EstimatedMinutes = 25,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Object Oriented ConceptsInformation Hiding 2/2", ContentHtml = "<p>Object Oriented ConceptsInformation Hiding 2/2</p>
<p>The above is Stack class with a set of operations is defined to manipulate the data structure (array or linked list)</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Object Oriented ConceptsInheritance & Generalization/Specia", ContentHtml = "<p>Object Oriented ConceptsInheritance & Generalization/Specialization</p>
<p>﻿A mechanism for sharing and reusing code between classes</p>
<p>﻿A child class inherits the properties (encapsulated data and operations) of a parent class</p>
<p>Super class or Base class</p>
<p>Subclass or derived class</p>
<p>Specialization: parent -> child</p>
<p>Generalization: child -> parent</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Concurrent ProcessingSequential Application", ContentHtml = "<p>Concurrent ProcessingSequential Application</p>
<p>﻿A sequential application is a sequential program that consists of passive objects and has only one thread of control.</p>
<p>When an object invokes an operation in another object, control is passed from the calling operation to the called operation.</p>
<p>When the called operation finishes executing, control is passed back to the calling operation.</p>
<p>In a sequential application, only synchronous message communication (procedure call o", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Concurrent ProcessingConcurrent Application 1/2", ContentHtml = "<p>Concurrent ProcessingConcurrent Application 1/2</p>
<p>﻿In a concurrent application, there are typically several concurrent objects, each with its own thread of control.</p>
<p>A concurrent source object can send an asynchronous message to a concurrent destination object and then continue executing, regardless of when the destination object receives the message.</p>
<p>If the destination object is busy when the message arrives, the message is buffered for the object.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Concurrent ProcessingConcurrent Application 2/2", ContentHtml = "<p>Concurrent ProcessingConcurrent Application 2/2</p>
<p>﻿In a concurrent application, there are typically several concurrent objects, each with its own thread of control.</p>
<p>Concurrent source object can send asynchronous message(s) to a concurrent destination object and then continue executing, regardless of when the destination object receives the message.</p>
<p>If the destination object is busy when the message arrives, the message is buffered for the object.</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Object Oriented ConceptsInformation Hiding 2/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The above is Stack class with a set of operations is defined to manipulate the d...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The above is Stack class with a set of operations is defined", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Object Oriented ConceptsInheritance & Generalization/Specialization?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿A mechanism for sharing and reusing code between classes...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿A mechanism for sharing and reusing code between classes", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿A child class inherits the properties (encapsulated data and operations) of a parent class?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Concurrent ProcessingConcurrent Objects",
                        Description = "Concurrent ProcessingConcurrent Objects",
                        OrderIndex = 3,
                        EstimatedMinutes = 25,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Concurrent ProcessingConcurrent Objects", ContentHtml = "<p>Concurrent ProcessingConcurrent Objects</p>
<p>﻿Also referred to as active objects, concurrent processes, concurrent tasks, or threads</p>
<p>They have their own thread of control</p>
<p>Execute independently of other objects.</p>
<p>They are different from passive objects (invoked)</p>
<p>No concurrency is allowed within a concurrent object</p>
<p>﻿Concurrent objects often execute asynchronously and are relatively independent of each other for significant periods of time.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Concurrent ProcessingCooperation between Concurrent Objects", ContentHtml = "<p>Concurrent ProcessingCooperation between Concurrent Objects</p>
<p>Common arise problems in concurrent processing</p>
<p>﻿The mutual exclusion problem occurs when concurrent objects need to have exclusive access to a resource, such as shared data or a physical device.</p>
<p>The synchronization problem occurs when two concurrent objects need to synchronize their operations with each other.</p>
<p>The producer/consumer problem occurs when concurrent objects need to communicate with each other", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Design Patterns", ContentHtml = "<p>Design Patterns</p>
<p>﻿Describes a recurring design problem to be solved, a solution to the problem, and the context in which that solution works (microarchitecture)</p>
<p>﻿The main kinds of reusable patterns are as follows:</p>
<p>﻿Design patterns: a ﻿small group of collaborating objects</p>
<p>﻿Architectural patterns: ﻿larger-grained (higher level) than design patterns, ﻿structure of major subsystems of a system</p>
<p>﻿Analysis patterns: ﻿recurring patterns found in object-oriented analy", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Software Architecture & Components", ContentHtml = "<p>Software Architecture & Components</p>
<p>﻿A software architecture ﻿separates the overall structure of the system, in terms of components and their interconnections, from the internal details of the individual components</p>
<p>﻿Components: the system modules that ﻿could be developed in different ways depending on the particular platform the software architecture.</p>
<p>﻿To fully specify a component, it is necessary to define it in terms of the operations it provides and the operations it re", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "﻿Software Quality Attributes", ContentHtml = "<p>﻿Software Quality Attributes</p>
<p>Quality requirement of the software, ﻿often referred to as nonfunctional requirements</p>
<p>﻿Security: ﻿system is resistant to security threats</p>
<p>﻿﻿Modifiability: modified during or after initial development</p>
<p>﻿Reusability: ﻿software is capable of being reused</p>
<p>Testability: ﻿capable of being tested</p>
<p>Performance: ﻿performance goals (﻿throughput, response times)</p>
<p>﻿Availability: ﻿capable of addressing, recovering from system failur", OrderIndex = 5, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: '﻿Also referred to as active objects, concurrent processes, concurrent tasks, or ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Also referred to as active objects", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, They have their own thread of control?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Execute independently of other objects....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Execute independently of other objects.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, They are different from passive objects (invoked)?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 05 Overview of Software Modeling & Design Methods",
                Subtitle = "COMET use case-driven iterative object-oriented method",
                Description = "Ch05 – Overview of Software Modeling and Design Methods. COMET Use Case-Based Software Life Cycle. COMET Life Cycle vs Other Software Processes",
                ColorHex = "#14B8A6",
                IconName = "bi-eye",
                Level = CourseLevel.Intermediate,
                OrderIndex = 5,
                SlideFileName = "Ch05_Overview of Software Modeling & Design Methods.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "COMET Use Case-Based Software Life Cycle",
                        OrderIndex = 1,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch05 – Overview of Software Modeling and Design Methods", ContentHtml = "<p>Ch05 – Overview of Software Modeling and Design Methods</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>COMET Overview</p>
<p>COMET Use Case-Based Software Life Cycle</p>
<p>COMET Life Cycle vs Other Software Processes</p>
<p>Requirements, Analysis, and Design Modeling</p>
<p>Designing Software Architecture</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "COMET Overview", ContentHtml = "<p>COMET Overview</p>
<p>COMET: Collaborative Object Modeling and Architectural Design Method</p>
<p>COMET is an iterative use case–driven and object-oriented method</p>
<p>COMET uses the UML notation</p>
<p>COMET = UML + Method</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "COMET Use Case-Based Software Life Cycle", ContentHtml = "<p>COMET Use Case-Based Software Life Cycle</p>
<p>The COMET UC–based software life cycle model is a highly iterative software development process based around the use case (UC) concept</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "COMET Use Case-Based Software Life Cycle", ContentHtml = "<p>COMET Use Case-Based Software Life Cycle</p>
<p>﻿The COMET method ties in the three phases of requirements, analysis, and design modeling by means of a use case–based approach</p>
<p>In the requirements model: functional requirements are described in terms of actors and use cases. Each use case defines a sequence of interactions between one or more actors and the system.</p>
<p>In the analysis model: the use case is realized to describe the objects that participate in the use case and their i", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "COMET Use Case-Based Software Life CycleRequirements Modeli", ContentHtml = "<p>COMET Use Case-Based Software Life CycleRequirements Modeling</p>
<p>During the requirements modeling phase, a requirements model is developed in which the functional requirements of the system are described in terms of actors and use cases.</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, COMET Use Case-Based Software Life Cycle?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'COMET Life Cycle vs Other Software Processes...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "COMET Life Cycle vs Other Software Processes", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Designing Software Architecture...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Designing Software Architecture", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, COMET: Collaborative Object Modeling and Architectural Design Method?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "COMET Use Case-Based Software Life CycleAnalysis Modeling 1/2",
                        Description = "COMET Use Case-Based Software Life CycleAnalysis Modeling 1/2",
                        OrderIndex = 2,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "COMET Use Case-Based Software Life CycleAnalysis Modeling 1", ContentHtml = "<p>COMET Use Case-Based Software Life CycleAnalysis Modeling 1/2</p>
<p>Static & dynamic models of the system are developed.</p>
<p>﻿The static model defines the structural relationships among problem domain classes.</p>
<p>﻿The classes and their relationships are depicted on class diagrams.</p>
<p>Object structuring criteria are used to determine the objects to be considered for the analysis model.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "COMET Use Case-Based Software Life CycleAnalysis Modeling 2", ContentHtml = "<p>COMET Use Case-Based Software Life CycleAnalysis Modeling 2/2</p>
<p>﻿A dynamic model is then developed in which the use cases from the requirements model are realized to show the objects that participate in each use case and how they interact with each other.</p>
<p>﻿Objects and their interactions are depicted on either communication or sequence diagrams.</p>
<p>State-dependent objects are defined using state charts.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "COMET Use Case-Based Software Life CycleDesign Modeling", ContentHtml = "<p>COMET Use Case-Based Software Life CycleDesign Modeling</p>
<p>In the design modeling phase, the software architecture of the system is designed, in which the analysis model is mapped to an operational environment.</p>
<p>The analysis model, with its emphasis on the problem domain, is mapped to the design model, with its emphasis on the solution domain.</p>
<p>For sequential systems, the emphasis is on the object-oriented concepts of information hiding, classes, and inheritance.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "COMET Use Case-Based Software Life CycleIncremental Softwar", ContentHtml = "<p>COMET Use Case-Based Software Life CycleIncremental Software Construction</p>
<p>After completion of the software architectural design, an incremental software construction approach is taken.</p>
<p>This approach is based on selecting a subset of the system to be constructed for each increment.</p>
<p>Incremental software construction consists of the detailed design, coding, and unit testing of the classes in the subset.</p>
<p>This is a phased approach by which the software is gradually con", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "COMET Use Case-Based Software Life CycleIncremental Softwar", ContentHtml = "<p>COMET Use Case-Based Software Life CycleIncremental Software Integration</p>
<p>During incremental software integration, the integration testing of each software increment is performed.</p>
<p>The integration test for the increment is based on the use cases selected for the increment.</p>
<p>Integration testing is a form of white box testing, in which the interfaces between the objects that participate in each use case are tested</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "COMET Use Case-Based Software Life CycleSystem Testing", ContentHtml = "<p>COMET Use Case-Based Software Life CycleSystem Testing</p>
<p>System testing includes the functional testing of the system – namely, testing the system against its functional requirements.</p>
<p>This testing is black box testing and is based on the black box use cases. Thus, functional test cases are built for each black box use case.</p>
<p>Any software increment released to the customer needs to go through the system testing phase.</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, COMET Use Case-Based Software Life CycleAnalysis Modeling 1/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Static & dynamic models of the system are developed....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Static & dynamic models of the system are developed.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿The static model defines the structural relationships among problem domain classes.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿The classes and their relationships are depicted on class diagrams....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿The classes and their relationships are depicted on class d", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Object structuring criteria are used to determine the objects to be considered for the analysis mode?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "COMET Life Cycle vs Other Software ProcessesWith Unified Software Development P",
                        Description = "COMET Life Cycle vs Other Software ProcessesWith Unified Software Development Process",
                        OrderIndex = 3,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "COMET Life Cycle vs Other Software ProcessesWith Unified So", ContentHtml = "<p>COMET Life Cycle vs Other Software ProcessesWith Unified Software Development Process</p>
<p>The USDP provides considerable detail about the life cycle aspects and some detail about the method to be used.</p>
<p>The workflows of the USDP are the requirements, analysis, design, implementation, and test workflows.</p>
<p>Each phase of the COMET life cycle corresponds to a workflow of the USDP.</p>
<p>The COMET incremental software construction activity corresponds to the USDP implementation wo", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "COMET Life Cycle vs Other Software ProcessesWith the Spiral", ContentHtml = "<p>COMET Life Cycle vs Other Software ProcessesWith the Spiral Model</p>
<p>During the project planning for a given cycle of the spiral model, the project manager decides what specific technical activity should be performed in the third quadrant, which is the product development quadrant.</p>
<p>The selected technical activity, such as requirements modeling, analysis modeling, or design modeling, is then performed in the third quadrant</p>
<p>The risk analysis activity, performed in the second ", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Requirements, Analysis, and Design Modeling", ContentHtml = "<p>Requirements, Analysis, and Design Modeling</p>
<p>The UML notation supports requirements, analysis, and design concepts.</p>
<p>The COMET method described in this book separates requirements activities, analysis activities, and design activities.</p>
<p>COMET differentiates analysis from design as follows:</p>
<p>Analysis is breaking down or decomposing the problem so it is  understood better;</p>
<p>Design is synthesizing or composing (putting together) the solution.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Requirements, Analysis, and Design ModelingActivities in Re", ContentHtml = "<p>Requirements, Analysis, and Design ModelingActivities in Requirements Modeling</p>
<p>In the requirements model, the system is considered as a black box. The use case model is developed.</p>
<p>Use case modeling. Define actors and black box use cases.</p>
<p>The use case descriptions are a behavioral view; the relationships among the use cases give a structural view.</p>
<p>Addressing nonfunctional requirements is also important at the requirements phase.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Requirements, Analysis, & Design ModelingActivities in Anal", ContentHtml = "<p>Requirements, Analysis, & Design ModelingActivities in Analysis Modeling</p>
<p>In the analysis model, the emphasis is on understanding the problem; hence, the emphasis is on identifying the problem domain objects and the information passed between them.</p>
<p>As the analysis of the problem domain is considered. The activities in this model are as follows:</p>
<p>Static modeling</p>
<p>Object structuring</p>
<p>Dynamic interaction modeling</p>
<p>Dynamic state machine modeling</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Requirements, Analysis, & Design ModelingActivities in Desi", ContentHtml = "<p>Requirements, Analysis, & Design ModelingActivities in Design Modeling</p>
<p>In the design model, the solution domain is considered. During this phase, the analysis model is mapped to a concurrent design model.</p>
<p>Integrate the object communication model.</p>
<p>Make decisions about subsystem structure and interfaces.</p>
<p>Make decisions about what software architectural and design patterns to use in the software architecture.</p>
<p>Make decisions about class interfaces, in particula", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, COMET Life Cycle vs Other Software ProcessesWith Unified Software Development Process?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The USDP provides considerable detail about the life cycle aspects and some deta...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The USDP provides considerable detail about the life cycle a", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The workflows of the USDP are the requirements, analysis, design, implementation, and test workflows?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Each phase of the COMET life cycle corresponds to a workflow of the USDP....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Each phase of the COMET life cycle corresponds to a workflow", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The COMET incremental software construction activity corresponds to the USDP implementation workflow?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Designing Software Architecture",
                        Description = "Designing Software Architecture",
                        OrderIndex = 4,
                        EstimatedMinutes = 5,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Designing Software Architecture", ContentHtml = "<p>Designing Software Architecture</p>
<p>During software design modeling, design decisions are made relating to the characteristics of the software architecture.</p>
<p>Object-Oriented Software Architectures.</p>
<p>Client/Server Software Architectures.</p>
<p>Service-Oriented Architectures.</p>
<p>Distributed Component-Based Software Architectures.</p>
<p>Real-Time Software Architectures.</p>
<p>Software Product Line Architectures.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'During software design modeling, design decisions are made relating to the chara...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "During software design modeling", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Client/Server Software Architectures....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Client/Server Software Architectures.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 06 Use Case Modeling",
                Subtitle = "Requirements modeling with actors, use cases, and activity diagrams",
                Description = "Study Chapter 06 Use Case Modeling",
                ColorHex = "#06B6D4",
                IconName = "bi-person-check",
                Level = CourseLevel.Intermediate,
                OrderIndex = 6,
                SlideFileName = "Ch06_Use Case Modeling.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Identifying Use Cases",
                        OrderIndex = 1,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch06 – Use Case Modeling", ContentHtml = "<p>Ch06 – Use Case Modeling</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Requirement Modeling</p>
<p>Use Cases</p>
<p>Identifying Use Cases</p>
<p>Documenting Use Cases</p>
<p>Activity Diagrams</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Requirement Modelling", ContentHtml = "<p>Requirement Modelling</p>
<p>﻿The requirements of a system describe</p>
<p>﻿What the user expects from the system</p>
<p>﻿What the system will do for the user</p>
<p>﻿When defining the requirements of a system</p>
<p>The system should be viewed as a black box. O﻿nly the external characteristics of the system are considered</p>
<p>﻿Both functional and nonfunctional requirements need to be considered</p>
<p>﻿Requirements modeling consists of requirements analysis and requirements specification<", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Requirement Modelling﻿Requirements Analysis", ContentHtml = "<p>Requirement Modelling﻿Requirements Analysis</p>
<p>﻿The software requirements describe the functionality that the system must provide for the users.</p>
<p>﻿﻿﻿Requirements analysis involves analyzing the requirements by</p>
<p>Interviewing user</p>
<p>Analyzing the existing system(s)</p>
<p>﻿Understanding and documenting the current system</p>
<p>﻿Determining which features of the current system should be automated and which should remain manual</p>
<p>Discussing with users what functions co", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Requirement Modelling﻿Requirements Specification 1/2", ContentHtml = "<p>Requirement Modelling﻿Requirements Specification 1/2</p>
<p>﻿﻿The document that needs to be agreed on by the requirements analysts and the users.</p>
<p>﻿Starting point for the subsequent design & development</p>
<p>﻿Both functional requirements & nonfunctional requirements need to be specified</p>
<p>﻿A functional req. describes the functionality the system must be capable of providing in order to fulfill the purpose of the system</p>
<p>﻿Functionality the system needs to provide</p>
<p>﻿In", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Requirement Modelling﻿Requirements Specification 2/2", ContentHtml = "<p>Requirement Modelling﻿Requirements Specification 2/2</p>
<p>﻿﻿Quality Attributes for a well-written Software Requirement Specification (SRS)</p>
<p>Correct</p>
<p>Complete</p>
<p>﻿Unambiguous</p>
<p>﻿Consistent</p>
<p>﻿Verifiable</p>
<p>﻿Understandable by non-computer specialists</p>
<p>﻿Modifiable</p>
<p>﻿Traceable</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿The requirements of a system describe?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿What the user expects from the system...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿What the user expects from the system", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿What the system will do for the user?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿When defining the requirements of a system...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿When defining the requirements of a system", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The system should be viewed as a black box. O﻿nly the external characteristics of the system are con?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Use Cases",
                        Description = "The use case model describes the functional requirements of the system in terms of the actors & use cases",
                        OrderIndex = 2,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Use Cases", ContentHtml = "<p>Use Cases</p>
<p>The use case model describes the functional requirements of the system in terms of the actors & use cases</p>
<p>﻿The system is treated as a black box (﻿dealing with what the system does in response to the actor’s inputs)</p>
<p>﻿Functional requirements are described in terms of actors, which are users of the system, and use cases</p>
<p>﻿A use case (UC) defines a sequence of interactions between one or more actors and the system</p>
<p>﻿A use case always starts with input fr", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Use CasesSimple banking example", ContentHtml = "<p>Use CasesSimple banking example</p>
<p>﻿An automated teller machine (ATM) allows customers to withdraw cash from their bank accounts</p>
<p>﻿The Withdraw Funds use case describes the sequence of interactions between the ﻿customer and the system</p>
<p>The use case starts when the customer inserts an ATM card into the card reader,</p>
<p>Then responds to the system’s prompt for the PIN,</p>
<p>And eventually receives the cash dispensed by the ATM machine</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Use Cases﻿Emergency Monitoring System", ContentHtml = "<p>Use Cases﻿Emergency Monitoring System</p>
<p>﻿As an example of a very simple use case, consider View Alarms from the Emergency Monitoring System. There is one actor, the Monitoring Operator, who can request to view the status of all alarms</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Use CasesWhat are actors?", ContentHtml = "<p>Use CasesWhat are actors?</p>
<p>﻿An actor characterizes an external user (i.e., outside the system) that interacts with the system</p>
<p>﻿The only external entities that interact with the system</p>
<p>﻿Actors are outside the system and not part of it</p>
<p>﻿A user is an individual, whereas an actor represents the role played by all users of the same type</p>
<p>There are other types of actors in addition to or in place of human actors: external systems, I/O devices, or timers</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Use CasesSample actors", ContentHtml = "<p>Use CasesSample actors</p>
<p>Users</p>
<p>Homeowners are actors on HOLIS system</p>
<p>Authors are actors on a word processing system</p>
<p>Other systems or applications</p>
<p>HOLIS Control Switch is an actor on the HOLIS Central Control Unit</p>
<p>A device</p>
<p>Lights</p>
<p>Printer</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Use CasesIdentifying actors", ContentHtml = "<p>Use CasesIdentifying actors</p>
<p>﻿Following are some questions you might ask to help user representatives identify actors</p>
<p>Who (or what) is notified when something occurs within the system?</p>
<p>Who (or what) provides information or services to the system?</p>
<p>Who (or what) helps the system respond to and complete a task?</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, The use case model describes the functional requirements of the system in terms of the actors & use ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿The system is treated as a black box (﻿dealing with what the system does in res...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿The system is treated as a black box (﻿dealing with what th", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Functional requirements are described in terms of actors, which are users of the system, and use ca?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿A use case (UC) defines a sequence of interactions between one or more actors a...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿A use case (UC) defines a sequence of interactions between ", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿A use case always starts with input from an actor?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Use Cases﻿Primary vs secondary actors",
                        Description = "Use Cases﻿Primary vs secondary actors",
                        OrderIndex = 3,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Use Cases﻿Primary vs secondary actors", ContentHtml = "<p>Use Cases﻿Primary vs secondary actors</p>
<p>﻿﻿A primary actor initiates a use case. ﻿Thus, the use case starts with an input from the primary actor to which the system has to respond (gain value from the UC)</p>
<p>﻿Other actors, referred to as secondary actors, can participate in the use case</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Identifying Use Cases", ContentHtml = "<p>Identifying Use Cases</p>
<p>A use case (UC) describes a sequence of interactions between a system and an external actor that results in the actor being able to achieve some outcome of value</p>
<p>In this way, the functional requirements of the system are described in terms of the UCs, which constitute functional specification of a system.</p>
<p>To determine the UCs in the system, it is useful to start by considering the actors and the interactions they have with the system.</p>
<p>When dev", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Identifying Use CasesUse case considering and naming", ContentHtml = "<p>Identifying Use CasesUse case considering and naming</p>
<p>Questions to consider when identifying use cases</p>
<p>What will the actor use the system for?</p>
<p>Will the actor create, store, change, remove, or read data in the system?</p>
<p>Will the actor need to inform the system about external events or changes?</p>
<p>Will the actor need to be informed about certain occurrences in the system?</p>
<p>The names of use cases are always written in the form of a verb followed by an object.<", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Identifying Use CasesSimple Banking Example", ContentHtml = "<p>Identifying Use CasesSimple Banking Example</p>
<p>In addition to withdrawing cash from the ATM, the ATM Customer actor is also allowed to query an account or transfer funds between two accounts.</p>
<p>Because these are distinct functions initiated by the customer with different useful results, the query and transfer functions should be modeled as separate UCs, rather than being part of the original UC</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Documenting Use Cases", ContentHtml = "<p>Documenting Use Cases</p>
<p>UC Spec</p>
<p>﻿Use case name</p>
<p>﻿Summary</p>
<p>﻿Dependency</p>
<p>Actors</p>
<p>﻿Preconditions</p>
<p>﻿Main sequence</p>
<p>﻿Alternative</p>
<p>sequences</p>
<p>﻿Postcondition</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Documenting Use CasesUse Case Relationships", ContentHtml = "<p>Documenting Use CasesUse Case Relationships</p>
<p>UC Relationships</p>
<p>Generalization</p>
<p>Include: mandatory</p>
<p>Extend: optional</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Use Cases﻿Primary vs secondary actors?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿﻿A primary actor initiates a use case. ﻿Thus, the use case starts with an input...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿﻿A primary actor initiates a use case. ﻿Thus", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Other actors, referred to as secondary actors, can participate in the use case?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A use case (UC) describes a sequence of interactions between a system and an ext...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A use case (UC) describes a sequence of interactions between", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, In this way, the functional requirements of the system are described in terms of the UCs, which cons?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Activity Diagrams 1/2",
                        Description = "Activity Diagrams 1/2",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Activity Diagrams 1/2", ContentHtml = "<p>Activity Diagrams 1/2</p>
<p>An activity diagram can be used to represent the sequential steps of a UC, including the main sequence and all the alternative sequences</p>
<p>Depicting the flow of control & sequencing among activities</p>
<p>Shows the sequence of activities, decision nodes, loops, and even concurrent activities</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Activity Diagrams 2/2", ContentHtml = "<p>Activity Diagrams 2/2</p>
<p>An activity node can be used to represent one or more sequential steps of the UC</p>
<p>To depict a use case, a subset of the activity diagram capabilities is sufficient</p>
<p>Activity diagrams can also be used to depict sequencing among UCs.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, An activity diagram can be used to represent the sequential steps of a UC, including the main sequen?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Depicting the flow of control & sequencing among activities...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Depicting the flow of control & sequencing among activities", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Shows the sequence of activities, decision nodes, loops, and even concurrent activities?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'An activity node can be used to represent one or more sequential steps of the UC...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "An activity node can be used to represent one or more sequen", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, To depict a use case, a subset of the activity diagram capabilities is sufficient?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 07 Static Modeling",
                Subtitle = "Class diagrams, associations, composition, aggregation, and generalization hierarchies",
                Description = "Composition & Aggregation Hierarchies. Generalization/Specialization Hierarchy",
                ColorHex = "#3B82F6",
                IconName = "bi-columns-gap",
                Level = CourseLevel.Intermediate,
                OrderIndex = 7,
                SlideFileName = "Ch07_Static Modeling.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Association Between Classes",
                        OrderIndex = 1,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch07 – Static Modeling", ContentHtml = "<p>Ch07 – Static Modeling</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Overview</p>
<p>Association Between Classes</p>
<p>Composition & Aggregation Hierarchies</p>
<p>Generalization/Specialization Hierarchy</p>
<p>Static Modeling & the UML</p>
<p>Context Modeling</p>
<p>Static Modeling of Entity Classes</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Overview", ContentHtml = "<p>Overview</p>
<p>﻿The static model</p>
<p>﻿Addresses the static structural view of a problem, which does not vary with time</p>
<p>﻿Describes the static structure of the system being modeled, which is considered less likely to change than the functions of the system</p>
<p>﻿Defines the classes in the system, the attributes of the classes, the relationships between classes, and the operations of each class</p>
<p>﻿Static modeling refers to the modeling process and the UML class diagram notation", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "OverviewObjects and Classes", ContentHtml = "<p>OverviewObjects and Classes</p>
<p>Objects represent ‘’thing’’ in real world</p>
<p>Provide understanding of real world</p>
<p>Form basis for a  computer solution</p>
<p>An Object (object instance) is a single ‘’thing’’</p>
<p>E.g., an account, an employee</p>
<p>A Class (object class) is a collection of objects with the same characteristics</p>
<p>E.g., account, employee</p>
<p>Attribute</p>
<p>Data value held  by objects in class</p>
<p>E.g., account number, balance</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "OverviewObjects and Classes", ContentHtml = "<p>OverviewObjects and Classes</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "OverviewStatic Modeling", ContentHtml = "<p>OverviewStatic Modeling</p>
<p>Define structural relationships between classes</p>
<p>Depict classes and their relationships on class diagram</p>
<p>Relationships between classes</p>
<p>Associations</p>
<p>Composition / Aggregation</p>
<p>Generalization / Specialization</p>
<p>Static Modeling during Analysis</p>
<p>System Context Class Diagram: depict external classes and system boundary</p>
<p>Static Modeling of Entity classes: persistent classes that store data</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Association Between Classes", ContentHtml = "<p>Association Between Classes</p>
<p>﻿An association defines a relationship between two or more classes, denoting a static, structural relationship between classes.</p>
<p>I.e: Employee Works in Department, where Employee and Department are classes and Works in is an association.</p>
<p>The classes are nouns, whereas the association is usually a verb or verb phrase.</p>
<p>﻿A link is a connection between instances of the classes (objects) and represents an instance of an association between cla", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Association Between ClassesUML Notations 1/2", ContentHtml = "<p>Association Between ClassesUML Notations 1/2</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Generalization/Specialization Hierarchy...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Generalization/Specialization Hierarchy", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Addresses the static structural view of a problem, which does not vary with tim...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Addresses the static structural view of a problem", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Describes the static structure of the system being modeled, which is considered less likely to chan?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Association Between ClassesUML Notations 2/2",
                        Description = "Association Between ClassesUML Notations 2/2",
                        OrderIndex = 2,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Association Between ClassesUML Notations 2/2", ContentHtml = "<p>Association Between ClassesUML Notations 2/2</p>
<p>﻿Associations on a class diagram</p>
<p>Class attributes</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Association Between ClassesTernary & Unary Associations", ContentHtml = "<p>Association Between ClassesTernary & Unary Associations</p>
<p>﻿A ternary association is a three-way association among classes.</p>
<p>﻿A unary association, also referred to as a self-association, is an association between an object of one class and another object in the same class.</p>
<p>Person ﻿Is child of Person</p>
<p>﻿Person Is married to Person</p>
<p>Employee Is boss of Employee</p>
<p>The Buyer negotiates a price with the Seller through an Agent</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Association Between Classes﻿Association Classes", ContentHtml = "<p>Association Between Classes﻿Association Classes</p>
<p>﻿An association class is a class that models an association between two or more classes.</p>
<p>The attributes of the association class are the attributes of the association.</p>
<p>In a complex association between two or more classes, it is possible for an association to have attributes. This happens most often in many-to-many associations, where an attribute does not belong to any of the classes but belongs to the association.</p>
<p>A", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Composition & Aggregation Hierarchies", ContentHtml = "<p>Composition & Aggregation Hierarchies</p>
<p>﻿Composition & aggregation hierarchies address a class that is made up of other classes</p>
<p>﻿Special forms of a relationship in which classes are connected by the whole/part relationship</p>
<p>﻿ The relationship between the parts and the whole is an Is part of relationship</p>
<p>Relationship</p>
<p>Characteristics</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Composition & Aggregation HierarchiesComposition Relationsh", ContentHtml = "<p>Composition & Aggregation HierarchiesComposition Relationship</p>
<p>﻿In composition relationship, ﻿the part objects are created, live, and die together with the whole. The part object can belong to only one whole.</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Composition & Aggregation HierarchiesAggregation Hierarchy", ContentHtml = "<p>Composition & Aggregation HierarchiesAggregation Hierarchy</p>
<p>﻿The aggregation hierarchy is a weaker form of whole/part relationship.</p>
<p>Part instances can be added to and removed from the aggregate whole. For this reason:</p>
<p>﻿Aggregations are likely to be used to model conceptual classes rather than physical classes.</p>
<p>A part could belong to more than one aggregation</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "﻿Generalization/Specialization Hierarchy", ContentHtml = "<p>﻿Generalization/Specialization Hierarchy</p>
<p>﻿Some classes are similar but not identical. They have some attributes in common and others that are different</p>
<p>﻿Common attributes are abstracted into a generalized class, which is referred to as a superclass</p>
<p>﻿The different attributes are properties of the specialized class, which is referred to as a subclass.</p>
<p>﻿There is an Is a relationship between the subclass and the superclass.</p>
<p>﻿The superclass is also referred to as", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "﻿﻿Generalization/Specialization HierarchyInheritance of Cla", ContentHtml = "<p>﻿﻿Generalization/Specialization HierarchyInheritance of Class Attributes/Operations</p>
<p>﻿Each subclass inherits the properties (﻿attributes, operations)  of the superclass but then extends these properties in different ways</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Association Between ClassesUML Notations 2/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Associations on a class diagram...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Associations on a class diagram", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Association Between ClassesTernary & Unary Associations?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿A ternary association is a three-way association among classes....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿A ternary association is a three-way association among clas", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿A unary association, also referred to as a self-association, is an association between an object of?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Static Modeling & The UML",
                        Description = "Static Modeling & The UML",
                        OrderIndex = 3,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Static Modeling & The UML", ContentHtml = "<p>Static Modeling & The UML</p>
<p>﻿The approach used in COMET is to have a conceptual static model early in the analysis phase that is used to model and help understand the problem domain.</p>
<p>The initial emphasis is on modeling physical classes & entity classes</p>
<p>﻿Physical classes: classes that have physical characteristics – that is, they can be seen & touched (﻿users, external systems, timers)</p>
<p>﻿Entity classes are conceptual data-intensive classes that are often persistent (lo", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Context Modeling", ContentHtml = "<p>Context Modeling</p>
<p>﻿Context modeling explicitly identifies what is inside the system and what is outside.</p>
<p>Can be done at the total system (hardware and software) level or at the software system (software only) level</p>
<p>Helps to ﻿understand the scope of a computer system:  what is to be included inside the system and what is to be left outside the system</p>
<p>﻿A diagram that explicitly shows the border between the system (hardware and software), which is treated as a black bo", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Context ModelingSoftware System Context Diagram", ContentHtml = "<p>Context ModelingSoftware System Context Diagram</p>
<p>﻿A diagram that explicitly shows the border between the software system, also treated as a black box, & the external environment (which now includes the hardware)</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Context ModelingClasses Categorization Using UML Stereotype", ContentHtml = "<p>Context ModelingClasses Categorization Using UML Stereotypes</p>
<p>﻿In class structuring, the COMET method advocates categorizing classes in order to group together classes with similar characteristics</p>
<p>﻿In UML, stereotypes are used to distinguish among the various kinds of classes</p>
<p>﻿A stereotype is a subclass of an existing modeling element (e.g., an application or external class) that is used to represent a usage distinction (e.g., the kind of application or external class)</p", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Context ModelingModeling External Classes 1/3", ContentHtml = "<p>Context ModelingModeling External Classes 1/3</p>
<p>﻿A human user often interacts with the software system by means of standard I/O devices such as a keyboard/display and mouse﻿</p>
<p>External input device:  a device</p>
<p>that only provides input to the</p>
<p>system – for example, a sensor</p>
<p>External output device: a device that only receives output from the system – for example, an actuator</p>
<p>External I/O device: a device that both provides input to the system and receives ou", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Context ModelingModeling External Classes 2/3", ContentHtml = "<p>Context ModelingModeling External Classes 2/3</p>
<p>﻿Actors and External Classes</p>
<p>﻿Actors are a more abstract concept than external classes. The relationship between actors and external classes is as follows:</p>
<p>﻿An I/O device actor is equivalent to an external I/O device class. This means the I/O device actor interfaces to the system via an external I/O device class.</p>
<p>An external system actor is equivalent to an external system class.</p>
<p>﻿A timer actor interfaces to the", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Context ModelingModeling External Classes 3/3", ContentHtml = "<p>Context ModelingModeling External Classes 3/3</p>
<p>﻿Banking System software context class diagram with stereotypes</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Static Modeling of Entity Classes", ContentHtml = "<p>Static Modeling of Entity Classes</p>
<p>﻿Entity classes: store data and provide access to this data</p>
<p>﻿During static modeling of the problem domain, the COMET emphasis is on determining the entity classes that are defined in the problem, their attributes,  and their relationships</p>
<p>﻿Entity class model for online shopping application</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿The approach used in COMET is to have a conceptual static model early in the analysis phase that is?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The initial emphasis is on modeling physical classes & entity classes...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The initial emphasis is on modeling physical classes & entit", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Physical classes: classes that have physical characteristics – that is, they can be seen & touched ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Entity classes are conceptual data-intensive classes that are often persistent ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Entity classes are conceptual data-intensive classes that a", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, A constraint specifies a condition or restriction that must be true?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Static Modeling of Entity Classes﻿Modeling Class Attribute",
                        Description = "Static Modeling of Entity Classes﻿Modeling Class Attribute",
                        OrderIndex = 4,
                        EstimatedMinutes = 5,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Static Modeling of Entity Classes﻿Modeling Class Attribute", ContentHtml = "<p>Static Modeling of Entity Classes﻿Modeling Class Attribute</p>
<p>﻿Each class has several attributes that provide information that distinguishes this class from other classes. Furthermore, each instance of the class has specific values of these attributes to differentiate it from other instances of the class</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Static Modeling of Entity Classes﻿Modeling Class Attribute?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Each class has several attributes that provide information that distinguishes t...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Each class has several attributes that provide information that distinguishes this class from other classes. Furthermor", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 08 Object and Class Structuring",
                Subtitle = "Categorizing software objects: boundary, entity, control, and application logic classes",
                Description = "Ch08 - ﻿Object and Class Structuring. External Classes & Software Boundary Classes",
                ColorHex = "#10B981",
                IconName = "bi-boxes",
                Level = CourseLevel.Intermediate,
                OrderIndex = 8,
                SlideFileName = "Ch08_Object and Class Structuring.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Presented by group 6",
                        Description = "External Classes & Software Boundary Classes",
                        OrderIndex = 1,
                        EstimatedMinutes = 25,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch08 - ﻿Object and Class Structuring", ContentHtml = "<p>Ch08 - ﻿Object and Class Structuring</p>
<p>Presented by group 6</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Overview</p>
<p>External Classes & Software Boundary Classes</p>
<p>Entity Classes & Objects</p>
<p>Control Classes & Objects</p>
<p>Application Logic Classes & Objects</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Overview", ContentHtml = "<p>Overview</p>
<p>Requirement modeling is to understand the ﻿problem domain</p>
<p>Use case modeling: actors, UCs, UC diagrams</p>
<p>Static modeling: class/object relationships, system context class diagrams, software context class diagrams, entity class models</p>
<p>﻿Object and Class Structuring are ﻿to determine the software objects in the system</p>
<p>﻿The emphasis is on software objects that model real-world objects in the problem domain</p>
<p>The application ﻿classes are categorized in", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "OverviewObject & Class Structuring Categories 1/3", ContentHtml = "<p>OverviewObject & Class Structuring Categories 1/3</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "OverviewObject & Class Structuring Categories 2/3", ContentHtml = "<p>OverviewObject & Class Structuring Categories 2/3</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, External Classes & Software Boundary Classes?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Application Logic Classes & Objects...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Application Logic Classes & Objects", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Requirement modeling is to understand the ﻿problem domain?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Use case modeling: actors, UCs, UC diagrams...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Use case modeling: actors", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Static modeling: class/object relationships, system context class diagrams, software context class d?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "OverviewObject & Class Structuring Categories 3/3",
                        Description = "OverviewObject & Class Structuring Categories 3/3",
                        OrderIndex = 2,
                        EstimatedMinutes = 25,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "OverviewObject & Class Structuring Categories 3/3", ContentHtml = "<p>OverviewObject & Class Structuring Categories 3/3</p>
<p>﻿Application logic object. Software object that contains the details of the application logic. Needed when it is desirable to hide the application logic separately from the data being manipulated because it is considered likely that the application logic could change independently of the data.</p>
<p>For information systems, application logic objects are usually business logic objects</p>
<p>For real-time, scientific, or engineering ap", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "External Classes & Software Boundary Classes", ContentHtml = "<p>External Classes & Software Boundary Classes</p>
<p>﻿User Interaction Objects</p>
<p>A user interaction object communicates directly with the human user, receiving input from the user and providing output to the user via standard I/O devices such as the keyboard, visual display, and mouse.</p>
<p>Depending on the user interface technology, the user interface could be very simple (such as a command line interface) or it could be more complex (such as a graphical user interface [GUI] object).<", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Entity Classes & Objects", ContentHtml = "<p>Entity Classes & Objects</p>
<p>﻿An entity object is a software object that stores information.</p>
<p>Entity objects are instances of entity classes, whose attributes and relationships with other entity classes are determined during static modeling</p>
<p>﻿Entity objects store data and provide limited access to that data via the operations they provide.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Control Classes & Objects", ContentHtml = "<p>Control Classes & Objects</p>
<p>﻿A control object provides the overall coordination of the objects that realize a use case.</p>
<p>Simple use cases do not need control objects. However, in a more complex use case, a control object is usually needed.</p>
<p>A control object is analogous to the conductor of an orchestra, who orchestrates (controls) the behavior of the other objects that participate in the use case, notifying each object when and what it should perform.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Control Classes & ObjectsCategories of Control Objects", ContentHtml = "<p>Control Classes & ObjectsCategories of Control Objects</p>
<p>Depending on the characteristics of the use case, the control object may be state-dependent or timer objects</p>
<p>﻿A state-dependent control object is a control object whose behavior varies in each of its states</p>
<p>﻿A timer object is a control object that is activated by an external timer – for example,  a real-time clock or operating system clock. The timer object either performs some action itself or activates another obje", OrderIndex = 5, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, OverviewObject & Class Structuring Categories 3/3?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Application logic object. Software object that contains the details of the appl...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Application logic object. Software object that contains the", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, For information systems, application logic objects are usually business logic objects?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'For real-time, scientific, or engineering applications, they are usually algorit...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "For real-time", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Another category is service objects, which provide services for client objects, typically in service?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Control Classes & ObjectsState-dependent Control Object",
                        Description = "Control Classes & ObjectsState-dependent Control Object",
                        OrderIndex = 3,
                        EstimatedMinutes = 25,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Control Classes & ObjectsState-dependent Control Object", ContentHtml = "<p>Control Classes & ObjectsState-dependent Control Object</p>
<p>A state-dependent control object receives incoming events that cause state transitions and generates output events that control other objects.</p>
<p>The output event generated by a state-dependent control object depends not only on the input received by the object but also on the current state of the object.</p>
<p>Example: state-dependent control object ATM Control is defined by means of the ATM Control state-chart. In the exam", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Application Logic Classes & ObjectsBusiness Logic Objects 1", ContentHtml = "<p>Application Logic Classes & ObjectsBusiness Logic Objects 1/2</p>
<p>﻿Defines the business-specific application logic for processing a client request. The goal is to</p>
<p>Encapsulate (hide) business rules that could change independently of each other into separate business logic objects.</p>
<p>Separate the business rules from the entity data that they operate on, because the business rules can change independently of the entity data.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Application Logic Classes & ObjectsBusiness Logic Objects 2", ContentHtml = "<p>Application Logic Classes & ObjectsBusiness Logic Objects 2/2</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Application Logic Classes & Objects﻿Algorithm Objects 1/2", ContentHtml = "<p>Application Logic Classes & Objects﻿Algorithm Objects 1/2</p>
<p>﻿﻿An algorithm object encapsulates an algorithm used in the problem domain. This kind of object is more prevalent in real-time, scientific, and engineering domains.</p>
<p>Algorithm objects are used when there is a substantial algorithm used in the problem domain that can change independently of the other objects</p>
<p>﻿Simple algorithms ﻿are usually operations of an entity object that operate on the data encapsulated in the e", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Application Logic Classes & ObjectsAlgorithm Objects 2/2", ContentHtml = "<p>Application Logic Classes & ObjectsAlgorithm Objects 2/2</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Control Classes & ObjectsState-dependent Control Object?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A state-dependent control object receives incoming events that cause state trans...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A state-dependent control object receives incoming events th", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The output event generated by a state-dependent control object depends not only on the input receive?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Example: state-dependent control object ATM Control is defined by means of the A...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Example: state-dependent control object ATM Control is defined by means of the ATM Control state-chart. In the example", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Application Logic Classes & ObjectsBusiness Logic Objects 1/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Application Logic Classes & Objects﻿Service Objects 1/2",
                        Description = "Application Logic Classes & Objects﻿Service Objects 1/2",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Application Logic Classes & Objects﻿Service Objects 1/2", ContentHtml = "<p>Application Logic Classes & Objects﻿Service Objects 1/2</p>
<p>﻿﻿ ﻿A service object is an object that provides a service for other objects. They are usually provided in service-oriented architectures and applications.</p>
<p>﻿Client objects can request a service from the service object, which the service object will respond to. A service object never initiates a request; however,  in response to a service request it might seek the assistance of other service objects.</p>
<p>Service objects p", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Application Logic Classes & ObjectsService Objects 2/2", ContentHtml = "<p>Application Logic Classes & ObjectsService Objects 2/2</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Application Logic Classes & Objects﻿Service Objects 1/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿﻿ ﻿A service object is an object that provides a service for other objects. The...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿﻿ ﻿A service object is an object that provides a service fo", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Client objects can request a service from the service object, which the service object will respond?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Service objects play an important role in service-oriented architectures, althou...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Service objects play an important role in service-oriented architectures", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, A service object might encapsulate the data it needs to service client requests or access another en?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 09-11 Dynamic Modeling",
                Subtitle = "Interaction modeling with communication and sequence diagrams, finite state machines",
                Description = "Stateless Dynamic Interaction Modeling. State-dependent dynamic interaction modeling",
                ColorHex = "#EF4444",
                IconName = "bi-graph-up",
                Level = CourseLevel.Intermediate,
                OrderIndex = 9,
                SlideFileName = "Ch09-11_Dynamic Modeling.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Dynamic Interaction Modeling",
                        OrderIndex = 1,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch09-11: ﻿Dynamic modeling", ContentHtml = "<p>Ch09-11: ﻿Dynamic modeling</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Dynamic Interaction Modeling</p>
<p>Stateless Dynamic Interaction Modeling</p>
<p>Finite State Machines</p>
<p>State-dependent dynamic interaction modeling</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Interaction Modeling", ContentHtml = "<p>Dynamic Interaction Modeling</p>
<p>Describes dynamic interaction modeling concepts. Interaction (sequence or communication) diagrams are developed for each UC, including the main scenario and alternative scenarios. It also describes how to develop an interaction model starting from the UC.</p>
<p>Dynamic modeling provides a view of a system in which control and sequencing are considered, either within an object (by means of a finite state machine) or between objects (by analysis of object in", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Interaction ModelingCommunication Diagram 1/2", ContentHtml = "<p>Dynamic Interaction ModelingCommunication Diagram 1/2</p>
<p>A communication diagram is a UML interaction diagram that depicts a dynamic view of a group of objects interacting with each other by showing the sequence of messages passed among them.</p>
<p>On a communication diagram, the sequence in which the objects participate in each UC is depicted by means of message sequence numbers.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Interaction ModelingCommunication Diagram 2/2", ContentHtml = "<p>Dynamic Interaction ModelingCommunication Diagram 2/2</p>
<p>The communication diagram for the View Alarms UC depicts the user interaction object, Operator Interaction, making a request to the service object, Alarm Service & receiving a response</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Interaction ModelingSequence Diagram 1/2", ContentHtml = "<p>Dynamic Interaction ModelingSequence Diagram 1/2</p>
<p>The interaction among objects can also be shown on a sequence diagram.</p>
<p>A sequence diagram shows the objects participating in the interaction and the sequence in which messages are sent.</p>
<p>Sequence diagrams can also depict loops and iterations.</p>
<p>Sequence diagrams and communication diagrams depict similar (although not necessarily identical) information, but in different ways.</p>
<p>In the following example, however, th", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Interaction ModelingSequence Diagram 2/2", ContentHtml = "<p>Dynamic Interaction ModelingSequence Diagram 2/2</p>
<p>An example of a sequence diagram for the View Alarms UC is shown in Figure 9.3. This sequence diagram conveys the same information as the communication diagram shown in Figure 9.2.</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Interaction ModelingSequence vs. Communication Diag", ContentHtml = "<p>Dynamic Interaction ModelingSequence vs. Communication Diagram</p>
<p>Either a sequence diagram or a communication diagram can be used to depict the object interaction and sequence of messages passed among objects.</p>
<p>However, using iterations (such as do-while) and decision statements (if-then-else) can obscure the sequence of object interactions.</p>
<p>The communication diagram shows the layout of the objects, particularly how the objects are connected to each other.</p>
<p>The COMET ", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'State-dependent dynamic interaction modeling...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "State-dependent dynamic interaction modeling", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Describes dynamic interaction modeling concepts. Interaction (sequence or communication) diagrams ar?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Dynamic modeling provides a view of a system in which control and sequencing are...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Dynamic modeling provides a view of a system in which control and sequencing are considered", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Dynamic interaction modeling is based on the realization of the UCs developed during UC modeling.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Stateless Dynamic Interaction ModelingGeneral Introduction",
                        Description = "Stateless Dynamic Interaction ModelingGeneral Introduction",
                        OrderIndex = 2,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Stateless Dynamic Interaction ModelingGeneral Introduction", ContentHtml = "<p>Stateless Dynamic Interaction ModelingGeneral Introduction</p>
<p>Dynamic interaction modeling is carried out for each UC. It is an iterative strategy to help determine how the analysis model objects interact with each other to support the UCs.</p>
<p>This analysis might show a need for additional objects and/or additional interactions to be defined.</p>
<p>Dynamic interaction modeling can be either state-dependent or stateless, depending on whether the object communication is state-dependen", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Stateless Dynamic Interaction ModelingView Alarms Example 1", ContentHtml = "<p>Stateless Dynamic Interaction ModelingView Alarms Example 1/2</p>
<p>As an example of stateless dynamic interaction modeling, consider View Alarms UC from the Emergency Monitoring System case study.</p>
<p>1. Develop UC Model</p>
<p>The UC description is brieflydescribed as follows:</p>
<p>UC name: View Alarms</p>
<p>Actor: Monitoring Operator</p>
<p>Summary: The monitoring operator views outstanding alarms and acknowledges that the cause of an alarm is being addressed.</p>
<p>Precondition:", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Stateless Dynamic Interaction ModelingView Alarms Example 2", ContentHtml = "<p>Stateless Dynamic Interaction ModelingView Alarms Example 2/2</p>
<p>2. Determine Objects Needed to Realize UC</p>
<p>Because View Alarms is a simple UC, only two objects participate in the UC.</p>
<p>3. Determine Message Communication Sequence</p>
<p>The communication diagram for this UC depicts the user interaction object, the OperatorInteraction object, making a request to the service object, AlarmService, which responds with the desired information</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Stateless Dynamic Interaction ModelingMake Order Request Ex", ContentHtml = "<p>Stateless Dynamic Interaction ModelingMake Order Request Example 1/5</p>
<p>The second example of stateless dynamic interaction modeling is from the online shopping service-oriented system.</p>
<p>1. Develop UC Model In the Make Order Request UC, a customer actor enters the order request information. The system then gets the account information and requests credit card authorization. If the credit card is authorized, the system creates a new delivery order and displays the order.</p>
<p>The", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Stateless Dynamic Interaction ModelingMake Order Request Ex", ContentHtml = "<p>Stateless Dynamic Interaction ModelingMake Order Request Example 2/5</p>
<p>Use case name: Make Order Request</p>
<p>Summary: Customer enters an order request to purchase items from the</p>
<p>online shopping system. The customer’s credit card is checked for validity</p>
<p>and sufficient credit to pay for the requested catalog items.</p>
<p>Actor: Customer</p>
<p>Precondition: Customer has selected one or more catalog items.</p>
<p>Main sequence:</p>
<p>Customer provides order request and c", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Stateless Dynamic Interaction ModelingMake Order Request Ex", ContentHtml = "<p>Stateless Dynamic Interaction ModelingMake Order Request Example 3/5</p>
<p>Alternative sequences:</p>
<p>Step 2: If customer does not have account, the system prompts the customer to provide information in order to create a new account. The customer can either enter the account information or cancel the order.</p>
<p>Step 3: If authorization of the customer’s credit card is denied (e.g., invalid credit card or insufficient funds in the customer’s credit card account), the system prompts the", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Stateless Dynamic Interaction ModelingMake Order Request Ex", ContentHtml = "<p>Stateless Dynamic Interaction ModelingMake Order Request Example 4/5</p>
<p>3. Determine Message Communication Sequence</p>
<p>The interaction sequence among the objects needs to reflect the interaction sequence between the actor and the system, as described in the UC.</p>
<p>The UC description (step 1) indicates that the customer requests to create an order => M1, M2</p>
<p>In step 2 of the UC, the system retrieves the account information => M3, M4</p>
<p>In step 3 of the UC, the system che", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Stateless Dynamic Interaction ModelingMake Order Request Ex", ContentHtml = "<p>Stateless Dynamic Interaction ModelingMake Order Request Example 5/5</p>
<p>4. Determine Alternative Sequences.</p>
<p>Alternative scenarios for this UC are that the customer does not have an account, in which case a new account will be created, or that the credit card authorization is denied, in which case the customer has the option of selecting a different card. The new account alternative scenario is depicted in Figure 9.7.</p>
<p>The credit card denied alternative scenario is depicted b", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Stateless Dynamic Interaction ModelingGeneral Introduction?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Dynamic interaction modeling is carried out for each UC. It is an iterative stra...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Dynamic interaction modeling is carried out for each UC. It ", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, This analysis might show a need for additional objects and/or additional interactions to be defined.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Dynamic interaction modeling can be either state-dependent or stateless, dependi...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Dynamic interaction modeling can be either state-dependent or stateless", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The main steps in the stateless dynamic interaction modeling approach are as follows, starting with ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Finite State Machines",
                        Description = "Finite State Machines",
                        OrderIndex = 3,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Finite State Machines", ContentHtml = "<p>Finite State Machines</p>
<p>A finite state machine (also referred to as state machine) is a conceptual machine with a finite number of states.</p>
<p>A state transition is a change in state that is caused by an input event.</p>
<p>Alternatively, the event might have no effect, in which case the finite state machine remains in the same state.</p>
<p>The next state depends on the current state, as well as on the input event.</p>
<p>Finite state machines are used for modeling the control and se", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Finite State MachinesEvents and States", ContentHtml = "<p>Finite State MachinesEvents and States</p>
<p>Events</p>
<p>An event is an occurrence at a point in time; it is also known as a discrete event, discrete signal, or stimulus.</p>
<p>The precedence of the two events is reflected in the state that connects them, as shown in Figure 10.1</p>
<p>It is possible to make a state transition conditional through the use of a guard condition. The notation used is Event [Condition].</p>
<p>States</p>
<p>A state represents a recognizable situation that exi", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Finite State MachinesActions 1/3", ContentHtml = "<p>Finite State MachinesActions 1/3</p>
<p>Actions</p>
<p>Associated with a state transition is an optional output action.</p>
<p>An action is a computation that executes as a result of a state transition.</p>
<p>The action executes instantaneously at the state transition; thus conceptually an action is of zero duration. In practice, the duration of an action is very small compared to the duration of a state.</p>
<p>A transition action is an action that is a result of a transition from one stat", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Finite State MachinesActions 2/3", ContentHtml = "<p>Finite State MachinesActions 2/3</p>
<p>Entry Actions</p>
<p>An entry action is an instantaneous action that is performed on transition into the state.</p>
<p>Whereas transition actions (actions explicitly depicted on state transitions) can always be used, entry actions should only be used in certain situations.</p>
<p>The best time to use an entry action is when the following occur:</p>
<p>There is more than one transition into a state.</p>
<p>The same action needs to be performed on every ", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Finite State MachinesActions 3/3", ContentHtml = "<p>Finite State MachinesActions 3/3</p>
<p>Exit Actions</p>
<p>An exit action is an instantaneous action that is performed on transition out of the state.</p>
<p>The best time to use an exit action is when the following occur:</p>
<p>The best time to use an exit action is when the following occur:</p>
<p>There is more than one transition out of a state.</p>
<p>The same action needs to be performed on every transition out of the state.</p>
<p>The action is performed on exit from this state and n", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "State-dependent dynamic interaction modeling 1/5", ContentHtml = "<p>State-dependent dynamic interaction modeling 1/5</p>
<p>Deals with situations in which object interactions are state-dependent. State-dependent interactions involve at least one state-dependent control object that, by executing a statechart , provides the overall control and sequencing of its interactions with other objects</p>
<p>In state-dependent dynamic interaction modeling, the objective is to determine the interactions among the following objects</p>
<p>The state-dependent control objec", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "State-dependent dynamic interaction modeling 2/5", ContentHtml = "<p>State-dependent dynamic interaction modeling 2/5</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "State-dependent dynamic interaction modeling 3/5", ContentHtml = "<p>State-dependent dynamic interaction modeling 3/5</p>
<p>Sequence diagram for Validate PIN use case: Valid PIN scenario</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, A finite state machine (also referred to as state machine) is a conceptual machine with a finite num?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A state transition is a change in state that is caused by an input event....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A state transition is a change in state that is caused by an", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Alternatively, the event might have no effect, in which case the finite state machine remains in the?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The next state depends on the current state, as well as on the input event....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The next state depends on the current state", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Finite state machines are used for modeling the control and sequencing view of a system or object.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "State-dependent dynamic interaction modeling 4/5",
                        Description = "State-dependent dynamic interaction modeling 4/5",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "State-dependent dynamic interaction modeling 4/5", ContentHtml = "<p>State-dependent dynamic interaction modeling 4/5</p>
<p>Sequence diagram for Validate PIN use case: Invalid PIN scenario</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "State-dependent dynamic interaction modeling 5/5", ContentHtml = "<p>State-dependent dynamic interaction modeling 5/5</p>
<p>The main steps in the state-dependent dynamic interaction modeling strategy are presented in the following list. The sequence of interactions needs to reflect the main sequence of interactions described in the use case.</p>
<p>Determine the boundary object(s). Consider the objects that receive the inputs sent by the external objects in the external environment.</p>
<p>Determine the state-dependent control object. There is at least one co", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Sequence diagram for Validate PIN use case: Invalid PIN scenario...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Sequence diagram for Validate PIN use case: Invalid PIN scen", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The main steps in the state-dependent dynamic interaction modeling strategy are ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The main steps in the state-dependent dynamic interaction mo", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Determine the boundary object(s). Consider the objects that receive the inputs sent by the external ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 12 Overview of Software Architecture",
                Subtitle = "Component-based architecture, architectural patterns, and interface design",
                Description = "Ch12 - Overview of Software Architecture. Component-Based Software Architecture. Multiple Views of a Software Architecture",
                ColorHex = "#6366F1",
                IconName = "bi-layers",
                Level = CourseLevel.Intermediate,
                OrderIndex = 10,
                SlideFileName = "Ch12_Overview of Software Architecture.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Software Architecture Overview",
                        OrderIndex = 1,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch12 - Overview of Software Architecture", ContentHtml = "<p>Ch12 - Overview of Software Architecture</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Software Architecture Overview</p>
<p>Component-Based Software Architecture</p>
<p>Multiple Views of a Software Architecture</p>
<p>Software Architectural Patterns</p>
<p>Documenting Software Architectural Patterns</p>
<p>Interface Design</p>
<p>Designing Software Architectures</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Software Architecture Overview", ContentHtml = "<p>Software Architecture Overview</p>
<p>The software architecture of a program or computing system is the structure or structures of the system, which comprise</p>
<p>software elements,</p>
<p>the externally visible properties of those elements,</p>
<p>and the relationships among them.</p>
<p>The software architecture separates the overall structure of the system, in terms of subsystems and their interfaces, from the internal details of the individual subsystems.</p>
<p>A software architecture ", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Component-Based Software Architecture", ContentHtml = "<p>Component-Based Software Architecture</p>
<p>A structural perspective on software architecture is given by the widely held concept of component-based software architecture</p>
<p>A component-based software architecture consists of multiple components in which</p>
<p>Each component is self-contained and encapsulates certain information</p>
<p>A component is either a composite object composed of other objects or a simple object</p>
<p>A component provides an interface through which it communica", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Multiple Views of a Software ArchitectureStructural View of", ContentHtml = "<p>Multiple Views of a Software ArchitectureStructural View of a Software Architecture</p>
<p>The structural view of a software architecture is a static view.</p>
<p>At the highest level, subsystems are depicted on a class diagram where it highlight the static structural relationship between the subsystems, which are represented as composite or aggregate classes, and multiplicity of associations among them.</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Multiple Views of a Software ArchitectureDynamic View of a ", ContentHtml = "<p>Multiple Views of a Software ArchitectureDynamic View of a Software Architecture</p>
<p>The dynamic view of an architecture is a behavioural view, represented by a communication diagram.</p>
<p>This diagram shows the subsystems and the message communication between them. Furthermore, it must depicts all possible interactions.</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Multiple Views of a Software Architecture...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Multiple Views of a Software Architecture", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Documenting Software Architectural Patterns...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Documenting Software Architectural Patterns", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Multiple Views of a Software ArchitectureDeployment View of a Software Architec",
                        Description = "Multiple Views of a Software ArchitectureDeployment View of a Software Architecture",
                        OrderIndex = 2,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Multiple Views of a Software ArchitectureDeployment View of", ContentHtml = "<p>Multiple Views of a Software ArchitectureDeployment View of a Software Architecture</p>
<p>The deployment view of the software architecture depicts the physical conﬁguration of the software architecture, in particular how the subsystems of the architecture are allocated to physical nodes in a distributed conﬁguration.</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Patterns", ContentHtml = "<p>Software Architectural Patterns</p>
<p>Software architectural patterns provide the skeleton or template for the overall software architecture or high-level design of an application.</p>
<p>Software architectural patterns can be grouped into two main categories:</p>
<p>Architectural structure patterns, which address the static structure of the architecture,</p>
<p>Architectural communication patterns, which address the dynamic communication among distributed components of the architecture.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural PatternsLayers of Abstraction Archit", ContentHtml = "<p>Software Architectural PatternsLayers of Abstraction Architectural Pattern</p>
<p>The Layers of Abstraction pattern (Hierarchical Layers or Levels of Abstraction pattern) is a common architectural pattern that is applied in many different software domains. If software is designed in the form of layers, it can be extended by the addition of upper layers that use services provided by lower layers and contracted by the removal of upper layers</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural PatternsCall/Return Pattern", ContentHtml = "<p>Software Architectural PatternsCall/Return Pattern</p>
<p>This is the simplest form of communication between objects. A calling operation in the calling object invokes a called operation in the called object. Control is passed from the calling operation to the called operation at the time of operation invocation.</p>
<p>Any input parameters are passed from the calling operation to the called operation at the same time that control is passed. When the called operation ﬁnishes executing, it re", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural PatternsAsynchronous Message Communi", ContentHtml = "<p>Software Architectural PatternsAsynchronous Message Communication Pattern 1/2</p>
<p>With the Asynchronous (Loosely Coupled) Message Communication pattern, the producer component sends a message to the consumer component and does not wait for a reply.</p>
<p>The producer continues because it either does not need a response or has other functions to perform before receiving a response.</p>
<p>The consumer receives the message; if the consumer is busy when the message arrives, the message is q", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural PatternsAsynchronous Message Communi", ContentHtml = "<p>Software Architectural PatternsAsynchronous Message Communication Pattern 2/2</p>
<p>An example of the Asynchronous Message Communication pattern in a distributed environment is given on the generic communication diagram depicted below for the Automated Guided Vehicle System</p>
<p>It is also possible to have peer-to-peer communication between two components, which send asynchronous messages to each other. This kind of communication is referred to as bidirectional asynchronous communication<", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Multiple Views of a Software ArchitectureDeployment View of a Software Architecture?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The deployment view of the software architecture depicts the physical conﬁgurati...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The deployment view of the software architecture depicts the physical conﬁguration of the software architecture", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Software architectural patterns provide the skeleton or template for the overall...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Software architectural patterns provide the skeleton or temp", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Software architectural patterns can be grouped into two main categories:?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Software Architectural PatternsSynchronous Message Communication with Reply Pat",
                        Description = "Software Architectural PatternsSynchronous Message Communication with Reply Pattern",
                        OrderIndex = 3,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Software Architectural PatternsSynchronous Message Communic", ContentHtml = "<p>Software Architectural PatternsSynchronous Message Communication with Reply Pattern</p>
<p>With the Synchronous (Tightly Coupled) Message Communication with Reply pattern, the client component sends a message to the service component and then waits for a reply from the service.</p>
<p>When the message arrives, the service accepts it, processes it, generates a reply, and then sends the reply. The client and service then both continue.</p>
<p>The service is suspended if no message is available", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Documenting Software Architectural Patterns", ContentHtml = "<p>Documenting Software Architectural Patterns</p>
<p>It is very useful to have a standard way of describing and documenting a pattern so that it can be easily referenced, compared with other patterns, and reused.</p>
<p>Important aspects of a pattern: context, problem, and solution.</p>
<p>A typical template looks like this:</p>
<p>Pattern name</p>
<p>Aliases. Other names by which this pattern is known.</p>
<p>Context. The situation that gives rise to this problem.</p>
<p>Problem. Brief descrip", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Documenting Software Architectural PatternsSample - for the", ContentHtml = "<p>Documenting Software Architectural PatternsSample - for the Layered Pattern</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Interface Design", ContentHtml = "<p>Interface Design</p>
<p>An important goal of both object-oriented design and component-based software architecture is the separation of the interface from the implementation</p>
<p>An interface speciﬁes the externally visible operations of a class, service, or component without revealing the internal structure (implementation) of the operations</p>
<p>The interface can be considered a contract between the designer of the external view of the class and the implementer of the class internals.</", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Interface DesignDepict Interfaces", ContentHtml = "<p>Interface DesignDepict Interfaces</p>
<p>Because the same interface can be implemented in different ways, it is useful to depict the design of the interface separately from the component that realizes (i.e., implements) the interface.</p>
<p>Interfaces can be realized in wider contexts than classes. Thus, interfaces for subsystems, distributed components, and passive classes can all be depicted using the same interface notation.</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Designing Software Architectures", ContentHtml = "<p>Designing Software Architectures</p>
<p>During software design modeling, design decisions are made relating to the characteristics of the software architecture.</p>
<p>The following chapters describe the design of different kinds of software architectures:</p>
<p>Object-oriented software architectures. Ch14</p>
<p>Client/server software architectures. Ch15</p>
<p>Service-oriented architectures. Ch16</p>
<p>Distributed component-based software architectures. Ch17</p>
<p>Concurrent and real-tim", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Software Architectural PatternsSynchronous Message Communication with Reply Pattern?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'With the Synchronous (Tightly Coupled) Message Communication with Reply pattern,...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "With the Synchronous (Tightly Coupled) Message Communication with Reply pattern", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, When the message arrives, the service accepts it, processes it, generates a reply, and then sends th?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The service is suspended if no message is available. Although there might only b...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The service is suspended if no message is available. Although there might only be one client and one service", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 13 Software Subsystem Architectural Design",
                Subtitle = "Decomposing systems into subsystems, separation of concerns, and communication design",
                Description = "Ch13 - Software Subsystem Architectural Design. Issues in Software Architectural Design. Integrated Communication Diagrams",
                ColorHex = "#8B5CF6",
                IconName = "bi-diagram-2",
                Level = CourseLevel.Advanced,
                OrderIndex = 11,
                SlideFileName = "Ch13_Software Subsystem Architectural Design.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Issues in Software Architectural Design",
                        OrderIndex = 1,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch13 - Software Subsystem Architectural Design", ContentHtml = "<p>Ch13 - Software Subsystem Architectural Design</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>General Introduction</p>
<p>Issues in Software Architectural Design</p>
<p>Integrated Communication Diagrams</p>
<p>Separation of Concerns in Subsystem Design</p>
<p>Subsystem Structuring Criteria</p>
<p>Decisions about Message Communication between Subsystems</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "General Introduction", ContentHtml = "<p>General Introduction</p>
<p>During analysis modeling, the problem is analyzed by breaking it down and studying it on a UC–by–UC basis</p>
<p>During design modeling, the solution is synthesized by designing a software architecture that deﬁnes the structural & behavioral properties of the software system</p>
<p>To successfully manage the inherent complexity of a large-scale software system, it is necessary to provide an approach for decomposing the system into subsystems and developing the over", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "General Introduction", ContentHtml = "<p>General Introduction</p>
<p>To design the software architecture, it is necessary to start with the analysis model. Several decisions need to be made in designing the software architecture:</p>
<p>Integrate the use case–based interaction models into an initial software architecture.</p>
<p>Determine the subsystems using separation of concerns and subsystem structuring criteria</p>
<p>Determine the precise type of message communication among the subsystems</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Issues in Software Architectural Design", ContentHtml = "<p>Issues in Software Architectural Design</p>
<p>In the analysis of the problem domain and structuring a system into subsystems, the emphasis is on functional decomposition, such that each subsystem addresses a distinctly separate part of the system.</p>
<p>The design goal is for each subsystem to perform a major function that is relatively independent of the functionality provided by other subsystems.</p>
<p>A subsystem can be structured further into smaller subsystems, consisting of a subset ", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Issues in Software Architectural Design", ContentHtml = "<p>Issues in Software Architectural Design</p>
<p>Some subsystems can be determined relatively easily because of geographical distribution or server responsibility (client, service)</p>
<p>In other applications, it is not so obvious how to structure the system into subsystems. Because one of the goals of subsystem structuring is to have objects that are functionally related and highly coupled in the same subsystem, a good place to start is with the use cases. Objects that participate in the same", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Integrated Communication Diagrams", ContentHtml = "<p>Integrated Communication Diagrams</p>
<p>Why? To transition from analysis to design and to determine the subsystems, it is necessary to synthesize an initial software design from the analysis carried out so far.</p>
<p>How? By integrating the UC–based interaction diagrams developed as part of the dynamic model.</p>
<p>What? In the analysis model, at least one communication diagram is developed for each use case. The integrated communication diagram is a synthesis of all the communication diag", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Integrated Communication Diagrams", ContentHtml = "<p>Integrated Communication Diagrams</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Integrated Communication Diagrams...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Integrated Communication Diagrams", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Separation of Concerns in Subsystem Design?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Decisions about Message Communication between Subsystems...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Decisions about Message Communication between Subsystems", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, During analysis modeling, the problem is analyzed by breaking it down and studying it on a UC–by–UC ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Integrated Communication Diagrams",
                        Description = "Integrated Communication Diagrams",
                        OrderIndex = 2,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Integrated Communication Diagrams", ContentHtml = "<p>Integrated Communication Diagrams</p>
<p>The integrated communication diagram can get very complicated for a large system; therefore, it is necessary to have ways to reduce the amount of information</p>
<p>One way to reduce the amount of information on the diagram is to aggregate the messages</p>
<p>Furthermore, showing all the objects on one diagram might not be practical. A solution to this problem is to develop integrated communication diagrams for each subsystem and develop a higher-level", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Separation of Concerns in Subsystem DesignComposite Object", ContentHtml = "<p>Separation of Concerns in Subsystem DesignComposite Object</p>
<p>A composite object is typically composed of a group of related objects that work together in a coordinated fashion</p>
<p>Objects that are part of the same composite object should be in the same subsystem and separate from objects that are not part of the same composite object.</p>
<p>The composite object (the whole) and its constituent objects (the parts) are created together, live together, and die together.</p>
<p>ATM is th", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Separation of Concerns in Subsystem DesignGeographical Loca", ContentHtml = "<p>Separation of Concerns in Subsystem DesignGeographical Location</p>
<p>If two objects could potentially be physically separated in different geographical locations, they should be in different subsystems.</p>
<p>In the example, the service layer is divided because the 2 services don’t related by any mean.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Separation of Concerns in Subsystem DesignClients and Servi", ContentHtml = "<p>Separation of Concerns in Subsystem DesignClients and Services</p>
<p>Clients and services should be in separate subsystems. This guideline can be viewed as a special case of the geographical location rule because clients and services are usually at different locations</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Separation of Concerns in Subsystem DesignUser Interaction", ContentHtml = "<p>Separation of Concerns in Subsystem DesignUser Interaction</p>
<p>Users often use their own PCs as part of a larger distributed conﬁguration, so the most ﬂexible option is to keep user interaction objects in separate subsystems.</p>
<p>As user interaction objects are usually clients, this guideline can be viewed as a special case of the client/service guideline.</p>
<p>Furthermore, a user interaction object may be a composite graphical user interaction object composed of several simpler user", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Separation of Concerns in Subsystem DesignInterface to Exte", ContentHtml = "<p>Separation of Concerns in Subsystem DesignInterface to External Objects</p>
<p>A subsystem deals with a subset of the actors shown in the use case model and a subset of the external real-world objects shown on the context diagram. An external real-world object should interface to only one subsystem.</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Separation of Concerns in Subsystem DesignScope of Control", ContentHtml = "<p>Separation of Concerns in Subsystem DesignScope of Control</p>
<p>A control object and all the entity and I/O objects it directly controls should all be part of one subsystem and not split among subsystems.</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Subsystem Structuring Criteria", ContentHtml = "<p>Subsystem Structuring Criteria</p>
<p>The design considerations described in the previous section can be formalized as subsystem structuring criteria, which help ensure that subsystems are designed effectively.</p>
<p>Subsystems are generally depicted with the stereotype «subsystem». For certain software architectures consisting of distributed component-based subsystems, the stereotype «component» is used for such a subsystem, and in service-oriented architecture consisting of service subsyst", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'The integrated communication diagram can get very complicated for a large system...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The integrated communication diagram can get very complicated for a large system; therefore", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, One way to reduce the amount of information on the diagram is to aggregate the messages?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Furthermore, showing all the objects on one diagram might not be practical. A so...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Furthermore", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Separation of Concerns in Subsystem DesignComposite Object?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Subsystem Structuring CriteriaClient Subsystem",
                        Description = "Subsystem Structuring CriteriaClient Subsystem",
                        OrderIndex = 3,
                        EstimatedMinutes = 40,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Subsystem Structuring CriteriaClient Subsystem", ContentHtml = "<p>Subsystem Structuring CriteriaClient Subsystem</p>
<p>A client subsystem is a requester of one or more services.</p>
<p>Client subsystems include user interaction subsystems, control subsystems, and I/O subsystems. (will be detailed later)</p>
<p>A client subsystem may combines more than one role.</p>
<p>In this example, The Monitoring Sensor Component, Remote System Proxy, and Operator Presentation components are clients of Alarm Service and Monitoring Data Service</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Subsystem Structuring CriteriaUser Interaction Subsystem", ContentHtml = "<p>Subsystem Structuring CriteriaUser Interaction Subsystem</p>
<p>A user interaction subsystem provides the user interface and performs the role of a client in a client/server system, providing user access to services. There may be more than one user interaction subsystem – one for each type of user.</p>
<p>A user interaction subsystem is usually a composite object that is composed of several simpler user interaction objects.</p>
<p>May contain entity objects for local storage and caching, and", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Subsystem Structuring CriteriaService Subsystem", ContentHtml = "<p>Subsystem Structuring CriteriaService Subsystem</p>
<p>A service subsystem provides a service for client subsystems. It responds to requests from client subsystems, although it does not initiate any requests.</p>
<p>Include entity objects, coordinator objects that service client requests and determine what object should be assigned to handle them, and business logic objects that encapsulate application logic.</p>
<p>Usually associated with a set of related data repositories to access databas", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Subsystem Structuring CriteriaControl Subsystem", ContentHtml = "<p>Subsystem Structuring CriteriaControl Subsystem</p>
<p>A control subsystem controls a given part of the system. The subsystem receives its inputs from the external environment and generates outputs to the external environment.</p>
<p>A control subsystem is often state-dependent, in which case it includes at least one state-dependent control object.</p>
<p>In this example, AutomatedGuidedVehicleSystem will control the physical motor component after receiving signal from SupervisorySystem.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Subsystem Structuring CriteriaCoordinator Subsystem", ContentHtml = "<p>Subsystem Structuring CriteriaCoordinator Subsystem</p>
<p>Coordinator subsystems coordinate the execution of other subsystems, such as control subsystems or service subsystems.</p>
<p>This is a mandatory subsystem when to coordinating tasks are relatively complex such as deciding workflow for control subsystems or coordinating services in service-oriented architectures.</p>
<p>In this example, CustomerCoordinator has to communicate with multiple services to serve different kinds of request ", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Subsystem Structuring CriteriaInput/Output Subsystem", ContentHtml = "<p>Subsystem Structuring CriteriaInput/Output Subsystem</p>
<p>An input, output, or input/output subsystem is a subsystem that performs input and/or output operations on behalf of other subsystems.</p>
<p>Can be designed to be relatively autonomous.</p>
<p>In this example, the MonitoringSensorComponent is an input subsystem which receiving data from multiple sensors.</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Decisions about Message Communication between Subsystems", ContentHtml = "<p>Decisions about Message Communication between Subsystems</p>
<p>In the transition from the analysis model to the design model, one of the most important decisions relates to what type of message communication is needed between the subsystems.</p>
<p>A second related decision is to determine more precisely the name and parameters of each message.</p>
<p>In design modeling, a decision has to be made about the precise semantics of message communication, such as whether message communication will", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Decisions about Message Communication between Subsystems", ContentHtml = "<p>Decisions about Message Communication between Subsystems</p>
<p>Message communication between two subsystems can be unidirectional or bidirectional</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'A client subsystem is a requester of one or more services....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A client subsystem is a requester of one or more services.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Client subsystems include user interaction subsystems, control subsystems, and I/O subsystems. (will?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A client subsystem may combines more than one role....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A client subsystem may combines more than one role.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, In this example, The Monitoring Sensor Component, Remote System Proxy, and Operator Presentation com?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Decisions about Message Communication between Subsystems",
                        Description = "Decisions about Message Communication between Subsystems",
                        OrderIndex = 4,
                        EstimatedMinutes = 5,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Decisions about Message Communication between Subsystems", ContentHtml = "<p>Decisions about Message Communication between Subsystems</p>
<p>Figure below shows the result of two design decisions.</p>
<p>First, the four analysis model objects are designed as concurrent</p>
<p>Second, the design decision is made about the type of message communication between the subsystems.</p>
<p>asynchronous message communication between the producer & consumer,</p>
<p>synchronous message communication between the client and service</p>
<p>the precise name and parameters of each mess", OrderIndex = 1, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Decisions about Message Communication between Subsystems?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Figure below shows the result of two design decisions....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Figure below shows the result of two design decisions.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, First, the four analysis model objects are designed as concurrent?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Second, the design decision is made about the type of message communication betw...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Second", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, asynchronous message communication between the producer & consumer,?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 14 Designing Object-Oriented Software Architectures",
                Subtitle = "Detailed design of object-oriented architectures using COMET",
                Description = "Ch14 - Designing Object-Oriented Software Architectures. Concepts, Architectures, and Patterns. Designing Information Hiding Classes",
                ColorHex = "#EC4899",
                IconName = "bi-box",
                Level = CourseLevel.Advanced,
                OrderIndex = 12,
                SlideFileName = "Ch14_Designing Object-Oriented Software Architectures.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Concepts, Architectures, and Patterns",
                        OrderIndex = 1,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch14 - Designing Object-Oriented Software Architectures", ContentHtml = "<p>Ch14 - Designing Object-Oriented Software Architectures</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>General Introduction</p>
<p>Concepts, Architectures, and Patterns</p>
<p>Designing Information Hiding Classes</p>
<p>Designing Class Interface & Operations</p>
<p>Data Abstraction Classes</p>
<p>State-Machine Classes</p>
<p>Graphical User Interaction Classes</p>
<p>Business Logic Classes</p>
<p>Inheritance in Design</p>
<p>Class Interface Specifications</p>
<p>Detailed Design of Information Hiding Classes</p>
<p>Polymorphism and Dynamic Binding</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "General Introduction", ContentHtml = "<p>General Introduction</p>
<p>Object-oriented design refers to software systems that are designed using the concepts of</p>
<p>Information hiding: encapsulate different kinds of information (details of a data structure, state machine,..)</p>
<p>Classes: the design of class interfaces and the operations provided by each class</p>
<p>Inheritance: mechanism for sharing and reusing code between classes - a child class inherits the properties (encapsulated data and operations) of a parent class.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Concepts, Architectures, and Patterns", ContentHtml = "<p>Concepts, Architectures, and Patterns</p>
<p>Information hiding is a fundamental design concept in which a class encapsulates some information, such as a data structure, that is hidden from the rest of the system</p>
<p>The separation of the interface from the implementation.</p>
<p>The interface forms a contract between the provider of the interface and the user of the interface</p>
<p>These object-oriented concepts have also been applied and extended in the design of</p>
<p>Distributed and ", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Designing Information Hiding Classes", ContentHtml = "<p>Designing Information Hiding Classes</p>
<p>In design modeling, information hiding classes are categorized by stereotype.</p>
<p>Classes determined from the analysis model are categorized as following:</p>
<p>Entity classes from the analysis model, encapsulate data.</p>
<p>Boundary classes Communicate with and interface to the external environment.</p>
<p>Active (concurrent) classes: device I/O classes, proxy classes</p>
<p>Passive boundary classes: graphical user interaction class</p>
<p>Con", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Designing Class Interface & Operations", ContentHtml = "<p>Designing Class Interface & Operations</p>
<p>The class interface consists of the operations (methods) provided by each class.</p>
<p>Each operation can have input parameters, output parameters, and (if it is a function) a return value.</p>
<p>The operations of a class can be determined typically from the dynamic model</p>
<p>Interaction message: operations being invoked at the destination object receiving the message</p>
<p>Message passing between passive objects consists of an operation in ", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Designing Class Interface & OperationsDesigning Class Opera", ContentHtml = "<p>Designing Class Interface & OperationsDesigning Class Operations from the Interaction Model</p>
<p>(a) Analysis model: communication diagram.</p>
<p>(b) Design model: communication diagram.</p>
<p>(c) Design model: class diagram</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Designing Information Hiding Classes...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Designing Information Hiding Classes", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Graphical User Interaction Classes...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Graphical User Interaction Classes", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Detailed Design of Information Hiding Classes?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Data Abstraction Classes",
                        Description = "Data Abstraction Classes",
                        OrderIndex = 2,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Data Abstraction Classes", ContentHtml = "<p>Data Abstraction Classes</p>
<p>Used to encapsulate the data structure</p>
<p>Hiding the internal details of how the data structure is represented</p>
<p>The operations are designed as access procedures or functions whose internals, which deﬁne how the data structure is manipulated, are also hidden.</p>
<p>Each entity class in the analysis model that encapsulates data is designed as a data abstraction class.</p>
<p>An entity class stores some data and provides operations to access the data an", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Data Abstraction Classes", ContentHtml = "<p>Data Abstraction Classes</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "State-Machine Classes", ContentHtml = "<p>State-Machine Classes</p>
<p>During class design, the state-machine class determined in the analysis model is designed.</p>
<p>The statechart executed by the state-machine object is encapsulated in a state transition table. Thus, the state-machine class hides the contents of the state transition table and maintains the current state of the object</p>
<p>State-machine classes provide the operations that access the state</p>
<p>transition table & change</p>
<p>the state of the object.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Graphical User Interaction Classes", ContentHtml = "<p>Graphical User Interaction Classes</p>
<p>A graphical user interaction (GUI) class hides from other classes the details of the interface to the user.</p>
<p>In a given application, the user interface might be a simple command line interface or a sophisticated GUI</p>
<p>A command line interface is typically handled by one user interaction class.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Business Logic Classes", ContentHtml = "<p>Business Logic Classes</p>
<p>A business logic class defines the decision-making, business-specific application logic for processing a client’s request.  The goal is to encapsulate business rules that could change independently of each other into separate business logic classes.</p>
<p>Usually a business logic object accesses various entity objects during its execution.</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Inheritance in Design", ContentHtml = "<p>Inheritance in Design</p>
<p>Inheritance can be used when designing two similar, but not identical, classes (share many, but not all, characteristics).</p>
<p>Inheritance can also be used when adapting a design for either maintenance or reuse purposes.</p>
<p>Class Hierarchies</p>
<p>Class hierarchies (also referred to as generalization/specialization hierarchies and inheritance hierarchies) can be developed either top-down, bottom-up, or by some combination of the two approaches.</p>
<p>When", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Inheritance in DesignAbstract Classes", ContentHtml = "<p>Inheritance in DesignAbstract Classes</p>
<p>An abstract class is a class with no instances, used as a template to create subclasses</p>
<p>An abstract operation is an operation that is declared in an abstract class but not implemented.</p>
<p>In reality, some of the operations may be implemented in the abstract class, especially in</p>
<p>cases in which some or all</p>
<p>of the subclasses need to</p>
<p>use the same</p>
<p>implementation.</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Used to encapsulate the data structure?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Hiding the internal details of how the data structure is represented...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Hiding the internal details of how the data structure is rep", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The operations are designed as access procedures or functions whose internals, which deﬁne how the d?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Each entity class in the analysis model that encapsulates data is designed as a ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Each entity class in the analysis model that encapsulates da", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, An entity class stores some data and provides operations to access the data and to read or write to ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Class Interface Specifications",
                        Description = "Class Interface Specifications",
                        OrderIndex = 3,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Class Interface Specifications", ContentHtml = "<p>Class Interface Specifications</p>
<p>A class interface specification defines the interface of the information hiding class, including the specification of the operations provided by the class. It defines the following:</p>
<p>Information hidden by information hiding class: for example, data structure(s) encapsulated, in the case of a data abstraction class.</p>
<p>Class structuring criteria used to design this class.</p>
<p>Assumptions made in specifying the class: for example, whether one o", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Class Interface SpecificationsExample of Class Interface Sp", ContentHtml = "<p>Class Interface SpecificationsExample of Class Interface Speciﬁcation 1/2</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Class Interface SpecificationsExample of Class Interface Sp", ContentHtml = "<p>Class Interface SpecificationsExample of Class Interface Speciﬁcation 2/2</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Detailed Design of Information Hiding Classes", ContentHtml = "<p>Detailed Design of Information Hiding Classes</p>
<p>During detailed design of the information hiding classes, the internal algorithmic design of each operation is determined. The operation internals are documented in pseudocode.</p>
<p>Detailed Design of the Account</p>
<p>Abstract Superclass</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Detailed Design of", ContentHtml = "<p>Detailed Design of</p>
<p>Checking Account</p>
<p>Subclass</p>
<p>Detailed Design of Information Hiding Classes</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Detailed Design of", ContentHtml = "<p>Detailed Design of</p>
<p>Savings Account</p>
<p>Subclass 1/2</p>
<p>Detailed Design of Information Hiding Classes</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Detailed Design of", ContentHtml = "<p>Detailed Design of</p>
<p>Savings Account</p>
<p>Subclass 2/2</p>
<p>Detailed Design of Information Hiding Classes</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, A class interface specification defines the interface of the information hiding class, including the?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Information hidden by information hiding class: for example, data structure(s) e...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Information hidden by information hiding class: for example", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Class structuring criteria used to design this class.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Assumptions made in specifying the class: for example, whether one operation nee...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Assumptions made in specifying the class: for example", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Anticipated changes. This is to encourage consideration of design for change.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Polymorphism and Dynamic Binding",
                        Description = "Polymorphism and Dynamic Binding",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Polymorphism and Dynamic Binding", ContentHtml = "<p>Polymorphism and Dynamic Binding</p>
<p>Polymorphism is Greek for “many forms”. In object-oriented design, polymorphism is used to mean that different classes may have the same operation name. The specification of the operation is identical for each class; however, classes can implement the operation differently.</p>
<p>Dynamic binding is used in conjunction with polymorphism.</p>
<p>Dynamic binding means that the association of a request to an object’s operation is done at run-time and can t", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Polymorphism and Dynamic Binding", ContentHtml = "<p>Polymorphism and Dynamic Binding</p>
<p>Example of Polymorphism and Dynamic Binding</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Polymorphism is Greek for “many forms”. In object-oriented design, polymorphism ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Polymorphism is Greek for “many forms”. In object-oriented design", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Dynamic binding is used in conjunction with polymorphism.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Dynamic binding means that the association of a request to an object’s operation...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Dynamic binding means that the association of a request to a", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 15 Designing Client Server Software Architectures",
                Subtitle = "Client/server design with distributed subsystems and message communication",
                Description = "Ch15 - Designing Client Server Software Architectures. Multiple Client/Single Service Architectural Pattern. Multiple Client/Multiple Service Architectural Pattern",
                ColorHex = "#F59E0B",
                IconName = "bi-hdd-network",
                Level = CourseLevel.Advanced,
                OrderIndex = 13,
                SlideFileName = "Ch15_Designing Client Server Software Architectures.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Multiple Client/Single Service Architectural Pattern",
                        OrderIndex = 1,
                        EstimatedMinutes = 70,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch15 - Designing Client Server Software Architectures", ContentHtml = "<p>Ch15 - Designing Client Server Software Architectures</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Overview</p>
<p>Multiple Client/Single Service Architectural Pattern</p>
<p>Multiple Client/Multiple Service Architectural Pattern</p>
<p>Architectural Communication Patterns for Client/Server Architectures</p>
<p>Middleware in Client/Server Systems</p>
<p>Design of Service Subsystems</p>
<p>Design of Wrapper Classes</p>
<p>From Static Models to Relational Database Design</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Overview", ContentHtml = "<p>Overview</p>
<p>In client/server systems</p>
<p>a client is a requester of services</p>
<p>a server is a provider</p>
<p>of services</p>
<p>Typical servers are</p>
<p>file servers,</p>
<p>database servers,</p>
<p>line printer servers</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Multiple Client/Single Service Architectural Pattern 1/3", ContentHtml = "<p>Multiple Client/Single Service Architectural Pattern 1/3</p>
<p>Multiple Client/Single Service architectural pattern</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Multiple Client/Single Service Architectural Pattern 2/3", ContentHtml = "<p>Multiple Client/Single Service Architectural Pattern 2/3</p>
<p>Example of Multiple Client/Single Service architectural pattern: Banking System</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Multiple Client/Single Service Architectural Pattern 3/3", ContentHtml = "<p>Multiple Client/Single Service Architectural Pattern 3/3</p>
<p>Consists of several clients that request a service & a service that fulfills client requests</p>
<p>The simplest and most common client/server architecture has one service and many clients.</p>
<p>Multiple Client/Single Service architectural pattern is also known as the Client/Server or Client/Service pattern</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Multiple Client/Multiple Service Architectural Pattern 1/3", ContentHtml = "<p>Multiple Client/Multiple Service Architectural Pattern 1/3</p>
<p>More complex client/server systems might support multiple services</p>
<p>In addition to clients requesting a service, a client might communicate with several services, and services might communicate with each other.</p>
<p>A client could communicate with each service sequentially or could communicate with multiple services concurrently.</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Multiple Client/Multiple Service Architectural Pattern 2/3", ContentHtml = "<p>Multiple Client/Multiple Service Architectural Pattern 2/3</p>
<p>Multiple Client/Multiple Service architectural pattern</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Multi-tier Client/Service Architectural Pattern", ContentHtml = "<p>Multi-tier Client/Service Architectural Pattern</p>
<p>The Multi-tier Client/Service pattern has an intermediate tier (i.e., layer) that provides both a client and a service role.</p>
<p>An intermediate tier is a client of its service tier and also provides a service for its clients.</p>
<p>It is possible to have more than one intermediate tier. When viewed as a layered architecture, the client is considered to be at a higher layer than the service because the client depends on and uses the ", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "Architectural Communication Patterns for Client/Server Archi", ContentHtml = "<p>Architectural Communication Patterns for Client/Server Architectures 1/3</p>
<p>In client/server communication, there is usually a request from a client to a service, and a response from the service.</p>
<p>In some cases, there might not be a service response, for example, when data are being updated instead of requested.</p>
<p>The nature of the communication between the client and service affects the communication patterns used.</p>", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "Architectural Communication Patterns for Client/Server Archi", ContentHtml = "<p>Architectural Communication Patterns for Client/Server Architectures 2/3</p>
<p>Synchronous Message Communication with Reply Pattern</p>
<p>Examples of the Synchronous Message Communication with Reply pattern: Banking application</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "Architectural Communication Patterns for Client/Server Archi", ContentHtml = "<p>Architectural Communication Patterns for Client/Server Architectures 3/3</p>
<p>Asynchronous Message Communication with Callback Pattern</p>
<p>Used between a client and a service when the client sends a request to the service and can continue executing without needing to wait for the service response; however, it does need the service response later.</p>
<p>The callback is an asynchronous response to a client request message sent previously. This pattern allows the client to execute asynchro", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "Middleware in Client/Server Systems", ContentHtml = "<p>Middleware in Client/Server Systems</p>
<p>Middleware is a layer of software that sits above the heterogeneous operating system to provide a uniform platform above which distributed applications, such as client/server systems, can run</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "Design of Service Subsystems", ContentHtml = "<p>Design of Service Subsystems</p>
<p>A service subsystem provides a service for multiple clients</p>
<p>It is very common for services to need access to a database in which persistent data are stored</p>
<p>A simple service does not initiate any requests for services but responds to requests from clients.</p>
<p>There are two kinds of service components: sequential and concurrent.</p>", OrderIndex = 14, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Multiple Client/Multiple Service Architectural Pattern...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Multiple Client/Multiple Service Architectural Pattern", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Architectural Communication Patterns for Client/Server Architectures?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Middleware in Client/Server Systems...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Middleware in Client/Server Systems", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, From Static Models to Relational Database Design?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Design of Service SubsystemsSequential Service Design 1/2",
                        Description = "Design of Service SubsystemsSequential Service Design 1/2",
                        OrderIndex = 2,
                        EstimatedMinutes = 70,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Design of Service SubsystemsSequential Service Design 1/2", ContentHtml = "<p>Design of Service SubsystemsSequential Service Design 1/2</p>
<p>A sequential service is designed as one concurrent object (thread of control) that processes client requests sequentially; that is, it completes one request before it starts servicing the next.</p>
<p>The service typically has a message queue of incoming service requests.</p>
<p>There is one message type for each operation provided by the service.</p>
<p>The service coordinator unpacks the client’s message and, depending on the", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Design of Service SubsystemsSequential Service Design 2/2", ContentHtml = "<p>Design of Service SubsystemsSequential Service Design 2/2</p>
<p>Banking Service services the transaction, invokes the service operation, returns a bankResponse message to the client, and then services the next transaction</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Design of Service SubsystemsConcurrent Service Design 1/2", ContentHtml = "<p>Design of Service SubsystemsConcurrent Service Design 1/2</p>
<p>The service functionality is shared among several concurrent objects. If the client demand for services is high enough that the sequential service could potentially become a bottleneck in the system, an alternative approach is for the services to be provided by a concurrent service consisting of several concurrent objects.</p>
<p>This approach assumes that improved throughput can be obtained by objects providing concurrent acce", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Design of Service SubsystemsConcurrent Service Design 2/2", ContentHtml = "<p>Design of Service SubsystemsConcurrent Service Design 2/2</p>
<p>The Bank Transaction Coordinator and each transaction manager is designed as a separate concurrent object</p>
<p>The clients communicate with the service by using the Asynchronous Message Communication with Callback pattern</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Design of Wrapper Classes", ContentHtml = "<p>Design of Wrapper Classes</p>
<p>In the analysis model, an entity class is designed that encapsulates data.</p>
<p>During design, a decision has to be made whether the encapsulated data are to be managed directly by the entity class or whether the data are actually to be stored in a database.</p>
<p>The former case is handled by data abstraction classes, which encapsulate data structures</p>
<p>The latter case is handled by database wrapper classes, which hide how the data are accessed if sto", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Design of Wrapper ClassesDatabase Wrapper Classes 1/2", ContentHtml = "<p>Design of Wrapper ClassesDatabase Wrapper Classes 1/2</p>
<p>Data abstraction classes are more likely to be designed on the client side, but they might also be needed on the server side.</p>
<p>Database wrapper classes are much more likely to be designed on the server side, because that is where the database support is provided</p>
<p>Most databases in use today are relational databases, so the database wrapper class provides an object-oriented interface to the database</p>
<p>The attributes", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Design of Wrapper ClassesDatabase Wrapper Classes 2/2", ContentHtml = "<p>Design of Wrapper ClassesDatabase Wrapper Classes 2/2</p>
<p>In the Banking System example, all persistent data are stored in a relational database. Hence, each entity class maintained at the bank server is mapped to both a database relational table and a database wrapper class</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational database design (RDD) models information and data into a set of tables with rows and columns. Each row of a relation/table represents a record, and each column represents an attribute of data. The Structured Query Language (SQL) is used to manipulate relational databases</p>
<p>Steps in Using COMET/UML</p>
<p>Develop Software Requirements Model</p>
<p>Develop Software Analysis Mode</p>
<p>Design Overall Software Architecture (", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational Database Design</p>
<p>1. Objective: Map static model to relational database</p>
<p>2. Each entity class from static model that needs to be stored in relational database:</p>
<p>Entity class maps to one (or more) relation(s) (table)</p>
<p>Attributes mapped to columns of table</p>
<p>Each object instance maps to a row of table</p>
<p>3. Relational Database Design:</p>
<p>Primary keys</p>
<p>Foreign keys for associations</p>
<p", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Entity Classes and Relational Tables</p>
<p>Account entity class</p>
<p>Account relational table</p>", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Primary Keys</p>
<p>1. Each relation must have a primary key</p>
<p>2. Primary Key:</p>
<p>Combination of one or more attributes</p>
<p>Uniquely locates a row in relation</p>
<p>E.g., Account Number is primary key of Account relation</p>
<p>Account (Account number, Balance) – (underline = primary key)</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational Database Design Foreign Keys</p>
<p>1. Associations in relational databases:</p>
<p>Many-to-many association in static model</p>
<p>Maps to a relation</p>
<p>One-to-one and one-to-many associations</p>
<p>Use Foreign keys</p>
<p>2. Foreign key:</p>
<p>Primary key of one table that is embedded in another table</p>
<p>Represents mapping of association between relations into a table</p>
<p>Allows navigation between tables</p>", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>One-to-one or Zero-or-one Association 1/2</p>
<p>One-to-one association maps to:</p>
<p>Foreign key in one of relations</p>
<p>Zero-or-one association maps to:</p>
<p>Foreign key in optional relation</p>
<p>E.g., Customer Owns Debit Card</p>
<p>Static model:</p>
<p>Customer (Customer Name, Customer Id, Customer Address)</p>
<p>Debit Card (Card Id, PIN, Expiration date, Status, Limit, Total)</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>One-to-one or Zero-or-one Association 2/2</p>
<p>1. Relational Database Design:</p>
<p>Customer Id chosen as primary key of Customer</p>
<p>Customer (Customer Name, Customer Id, Customer Address)</p>
<p>Card id chosen as primary key of Debit Card relation</p>
<p>2. Customer Id chosen as foreign key in Debit Card</p>
<p>3. Represents association between Customer and Debit Card relations</p>
<p>4. Debit Card (Card Id, PIN, Expiration date,", OrderIndex = 14, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Design of Service SubsystemsSequential Service Design 1/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A sequential service is designed as one concurrent object (thread of control) th...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A sequential service is designed as one concurrent object (thread of control) that processes client requests sequentiall", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The service typically has a message queue of incoming service requests.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'There is one message type for each operation provided by the service....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "There is one message type for each operation provided by the", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The service coordinator unpacks the client’s message and, depending on the message type, invokes the?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "From Static Models to Relational Database Design",
                        Description = "From Static Models to Relational Database Design",
                        OrderIndex = 3,
                        EstimatedMinutes = 70,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>One-to-Many Association 1/2</p>
<p>One-to-many association maps to:</p>
<p>Foreign key in “many” relations</p>
<p>E.g., Customer Owns Account</p>
<p>Static model:</p>
<p>Customer (Customer Name, Customer Id, Customer Address)</p>
<p>Account (Account number, Balance)</p>
<p>Relational Database Design:</p>
<p>Primary key of “one” relation (Customer) is chosen as foreign key in “many” relation (Account)</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>One-to-Many Association 2/2</p>
<p>Relational Database Design:</p>
<p>Customer Id chosen as primary key of Customer relation</p>
<p>Customer (Customer Name, Customer Id, Customer Address)</p>
<p>Account Number is chosen as primary key of Account relation</p>
<p>Customer Id is foreign key in Account relation</p>
<p>Account (Account Number, Balance, Customer Id)</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Static Model Association Class 1/2</p>
<p>An association class models association between two or more classes  and is typically used to represent a many-to-many association</p>
<p>Association class is mapped to associative relation</p>
<p>Associative relation</p>
<p>Relation to represent association between two or more relations</p>
<p>Primary key of associative relation</p>
<p>Concatenated key</p>
<p>Formed from primary key of each rela", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Static Model Association Class 2/2</p>
<p>E.g., Hours association class:</p>
<p>Represents association between Project and Employee classes</p>
<p>Mapped to Associative relation Hours</p>
<p>Static model:</p>
<p>Project (Project id, Project name)</p>
<p>Employee (Employee id, Employee name, Employee address)</p>
<p>Hours (Hours Worked)</p>
<p>Hours Worked is attribute of association</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational Database Design Associative Relation</p>
<p>Relational Database Design</p>
<p>Project (Project id, Project name)</p>
<p>Employee (Employee id, Employee name, Employee address)</p>
<p>Project id and Employee id</p>
<p>Form concatenated primary key of Hours relation</p>
<p>Also foreign keys</p>
<p>Hours (Project id, Employee id, Hours worked)</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Static Model Aggregation/Composition Hierarchy</p>
<p>Whole/part relationship</p>
<p>Aggregate/Composite (whole) class is mapped to relation</p>
<p>Each part class is mapped to relation</p>
<p>Primary key of aggregate/composite relation</p>
<p>All of primary key of component relation</p>
<p>1-1 aggregation</p>
<p>Part of primary key of component relation</p>
<p>1-n aggregation</p>
<p>Foreign key</p>
<p>If not needed to uniquely identify ", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational Database Design Aggregation / Composition Hierarchy</p>
<p>E.g., Static Model:</p>
<p>Department IS PART OF College</p>
<p>Admin Office IS PART OF College</p>
<p>College (College name)</p>
<p>Admin Office (Location)</p>
<p>Department (Department name,</p>
<p>Location)</p>
<p>Relational Database Design:</p>
<p>Primary key of aggregate relation = College name</p>
<p>College (College name)</p>
<p>Admin Office (College name, Locat", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Static Model Generalization / Specialization Hierarchy</p>
<p>Three alternative mappings from Generalization / Specialization Hierarchy to relational database</p>
<p>Superclass & subclasses mapped to relations</p>
<p>Subclasses only mapped to relations</p>
<p>Superclass only mapped to relation</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational Database Design Generalization / Specialization Hierarchy 1/4</p>
<p>Superclass & subclasses mapped to relations</p>
<p>Superclass mapped to table</p>
<p>Discriminator is attribute of superclass table</p>
<p>Each subclass mapped to table</p>
<p>Shared id for primary key</p>
<p>Same primary key in superclass and subclass tables</p>
<p>Clean and extensible</p>
<p>However, superclass / subclass navigation may be slow</p>", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational Database Design Generalization / Specialization Hierarchy 2/4</p>
<p>Superclass & subclasses mapped to relations</p>
<p>E.g.: Account Generalization / Specialization Hierarchy</p>
<p>Static Model</p>
<p>Superclass: Account (Account number, Balance)</p>
<p>Subclass: Checking Account (Last Deposit Amount)</p>
<p>Subclass: Savings Account (Interest)</p>
<p>Relational Database Design</p>
<p>Account (Account number, Account Type, B", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational Database Design Generalization / Specialization Hierarchy 3/4</p>
<p>1. Superclass only mapped to relations</p>
<p>Map each subclass to relation</p>
<p>No superclass relation</p>
<p>Superclass attributes replicated for each subclass table</p>
<p>2. Can use if</p>
<p>Subclass has many attributes</p>
<p>Superclass has few attributes</p>
<p>Application knows what subclass to search</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Relational Database Design Generalization / Specialization Hierarchy 4/4</p>
<p>1. Superclass only mapped to relations</p>
<p>2. All subclass attributes brought up to superclass table</p>
<p>Discriminator is attribute of superclass table</p>
<p>Each record in superclass table uses attributes relevant to one subclass</p>
<p>Other attribute values are null</p>
<p>3. Can use if</p>
<p>Superclass has many attributes</p>
<p>Subclass has few a", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Example of Relational Database Design 1/2</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "From Static Models to Relational Database Design", ContentHtml = "<p>From Static Models to Relational Database Design</p>
<p>Example of Relational Database Design 2/2</p>
<p>Banking System static mode</p>
<p>Bank Information (underline = primary key, italic = foreign key):</p>
<p>Bank (bankName, Bank Address, bankId)</p>
<p>ATM Info (bankId, ATMId, ATM Location, ATM Address)</p>
<p>Customer (customerName, customerId, customerAddress)</p>
<p>Debit Card (cardId, PIN, startDate, expirationDate, status, limit, total, customerId)</p>
<p>Checking Account (accountNum", OrderIndex = 14, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, From Static Models to Relational Database Design?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'One-to-many association maps to:...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "One-to-many association maps to:", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Customer (Customer Name, Customer Id, Customer Address)...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Customer (Customer Name", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 16 Designing Service-Oriented Architectures",
                Subtitle = "SOA concepts, service design, orchestration, and choreography",
                Description = "Ch16 - Designing Service-Oriented Architectures. Software Architectural Broker Patterns. Software Architectural Transaction Patterns",
                ColorHex = "#10B981",
                IconName = "bi-cloud",
                Level = CourseLevel.Advanced,
                OrderIndex = 14,
                SlideFileName = "Ch16_Designing Service-Oriented Architectures.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Design Principles for Services",
                        OrderIndex = 1,
                        EstimatedMinutes = 45,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch16 - Designing Service-Oriented Architectures", ContentHtml = "<p>Ch16 - Designing Service-Oriented Architectures</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Overview</p>
<p>Design Principles for Services</p>
<p>Software Architectural Broker Patterns</p>
<p>Technology Support for SOA</p>
<p>Software Architectural Transaction Patterns</p>
<p>Negotiation Pattern</p>
<p>Service interface design in SOA</p>
<p>Service Coordination in SOA</p>
<p>Designing SOAs</p>
<p>Service Reuse</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Overview", ContentHtml = "<p>Overview</p>
<p>A service-oriented architecture (SOA) is a distributed software architecture that consists of multiple autonomous services.</p>
<p>The services are distributed such that they can execute on different nodes with different service providers.</p>
<p>With a SOA, the goal is to develop software applications that are composed of distributed services, such that individual services can execute on different platforms and be implemented in different languages.</p>
<p>Standard protocols ", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Design Principles for Services", ContentHtml = "<p>Design Principles for Services</p>
<p>Services need to be designed according to certain key principles. Many of these concepts are good software engineering and design principles, which have been incorporated into SOA design.</p>
<p>Loose coupling. Services should be relatively independent of each other.</p>
<p>Service contract. A service provides a contract, which a SOA application can rely on.</p>
<p>Autonomy. Each service is self-contained, such that it can operate independently without th", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Broker Patterns", ContentHtml = "<p>Software Architectural Broker Patterns</p>
<p>In a SOA, object brokers act as intermediaries between clients and services. The broker frees clients from having to maintain information about where a particular service is provided and how to obtain that service. Sophisticated brokers provide white pages (naming services) and yellow pages (trader services) so that clients can locate services more easily.</p>
<p>In the Broker pattern (which is also known as the Object Broker or Object Request Bro", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Broker PatternsService Registration ", ContentHtml = "<p>Software Architectural Broker PatternsService Registration Pattern</p>
<p>In the Service Registration pattern, the service needs to register service information with the broker, including the service name, a description of the service, and the location at which the service is provided.</p>
<p>Service registration is carried out the first time the service joins the brokering exchange (analogous to the stock exchange). On subsequent occasions, if the service relocates, it needs to re-register ", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Broker PatternsBroker Forwarding Pat", ContentHtml = "<p>Software Architectural Broker PatternsBroker Forwarding Pattern</p>
<p>There is more than one way for a broker to handle a client request. With the Broker Forwarding pattern, a client sends a message identifying the service required – for example, to withdraw cash from a given bank. The broker receives the client request, determines the location of the service (the ID of the node the service resides on), and forwards the message to the service at the specific location.</p>
<p>a) Service regi", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Broker PatternsBroker Handle Pattern", ContentHtml = "<p>Software Architectural Broker PatternsBroker Handle Pattern</p>
<p>The Broker Handle pattern keeps the benefit of location transparency while adding the advantage of reducing message traffic. Instead of forwarding each client message to the service, the broker returns a service handle to the client, which is then used for direct communication between client and service.</p>
<p>This pattern is particularly useful when the client & service are likely to have a dialog and exchange several messa", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Broker PatternsService Discovery Pat", ContentHtml = "<p>Software Architectural Broker PatternsService Discovery Pattern</p>
<p>The brokered patterns of communication described in the preceding sections, in which the client knows the service required but not the location, are referred to as white page brokering. A different brokering pattern is yellow page brokering, analogous to the yellow pages of the telephone directory, in which the client knows the type of service required but not the specific service.</p>
<p>a) Service Discovery (yellow page", OrderIndex = 9, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Software Architectural Transaction Patterns...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Software Architectural Transaction Patterns", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A service-oriented architecture (SOA) is a distributed software architecture tha...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A service-oriented architecture (SOA) is a distributed softw", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The services are distributed such that they can execute on different nodes with different service pr?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Technology Support for SOAWeb Service Protocols",
                        Description = "Technology Support for SOAWeb Service Protocols",
                        OrderIndex = 2,
                        EstimatedMinutes = 45,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Technology Support for SOAWeb Service Protocols", ContentHtml = "<p>Technology Support for SOAWeb Service Protocols</p>
<p>Application clients and services need to have a communication protocol for intercomponent communication. Extensible Markup Language (XML) is a technology that allows different systems to interoperate through exchange of data and text.</p>
<p>The Simple Object Access Protocol (SOAP), which is a lightweight protocol developed by the World Wide Web Consortium (W3C), builds on XML and HTTP to permit exchange of information in a distributed e", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Technology Support for SOAWeb Services", ContentHtml = "<p>Technology Support for SOAWeb Services</p>
<p>Applications provide services for clients. One example of application services is Web services, which use the World Wide Web for application-to-application communication.</p>
<p>From a software perspective, Web services are the application programming interfaces (APIs) that provide a standard means of communication among different software applications on the World Wide Web. From a business application perspective, a Web service is business funct", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Technology Support for SOARegistration Services", ContentHtml = "<p>Technology Support for SOARegistration Services</p>
<p>A registration service is provided for services to make their services available to clients. Services register their services with a registration service – a process referred to as publishing or registering the service. Most brokers, such as CORBA and Web service brokers, provide a registration service.</p>
<p>For Web services, a service registry is provided to allow services to be published and located via the World Wide Web.</p>
<p>Web", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Technology Support for SOABrokering and Discovery Services", ContentHtml = "<p>Technology Support for SOABrokering and Discovery Services</p>
<p>In a distributed environment, an object broker is an intermediary in interactions between clients and services.</p>
<p>An example of brokering technology is a Web services broker. Information about a Web service can be defined by the Universal Description, Discovery, and Integration (UDDI) framework for Web services integration. A UDDI specification consists of several related documents and an XML schema that defines a SOAP-ba", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Transaction Patterns", ContentHtml = "<p>Software Architectural Transaction Patterns</p>
<p>A transaction is a request from a client to a service that consists of two or more operations that perform a single logical function and that must be completed in its entirety or not at all. Transactions are generated at the client and sent to the service for processing.</p>
<p>Transactions are typically used for updates to a distributed database that needs to be atomic – for example, transferring funds from an account at one bank to an acco", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Transaction PatternsTwo-Phase Commit", ContentHtml = "<p>Software Architectural Transaction PatternsTwo-Phase Commit Protocol Pattern</p>
<p>The Two-Phase Commit Protocol pattern addresses the problem of managing atomic transactions in distributed systems. Consider two examples of banking transactions:</p>
<p>Transfer transaction. Consider a transfer transaction between two accounts – for example, from a savings account to a checking account – in which the accounts are maintained at two separate banks (services). In this case, it is necessary to d", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Transaction PatternsCompound Transac", ContentHtml = "<p>Software Architectural Transaction PatternsCompound Transaction Pattern</p>
<p>The Compound Transaction pattern can be used when the client’s transaction requirement can be</p>
<p>broken down into smaller</p>
<p>flat atomic transactions,</p>
<p>in which each atomic transaction can be performed separately and rolled back separately.</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Software Architectural Transaction PatternsLong-Living Tran", ContentHtml = "<p>Software Architectural Transaction PatternsLong-Living Transaction Pattern</p>
<p>A long-living transaction is a transaction that has a human in the loop and that could take a long and possibly indefinite time to execute, because individual human behavior is unpredictable.</p>
<p>With transactions involving human interaction, it is undesirable to keep records locked for a relatively long time while the human is considering various options.</p>
<p>Long-Living Transaction pattern, which splits", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Negotiation Pattern", ContentHtml = "<p>Negotiation Pattern</p>
<p>In the Negotiation pattern (also known as the Agent-Based Negotiation or Multi-Agent Negotiation pattern), a client agent acts on behalf of the user and makes a proposal to a service agent.</p>
<p>The service agent attempts to satisfy the client’s proposal, which might involve communication with other services. Having determined the available options, the service agent then offers the client agent one or more options that come closest to matching the original client", OrderIndex = 9, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Technology Support for SOAWeb Service Protocols?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Application clients and services need to have a communication protocol for inter...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Application clients and services need to have a communicatio", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The Simple Object Access Protocol (SOAP), which is a lightweight protocol developed by the World Wid?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'SOAP defines a unified approach for sending XML-encoded data and consists of thr...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "SOAP defines a unified approach for sending XML-encoded data and consists of three parts: an envelope that defines a fra", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Technology Support for SOAWeb Services?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Negotiation PatternExample 1",
                        Description = "Negotiation PatternExample 1",
                        OrderIndex = 3,
                        EstimatedMinutes = 45,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Negotiation PatternExample 1", ContentHtml = "<p>Negotiation PatternExample 1</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Negotiation PatternClient & Service Agents", ContentHtml = "<p>Negotiation PatternClient & Service Agents</p>
<p>The client agent, who acts on behalf of the client, may do any of the following:</p>
<p>Propose a service. The client agent proposes a service to the service agent. This proposed service is negotiable, meaning that the client agent is willing to consider counteroffers.</p>
<p>Request a service. The client agent requests a service from the service agent. This requested service is nonnegotiable, meaning that the client agent is not willing to c", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Negotiation PatternExample 2", ContentHtml = "<p>Negotiation PatternExample 2</p>
<p>Consider the following example involving negotiation between a client agent and a software travel agent that follows a scenario similar to that between a human client and a human travel agent. This example used the Negotiation pattern and the Long Living Transaction pattern.</p>
<p>In this travel agency example, the client agent discovers an appropriate service travel agent – for our purposes, the world Wide Travel Agent – via the object broker’s yellow pa", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Negotiation PatternExample 2", ContentHtml = "<p>Negotiation PatternExample 2</p>
<p>The client agent then initiates the negotiation on behalf of a user who wishes to take an airplane trip from Washington, D.C., to London, departing on October 14 and returning on October 21, for a price of less than $700. The negotiation process is depicted on below communication diagram</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Service interface design in SOA", ContentHtml = "<p>Service interface design in SOA</p>
<p>The operations of each service are determined by analyzing the message requests made to each service.</p>
<p>Communication diagram for the Process Delivery Order use case</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Service interface design in SOA", ContentHtml = "<p>Service interface design in SOA</p>
<p>Partial communication diagram for the Confirm Shipment and Bill Customer use case</p>
<p>Service interface for Inventory Service</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Service Coordination in SOA 1/2", ContentHtml = "<p>Service Coordination in SOA 1/2</p>
<p>In SOA applications that involve multiple services, coordination of these services is usually required. To ensure loose coupling among the services, it is often better to separate the details of the coordination from the functionality of the individual services. In any complex activity involving multiple services, coordination is usually needed to sequence the access to the individual services.</p>
<p>In SOA, different types of coordination are provided,", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Service Coordination in SOA 2/2", ContentHtml = "<p>Service Coordination in SOA 2/2</p>
<p>An example of a coordinator object, the Supplier Coordinator object coordinates the interactions of the Supplier Interaction object with the Delivery Order Service and Inventory Service objects.</p>
<p>Supplier Coordinator receives supplier requests from Supplier Interaction via the provided interface called ISupplierCoordinator. Supplier Coordinator is a client of the Inventory Service and thus has a required interface IInventoryService, and a client of", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Designing SOAs 1/2", ContentHtml = "<p>Designing SOAs 1/2</p>
<p>After determining the service and coordinator interfaces as described in the previous two sections, the integrated communication diagram can be developed. For SOA, this diagram is both concurrent and distributed.</p>
<p>The concurrent communication diagrams show the dynamic message sequencing in which the services participate, and the interaction between services and coordinator components and user interaction components.</p>", OrderIndex = 9, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Negotiation PatternClient & Service Agents?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The client agent, who acts on behalf of the client, may do any of the following:...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The client agent", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Propose a service. The client agent proposes a service to the service agent. This proposed service i?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Request a service. The client agent requests a service from the service agent. T...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Request a service. The client agent requests a service from the service agent. This requested service is nonnegotiable", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Reject a service offer. The client agent rejects an offer made by the service agent.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Designing SOAs 2/2",
                        Description = "Concurrent communication diagram for the Online Shopping System",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Designing SOAs 2/2", ContentHtml = "<p>Designing SOAs 2/2</p>
<p>Concurrent communication diagram for the Online Shopping System</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Service Reuse", ContentHtml = "<p>Service Reuse</p>
<p>Once services have been designed, they can be reused. Although a service could invoke an operation on a different service, this can make the service less reusable, because it is now dependent on another service.</p>
<p>To encourage software reuse, it is recommended that services only have provided interfaces and not have any required interfaces (unless asynchronous communication with callback is used). This makes the service more self-contained.</p>
<p>Each of the service", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Concurrent communication diagram for the Online Shopping System?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Once services have been designed, they can be reused. Although a service could i...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Once services have been designed", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, To encourage software reuse, it is recommended that services only have provided interfaces and not h?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Each of the services described could be used in different applications. In each ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Each of the services described could be used in different applications. In each case", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, In the online shopping system, two external services are reused, namely, the Credit Card Service and?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 17 Designing Component-Based Software Architectures",
                Subtitle = "Component-based development, component interfaces, and middleware",
                Description = "Ch17 - Designing Component-Based Software Architectures. Designing Distributed Component-Based Software Architectures. Composite Subsystems and Components",
                ColorHex = "#06B6D4",
                IconName = "bi-cpu",
                Level = CourseLevel.Advanced,
                OrderIndex = 15,
                SlideFileName = "Ch17_Designing Component-Based Software Architectures.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Designing Distributed Component-Based Software Architectures",
                        OrderIndex = 1,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch17 - Designing Component-Based Software Architectures", ContentHtml = "<p>Ch17 - Designing Component-Based Software Architectures</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Overview</p>
<p>Designing Distributed Component-Based Software Architectures</p>
<p>Composite Subsystems and Components</p>
<p>Modeling Components with UML</p>
<p>Component Structuring Criteria</p>
<p>Group Message Communication Patterns</p>
<p>Application Deployment</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Overview", ContentHtml = "<p>Overview</p>
<p>A given software application could be configured to have each component-based subsystem allocated to its own separate physical node, or, alternatively, to have all or some of its components allocated to the same physical node.</p>
<p>A component-based development approach helps achieve the goal of a distributed, highly configurable, message-based design.</p>
<p>A distributed component is a concurrent object with a well-defined interface.</p>
<p>A composite component is compose", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Designing Distributed Component-Based Software Architectures", ContentHtml = "<p>Designing Distributed Component-Based Software Architectures</p>
<p>A distributed application consists of distributed components that can be configured to execute on distributed physical nodes.</p>
<p>Design distributed software architecture: Structure the distributed application into constituent components that potentially could execute on separate nodes in a distributed environment.</p>
<p>Design constituent components: a simple component can execute on only one node, the internals of each ", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Composite Subsystems and Components", ContentHtml = "<p>Composite Subsystems and Components</p>
<p>A composite subsystem is a component that encapsulates the internal components (objects) it contains. The component is both a logical and a physical container, but it adds no further functionality; thus, a component’s functionality is provided entirely by the part components it contains.</p>
<p>Incoming messages to a component are passed through to the appropriate internal destination component, and outgoing messages from an internal component are pa", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Modeling Components with UMLDesign of Component Interfaces", ContentHtml = "<p>Modeling Components with UMLDesign of Component Interfaces</p>
<p>An interface specifies the externally visible operations of a class or component without revealing the internal structure (implementation) of the operations.</p>
<p>Although many components are designed with one interface, it is possible for a component to provide more than one interface. If different components use a component differently, it is possible to design a separate interface for each component that requires a differ", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Modeling Components with UMLProvided and Required Interface", ContentHtml = "<p>Modeling Components with UMLProvided and Required Interfaces 1/2</p>
<p>A provided interface specifies the operations that a component must fulfill.</p>
<p>A required interface describes the operations that other components provide for this component to operate properly in a particular environment.</p>
<p>In particular, if a component communicates with more than one component, it can use a different port for each component with which it communicates.</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Composite Subsystems and Components...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Composite Subsystems and Components", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A given software application could be configured to have each component-based su...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A given software application could be configured to have each component-based subsystem allocated to its own separate ph", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, A component-based development approach helps achieve the goal of a distributed, highly configurable,?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Modeling Components with UMLProvided and Required Interfaces 2/2",
                        Description = "Modeling Components with UMLProvided and Required Interfaces 2/2",
                        OrderIndex = 2,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Modeling Components with UMLProvided and Required Interface", ContentHtml = "<p>Modeling Components with UMLProvided and Required Interfaces 2/2</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Modeling Components with UMLConnectors & Interconnecting Co", ContentHtml = "<p>Modeling Components with UMLConnectors & Interconnecting Components</p>
<p>A connector joins the required port of one component to the provided port of another component.</p>
<p>The connected ports must be compatible with each other.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Modeling Components with UMLDesigning Composite Components", ContentHtml = "<p>Modeling Components with UMLDesigning Composite Components</p>
<p>A composite component is structured into part components, which are also depicted as UML structured classes.</p>
<p>A component with no internal components is referred to as a simple component.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Component Structuring CriteriaProximity to the Source of Ph", ContentHtml = "<p>Component Structuring CriteriaProximity to the Source of Physical Data</p>
<p>In a distributed environment, the sources of data might be physically distant from each other. Designing the component so that it is close to the source of physical data ensures fast access to the data, which is particularly important if data access rates are high.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Component Structuring CriteriaLocalized Autonomy", ContentHtml = "<p>Component Structuring CriteriaLocalized Autonomy</p>
<p>A distributed component often performs a specific site-related service, where the same service is performed at multiple sites. Each instance of the component resides on a separate node, thereby providing greater local autonomy.</p>
<p>An example of an autonomous local component is the Automated Guided Vehicle System component of the Factory Automation System</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Component Structuring CriteriaPerformance", ContentHtml = "<p>Component Structuring CriteriaPerformance</p>
<p>If a time-critical function is provided within a node, better and more-predictable component performance can often be achieved.</p>
<p>In a given distributed application, a real-time component can perform a time-critical service at a given node, with non– real-time or less time-critical services performed elsewhere.</p>
<p>An example of a component that satisfies this criterion is the Automated Guided Vehicle System component</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Component Structuring CriteriaSpecialized Hardware", ContentHtml = "<p>Component Structuring CriteriaSpecialized Hardware</p>
<p>A component might need to reside on a particular node because it supports special-purpose hardware, such as a vector processor, or because it has to interface to special-purpose peripherals, sensors, or actuators that are connected to a specific node</p>
<p>Instances of the Monitoring Sensor Component (Figure 17.4) interface to special-purpose sensors. Both the Arm Component and Motor Component (Figure 17.8) interface to special-purpo", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Modeling Components with UMLProvided and Required Interfaces 2/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Modeling Components with UMLConnectors & Interconnecting Components...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Modeling Components with UMLConnectors & Interconnecting Co", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, A connector joins the required port of one component to the provided port of another component.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The connected ports must be compatible with each other....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The connected ports must be compatible with each other.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Modeling Components with UMLDesigning Composite Components?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Component Structuring CriteriaI/O Component",
                        Description = "Component Structuring CriteriaI/O Component",
                        OrderIndex = 3,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Component Structuring CriteriaI/O Component", ContentHtml = "<p>Component Structuring CriteriaI/O Component</p>
<p>An I/O component can be designed to be relatively autonomous and in close proximity to the source of physical data.</p>
<p>In particular, “smart” devices are given greater local autonomy and consist of the hardware plus the software that interfaces to and controls the device.</p>
<p>I/O component is a general name given to components that interact with the external environment</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Group Message Comm. Patterns", ContentHtml = "<p>Group Message Comm. Patterns</p>
<p>The message communication patterns described so far have involved one source component and one destination component.</p>
<p>A desirable property in some distributed applications is group communication. This is a form of one-to-many message communication in which a sender sends one message to many recipients.</p>
<p>Two kinds of group message communication (sometimes referred to as groupcast communication) supported in distributed applications are broadcast", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Group Message Comm. PatternsBroadcast Message Communication", ContentHtml = "<p>Group Message Comm. PatternsBroadcast Message Communication Pattern</p>
<p>With the Broadcast (or Broadcast Communication) pattern, an unsolicited message is sent to all recipients, perhaps informing them of a pending shutdown. Each recipient must then decide whether it wishes to process the message or discard it.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Group Message Comm. PatternsSubs/Noti Message Communication", ContentHtml = "<p>Group Message Comm. PatternsSubs/Noti Message Communication Pattern</p>
<p>Multicast communication provides a more selective form of group communication, in which the same message is sent to all members of a group.</p>
<p>The Subscription/Notification pattern uses a form of multicast communication in which components subscribe to a group and receive messages destined for all members of the group.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Group Message Comm. PatternsConcurrent Service Design with ", ContentHtml = "<p>Group Message Comm. PatternsConcurrent Service Design with Subs/Noti 1/2</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Group Message Comm. PatternsConcurrent Service Design with ", ContentHtml = "<p>Group Message Comm. PatternsConcurrent Service Design with Subs/Noti 2/2</p>
<p>The concurrent communication diagram in Figure 17.11 shows three separate interactions: a simple query interaction, a news event subscription interaction, and a news event notification interaction.</p>
<p>In the query interaction (which does not involve a subscription), a client makes a request to News Service Coordinator, which in turn sends a news archive query to News Archive Service. The latter queries the Ne", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Application DeploymentApplication Deployment Issues 1/3", ContentHtml = "<p>Application DeploymentApplication Deployment Issues 1/3</p>
<p>Define instances of the component. For each component that can have multiple instances, it is necessary to define the instances desired.</p>
<p>Interconnect component instances. The application architecture defines how components communicate with one another.</p>
<p>Map the component instances to physical nodes. For example, two components could be deployed such that each one could run on a separate physical node. Alternatively, ", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'An I/O component can be designed to be relatively autonomous and in close proxim...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "An I/O component can be designed to be relatively autonomous", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, In particular, “smart” devices are given greater local autonomy and consist of the hardware plus the?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'I/O component is a general name given to components that interact with the exter...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "I/O component is a general name given to components that int", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The message communication patterns described so far have involved one source component and one desti?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Application DeploymentApplication Deployment Issues 2/3",
                        Description = "Application DeploymentApplication Deployment Issues 2/3",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Application DeploymentApplication Deployment Issues 2/3", ContentHtml = "<p>Application DeploymentApplication Deployment Issues 2/3</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Application DeploymentApplication Deployment Issues 3/3", ContentHtml = "<p>Application DeploymentApplication Deployment Issues 3/3</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Application DeploymentApplication Deployment Issues 2/3?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Application DeploymentApplication Deployment Issues 3/3...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Application DeploymentApplication Deployment Issues 3/3", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 18 Designing Concurrent and Real-Time Software Architectures",
                Subtitle = "Concurrent processing, real-time design, and performance analysis",
                Description = "Ch18 - Designing Concurrent and Real-TimeSoftware Architectures. Concurrent and real-time software architectures. Characteristics of real-time system",
                ColorHex = "#EF4444",
                IconName = "bi-speedometer",
                Level = CourseLevel.Advanced,
                OrderIndex = 16,
                SlideFileName = "Ch18_Designing Concurrent and Real-Time Software Architectures.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Concurrent and real-time software architectures",
                        OrderIndex = 1,
                        EstimatedMinutes = 55,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch18 - Designing Concurrent and Real-TimeSoftware Architect", ContentHtml = "<p>Ch18 - Designing Concurrent and Real-TimeSoftware Architectures</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Concurrent and real-time software architectures</p>
<p>Characteristics of real-time system</p>
<p>Control Patterns for Real-Time Software Architectures</p>
<p>Concurrent Task Structuring</p>
<p>In/Out Task Structuring Criteria</p>
<p>Internal Task Structuring Criteria</p>
<p>Developing the Concurrent Task Architecture</p>
<p>Task Communication and Synchronization</p>
<p>Task Interface and Task Behavior Specifications</p>
<p>Implementation of Concurrent Tasks in Java</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Concurrent and real-time software architectures", ContentHtml = "<p>Concurrent and real-time software architectures</p>
<p>An important activity in designing real-time software architectures is to design concurrent objects (concurrent tasks).</p>
<p>Real-time software architectures can also be distributed; for this reason they can be considered a special case of component-based software architectures. In this context, a task is equivalent to a simple component.</p>
<p>During concurrent software design, a concurrent software architecture is developed in which", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Characteristics of real-time system", ContentHtml = "<p>Characteristics of real-time system</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Characteristics of real-time system", ContentHtml = "<p>Characteristics of real-time system</p>
<p>Real-time systems are concurrent systems with timing constraints.</p>
<p>The term real-time system usually refers to the whole system, including the real-time application, real-time operating system, and the real-time In/Out subsystem, with special-purpose device drivers to interface to the various sensors and actuators.</p>
<p>Real-time systems are often complex because they have to deal with multiple independent streams of input events and produce ", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Control Patterns for Real-time Software Architectures 1/3", ContentHtml = "<p>Control Patterns for Real-time Software Architectures 1/3</p>
<p>In the Centralized Control architectural pattern, there is one control component, which conceptually executes a state chart and provides the overall control and sequencing of the system.</p>
<p>The control component receives events from other components with which it interacts. These include events from various input components and user interface components that interact with the external environment – for example, through senso", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Control Patterns for Real-time Software Architectures 2/3", ContentHtml = "<p>Control Patterns for Real-time Software Architectures 2/3</p>
<p>Distributed Control Architectural Pattern</p>
<p>Contains several control components. Each of these components controls a given part of the system by conceptually executing a state chart.</p>
<p>Control is distributed among the various control components, with no single component in overall control. To notify each other of important events, the control components communicate through peer-to-peer communication. They also interact", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Control Patterns for Real-time Software Architectures 3/3", ContentHtml = "<p>Control Patterns for Real-time Software Architectures 3/3</p>
<p>Hierarchical Control Architectural Pattern</p>
<p>The Hierarchical Control pattern (also known as the Multilevel Control pattern) contains several control components. Each component controls a given part of a system by conceptually executing a state machine.</p>
<p>The distributed controllers provide the low-level control, interactingwith sensor and actuator components, and respond to the Hierarchical Controller when they have ", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Concurrent Task Structuring", ContentHtml = "<p>Concurrent Task Structuring</p>
<p>A concurrent task is an active object, also referred to as a process or thread. The term concurrent task is used to refer to an active object with one thread of control.</p>
<p>The concurrent structure of a system is best understood by considering the dynamic aspects of the system. In the analysis model, the system is represented as a collection of collaborating objects that communicate by means of messages.</p>
<p>The objects in the analysis model are analy", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "In/Out Task Structuring CriteriaEvent Driven In/Out Tasks 1", ContentHtml = "<p>In/Out Task Structuring CriteriaEvent Driven In/Out Tasks 1/2</p>
<p>An event driven In/Out task is needed when there is an event driven (also referred to as interrupt driven) In/Out device to which the system has to interface.</p>
<p>An event driven In/Out task is constrained to execute at the speed of the In/Out device with which it is interacting.</p>
<p>Another kind of event driven In/Out task is the event driven proxy task, which interfaces to an external system instead of an In/Out dev", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "In/Out Task Structuring CriteriaEvent Driven In/Out Tasks 2", ContentHtml = "<p>In/Out Task Structuring CriteriaEvent Driven In/Out Tasks 2/2</p>
<p>a) Analysis model: communication diagram.</p>
<p>b) Design model: concurrent communication diagram</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Control Patterns for Real-Time Software Architectures...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Control Patterns for Real-Time Software Architectures", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Internal Task Structuring Criteria...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Internal Task Structuring Criteria", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "In/Out Task Structuring CriteriaPeriodic In/Out Tasks 1/2",
                        Description = "In/Out Task Structuring CriteriaPeriodic In/Out Tasks 1/2",
                        OrderIndex = 2,
                        EstimatedMinutes = 55,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "In/Out Task Structuring CriteriaPeriodic In/Out Tasks 1/2", ContentHtml = "<p>In/Out Task Structuring CriteriaPeriodic In/Out Tasks 1/2</p>
<p>Unlike an event driven In/Out task, which deals with an event driven In/Out device, a periodic In/Out task deals with a passive In/Out device, in which the device is polled on a regular basis. In this situation, the activation of the task is periodic but its function is In/Out-related.</p>
<p>Periodic In/Out tasks are often used for simple In/Out devices that, unlike event driven In/Out devices, do not generate interrupts when ", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "In/Out Task Structuring CriteriaPeriodic In/Out Tasks 2/2", ContentHtml = "<p>In/Out Task Structuring CriteriaPeriodic In/Out Tasks 2/2</p>
<p>a) Analysis model: communication diagram.</p>
<p>b) Design model: concurrent communication diagram</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "In/Out Task Structuring CriteriaDemand Driven In/Out Tasks ", ContentHtml = "<p>In/Out Task Structuring CriteriaDemand Driven In/Out Tasks 1/2</p>
<p>Demand driven In/Out tasks (referred to as passive In/Out task) are used when dealing with passive In/Out devices that do not need to be polled and, hence, do not need periodic In/Out tasks. In particular, they are used when it is considered desirable to overlap computation with In/Out. A demand driven In/Out task is used in such a situation to interface to the passive In/Out device.</p>
<p>Demand driven In/Out tasks are u", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "In/Out Task Structuring CriteriaDemand Driven In/Out Tasks ", ContentHtml = "<p>In/Out Task Structuring CriteriaDemand Driven In/Out Tasks 2/2</p>
<p>a) Analysis model: communication diagram.</p>
<p>b) Design model: concurrent communication diagram</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Internal Task Structuring CriteriaPeriodic Tasks", ContentHtml = "<p>Internal Task Structuring CriteriaPeriodic Tasks</p>
<p>Many real-time and concurrent systems have activities that need to be executed on a periodic basis – for example, computing the distance traveled by the car or the current speed of the car. These periodic activities are typically handled by periodic tasks.</p>
<p>Although periodic In/Out activities are structured as periodic In/Out tasks, periodic internal activities are structured as periodic tasks. Internal periodic tasks include peri", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Internal Task Structuring CriteriaDemand Driven Tasks 1/2", ContentHtml = "<p>Internal Task Structuring CriteriaDemand Driven Tasks 1/2</p>
<p>Many real-time and concurrent systems have activities that need to be executed on demand. These demand-driven activities are typically handled by means of demand driven tasks. Whereas event driven In/Out tasks are activated by the arrival of external interrupts, demand driven internal tasks (also referred to as aperiodic tasks) are activated on demand by the arrival of internal messages or events.</p>
<p>An object that is activ", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Internal Task Structuring CriteriaDemand Driven Tasks 2/2", ContentHtml = "<p>Internal Task Structuring CriteriaDemand Driven Tasks 2/2</p>
<p>a) Analysis model: communication diagram.</p>
<p>b) Design model: concurrent communication diagram</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Internal Task Structuring CriteriaControl Tasks 1/2", ContentHtml = "<p>Internal Task Structuring CriteriaControl Tasks 1/2</p>
<p>In the analysis model, a state-dependent control object executes a state chart. Using the restricted form of state charts whereby concurrency within an object is not permitted, it follows that the execution of a state chart is strictly sequential.</p>
<p>Hence, a task, whose execution is also strictly sequential, can perform the control activity. A task that executes a sequential state chart (typically implemented as a state transiti", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Internal Task Structuring CriteriaControl Tasks 2/2", ContentHtml = "<p>Internal Task Structuring CriteriaControl Tasks 2/2</p>
<p>a) Analysis model: communication diagram.</p>
<p>b) Design model: concurrent communication diagram</p>", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "Internal Task Structuring CriteriaUser Interaction Tasks 1/", ContentHtml = "<p>Internal Task Structuring CriteriaUser Interaction Tasks 1/2</p>
<p>A user typically performs a set of sequential actions. Because the user’s interaction with the system is a sequential activity, this can be handled by a user interaction task. The speed of this task is frequently constrained by the speed of user interaction.</p>
<p>As its name implies, a user interaction object in the analysis model is designed as a user interaction task. User interaction tasks are usually event driven becau", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "Internal Task Structuring CriteriaUser Interaction Tasks 2/", ContentHtml = "<p>Internal Task Structuring CriteriaUser Interaction Tasks 2/2</p>
<p>a) Analysis model: communication diagram.</p>
<p>b) Design model: concurrent communication diagram</p>
<p>c) Design model: concurrent communication diagram with two tasks.</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, In/Out Task Structuring CriteriaPeriodic In/Out Tasks 1/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Unlike an event driven In/Out task, which deals with an event driven In/Out devi...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Unlike an event driven In/Out task", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Periodic In/Out tasks are often used for simple In/Out devices that, unlike event driven In/Out devi?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Consider a passive digital input device – for example, the engine sensor. This i...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Consider a passive digital input device – for example", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, In/Out Task Structuring CriteriaPeriodic In/Out Tasks 2/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Developing the Concurrent Task Architecture 1/2",
                        Description = "Developing the Concurrent Task Architecture 1/2",
                        OrderIndex = 3,
                        EstimatedMinutes = 55,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Developing the Concurrent Task Architecture 1/2", ContentHtml = "<p>Developing the Concurrent Task Architecture 1/2</p>
<p>The task structuring criteria may be applied to the analysis model in the following order. In each case, one must first decide whether the analysis model object should be designed as an active object (task) or a passive object in the design model.</p>
<p>It is possible to have multiple tasks of the same type</p>
<p>In/Out tasks. Start with the device In/Out objects that interact with the outside world. Determine whether the object should ", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Developing the Concurrent Task Architecture 2/2", ContentHtml = "<p>Developing the Concurrent Task Architecture 2/2</p>
<p>After structuring the system into concurrent tasks, an initial concurrent communication diagram is drawn, showing all the tasks in the system.</p>
<p>On this initial concurrent communication diagram, the interfaces between the tasks are still simple messages as depicted on the analysis model communication diagrams.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Task Communication & Synchronization", ContentHtml = "<p>Task Communication & Synchronization</p>
<p>Task architecture: example of initial concurrent communication diagram for ATM Client subsystem</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Task Communication & Synchronization", ContentHtml = "<p>Task Communication & Synchronization</p>
<p>Asynchronous (Loosely Coupled) Message Communication</p>
<p>Asynchronous message communication, also referred to as loosely coupled message communication, between concurrent tasks is based on the Asynchronous Message Communication pattern.</p>
<p>The producer sends a message to the consumer and continues without waiting for a response.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Task Communication & Synchronization", ContentHtml = "<p>Task Communication & Synchronization</p>
<p>Synchronous (Tightly Coupled) Message Communication with Reply</p>
<p>Synchronous message communication with reply, also referred to as tightly coupled message communication with reply, between concurrent tasks is based on the Synchronous Message Communication.</p>
<p>Although used in client/server systems, Synchronous Message Communication with Reply can also involve a single producer sending a message to a consumer and then waiting for a reply, in", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Task Communication & Synchronization", ContentHtml = "<p>Task Communication & Synchronization</p>
<p>Synchronous (Tightly Coupled) Message Communication without Reply</p>
<p>Synchronous message communication without reply, also referred to as tightly coupled message communication without reply, between concurrent tasks is based on the Synchronous Message Communication without Reply pattern.</p>
<p>The producer sends a message to the consumer and then waits for acceptance of the message by the consumer. When the message arrives, the consumer accepts", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Task Communication & Synchronization", ContentHtml = "<p>Task Communication & Synchronization</p>
<p>Event Synchronization</p>
<p>Three types of event synchronization are possible: an external event, a timer event, and an internal event.</p>
<p>An external event is an event from an external object, typically an interrupt from an external In/Out device.</p>
<p>An internal event represents internal synchronization between a source task and a destination task.</p>
<p>A timer event represents a periodic activation of a task. Events are depicted in UML,", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Task Communication & Synchronization", ContentHtml = "<p>Task Communication & Synchronization</p>
<p>Task Interface and Task Behaviour Specifications</p>
<p>It is also possible for tasks to exchange information by means of a passive information hiding object.</p>
<p>It is important to realize how the synchronous message notation used between two concurrent tasks differs from that used between a task and a passive object. The notation looks the same in the UML: an arrow with a filled-in arrowhead. The semantics are different, however. The synchronou", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Task Interface and Task Behaviour Specifications", ContentHtml = "<p>Task Interface and Task Behaviour Specifications</p>
<p>A task interface specification (TIS) describes a concurrent task’s interface. It is an extension of the class interface specification with additional information specific to a task, including task structure, timing characteristics, relative priority, and errors detected.</p>
<p>A task behavior specification (TBS) describes the task’s event sequencing logic. The task’s interface defines how it interfaces to other tasks. The task’s structu", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "Task Interface and Task Behaviour Specifications", ContentHtml = "<p>Task Interface and Task Behaviour Specifications</p>
<p>Messages:</p>
<p>validatePIN</p>
<p>+ Input parameters: cardId, PIN</p>
<p>+ Reply: PINValidationResponse</p>
<p>withdraw</p>
<p>+ Input parameters: cardId,</p>
<p>account#, amount</p>
<p>+ Reply: withdrawalResponse</p>
<p>query</p>
<p>+ Input parameters: cardId, account#</p>
<p>+ Reply: queryResponse</p>
<p>transfer</p>
<p>+ Input parameters: cardId,</p>
<p>fromAccount#, toAccount#, amount</p>
<p>+ Reply: transferResponse</p>
<p>Task ou", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "Task Interface and Task Behaviour Specifications", ContentHtml = "<p>Task Interface and Task Behaviour Specifications</p>
<p>Name: CardReaderInterface</p>
<p>Information hidden: Details of processing input from and output to card reader</p>
<p>Structuring criteria: role criterion: input/output; concurrency criterion: event driven</p>
<p>Assumptions: only one ATM card input and output is handled at one time.</p>
<p>Anticipated Changes: Possible additional information will need to be read from ATM card.</p>
<p>Task interface:</p>
<p>Task inputs:</p>
<p>Event inp", OrderIndex = 11, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Developing the Concurrent Task Architecture 1/2?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The task structuring criteria may be applied to the analysis model in the follow...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The task structuring criteria may be applied to the analysis model in the following order. In each case", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, It is possible to have multiple tasks of the same type?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'In/Out tasks. Start with the device In/Out objects that interact with the outsid...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "In/Out tasks. Start with the device In/Out objects that interact with the outside world. Determine whether the object sh", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Control tasks. Analyze each state-dependent control object and coordinator object. Structure this ob?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Implementation of Concurrent tasks in Java",
                        Description = "Implementation of Concurrent tasks in Java",
                        OrderIndex = 4,
                        EstimatedMinutes = 5,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Implementation of Concurrent tasks in Java", ContentHtml = "<p>Implementation of Concurrent tasks in Java</p>
<p>As an example of task implementation, consider implementation in Java, in which tasks are implemented as threads. The simplest way to design a thread class in Java is to inherit from the Java Thread class, which has one method called run.</p>
<p>The new thread class must then implement the run method, which, when invoked, will execute independently with its own thread of control. In the example below, the ATM Control class is designed to be a ", OrderIndex = 1, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Implementation of Concurrent tasks in Java?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'As an example of task implementation, consider implementation in Java, in which ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "As an example of task implementation", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The new thread class must then implement the run method, which, when invoked, will execute independe?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 20 Software Quality Attributes",
                Subtitle = "Non-functional requirements: security, modifiability, performance, and more",
                Description = "Ch20 Software Quality Attributes. Implementing quality attribute requirements. Some software quality attributes",
                ColorHex = "#14B8A6",
                IconName = "bi-star",
                Level = CourseLevel.Advanced,
                OrderIndex = 17,
                SlideFileName = "Ch20_Software Quality Attributes.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Software quality attributes",
                        OrderIndex = 1,
                        EstimatedMinutes = 25,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch20 Software Quality Attributes", ContentHtml = "<p>Ch20 Software Quality Attributes</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Software quality attributes</p>
<p>Exploring quality attributes</p>
<p>Implementing quality attribute requirements</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes", ContentHtml = "<p>Software quality attributes</p>
<p>Some software quality attributes</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributesMaintainability", ContentHtml = "<p>Software quality attributesMaintainability</p>
<p>Maintainability is the extent to which software is capable of being changed after deployment</p>
<p>Software may need to be modified for the following reasons:</p>
<p>Fix remaining errors: These are errors that were not detected during testing of the software prior to deployment.</p>
<p>Address performance issues: Performance problems may not become apparent until after the software application has been deployed and is operational in the fiel", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes Modifiability", ContentHtml = "<p>Software quality attributes Modifiability</p>
<p>Modifiability is the extent to which software is capable of being modified during and after initial development. A modular design consisting of modules with well-defined</p>
<p>Decisions such as encapsulating:</p>
<p>Each finite state machine within a separate state machine class</p>
<p>Each interface to a separate external device, system, or user within a separate boundary class</p>
<p>Each separate data structure within a separate data abstr", OrderIndex = 5, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Some software quality attributes...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Some software quality attributes", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Maintainability is the extent to which software is capable of being changed afte...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Maintainability is the extent to which software is capable o", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Software may need to be modified for the following reasons:?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Software quality attributes Testability 1/2",
                        Description = "Software quality attributes Testability 1/2",
                        OrderIndex = 2,
                        EstimatedMinutes = 25,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Software quality attributes Testability 1/2", ContentHtml = "<p>Software quality attributes Testability 1/2</p>
<p>Testability is the extent to which software is capable of being tested. It is important to develop a software test plan early in the software life cycle and to plan on developing test cases in parallel with software development.</p>
<p>Engineers can assess the testability of a system by using various techniques such as encapsulation, interfaces, patterns, low coupling, and more.</p>
<p>During detailed design and coding, in which the internal", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes Testability 2/2", ContentHtml = "<p>Software quality attributes Testability 2/2</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes Traceability 1/2", ContentHtml = "<p>Software quality attributes Traceability 1/2</p>
<p>Traceability is the extent to which products of each phase can be traced back to products of previous phases. Requirements traceability is used to ensure that each software requirement has been designed and implemented.</p>
<p>It is possible to build traceability into the software development method, as is the case with the COMET method. COMET is a use case–based development approach that starts with use cases and then determines the object", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes Traceability 2/2", ContentHtml = "<p>Software quality attributes Traceability 2/2</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes Scalability", ContentHtml = "<p>Software quality attributes Scalability</p>
<p>Scalability is the extent to which the system is capable of growing after its initial deployment.</p>
<p>There are system and software factors to consider in scalability. From a system perspective, there are issues of adding hardware to increase the capacity of the system</p>
<p>In a centralized system, the scope for scalability is limited, such as adding more memory, disk, or an additional CPU.</p>
<p>A distributed system offers much more scope", OrderIndex = 5, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Testability is the extent to which software is capable of being tested. It is im...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Testability is the extent to which software is capable of be", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Engineers can assess the testability of a system by using various techniques such as encapsulation, ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'During detailed design and coding, in which the internal algorithms for each com...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "During detailed design and coding", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Software quality attributes Reusability",
                        Description = "Software quality attributes Reusability",
                        OrderIndex = 3,
                        EstimatedMinutes = 25,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Software quality attributes Reusability", ContentHtml = "<p>Software quality attributes Reusability</p>
<p>Software reusability is the extent to which software is capable of being reused. In traditional software reuse, a library of reusable code components is developed – for example, a statistical subroutine library.</p>
<p>Instead of reusing an individual component, it is much more advantageous to reuse a whole design or subsystem that consists of the components and their interconnections.</p>
<p>Architecture reuse has much greater potential than co", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes Performance", ContentHtml = "<p>Software quality attributes Performance</p>
<p>Performance is also an important consideration in many systems. Performance modeling of a system at design time is important to determine whether the system will meet its performance goals, such as throughput and response times</p>
<p>Real-time scheduling is an approach that is particularly appropriate for hard real-time systems that have deadlines that must be met (Gomaa 2000)</p>
<p>A second approach for analyzing the performance of a design i", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes Security", ContentHtml = "<p>Software quality attributes Security</p>
<p>Security is an important consideration in many systems. There are many potential threats to distributed application systems, such as electronic commerce and banking systems.</p>
<p>Some of the potential threats are as follows:</p>
<p>System penetration</p>
<p>Authorization violation</p>
<p>Confidentiality disclosure.</p>
<p>Integrity compromise</p>
<p>Repudiation</p>
<p>Denial of service</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Software quality attributes Availability", ContentHtml = "<p>Software quality attributes Availability</p>
<p>Availability addresses system failure and its impact on users or other systems. There are times when the system is not available to users for scheduled system maintenance.</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Exploring quality attributes", ContentHtml = "<p>Exploring quality attributes</p>
<p>Step 1: Start with a broad taxonomy</p>
<p>Step 2: Reduce the list</p>
<p>Step 3: Prioritize the attributes</p>
<p>Step 4: Elicit specific expectations for each attribute</p>
<p>Step 5: Specify well-structured quality requirements</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Software reusability is the extent to which software is capable of being reused....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Software reusability is the extent to which software is capable of being reused. In traditional software reuse", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Instead of reusing an individual component, it is much more advantageous to reuse a whole design or ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Architecture reuse has much greater potential than component reuse because it is...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Architecture reuse has much greater potential than component reuse because it is large grained reuse", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Implementing quality attribute requirements",
                        Description = "Implementing quality attribute requirements",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Implementing quality attribute requirements", ContentHtml = "<p>Implementing quality attribute requirements</p>
<p>Quality attribute trade-offs</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Implementing quality attribute requirements", ContentHtml = "<p>Implementing quality attribute requirements</p>
<p>Designers and programmers will have to determine the best way to satisfy each quality requirement.</p>
<p>Although these are nonfunctional requirements, they can lead to derived functional requirements, design guidelines, or other types of technical information that will produce the desired product characteristics.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Implementing quality attribute requirements...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Implementing quality attribute requirements", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Designers and programmers will have to determine the best way to satisfy each quality requirement.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Although these are nonfunctional requirements, they can lead to derived function...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Although these are nonfunctional requirements", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 21 Client Server Software Architecture Case Study-Banking System",
                Subtitle = "Real-world banking system designed with client-server architecture",
                Description = "Ch21 - Client/Server Software Architecture Case Study - Banking System",
                ColorHex = "#3B82F6",
                IconName = "bi-bank",
                Level = CourseLevel.Advanced,
                OrderIndex = 18,
                SlideFileName = "Ch21_Client Server Software Architecture Case Study-Banking System.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "﻿Architectural Design",
                        OrderIndex = 1,
                        EstimatedMinutes = 75,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch21 - Client/Server Software Architecture Case Study - Bank", ContentHtml = "<p>Ch21 - Client/Server Software Architecture Case Study - Banking System</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Problem Description</p>
<p>Software Modeling</p>
<p>Use Case Model</p>
<p>Static Modeling</p>
<p>Object Structuring</p>
<p>Dynamic Modeling</p>
<p>ATM Statechart</p>
<p>﻿Architectural Design</p>
<p>Integrated communication diagram</p>
<p>Detailed Design﻿﻿</p>
<p>Design of ATM Client Subsystem</p>
<p>﻿﻿Design of Bank Service Subsystem</p>
<p>﻿Relational Database Design</p>
<p>Deployment of Banking System</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Problem Description 1/2", ContentHtml = "<p>Problem Description 1/2</p>
<p>A bank has several automated teller machines (ATMs) that are geographically distributed and connected via a wide area network to a central server.</p>
<p>Each ATM machine has a card reader, a cash dispenser, a keyboard/display, and a receipt printer.</p>
<p>By using the ATM machine, a customer can withdraw cash from either a checking or savings account, query the balance of an account, or transfer funds from one account to another.</p>
<p>A transaction is initia", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Problem Description 2/2", ContentHtml = "<p>Problem Description 2/2</p>
<p>If the PIN is validated satisfactorily, the customer is prompted for a withdrawal, query, or transfer transaction.</p>
<p>Before a withdrawal transaction can be approved, the system determines that sufﬁcient funds exist in the requested account, that the maximum daily limit will not be exceeded, and that there are sufﬁcient funds at the local cash dispenser.</p>
<p>If the transaction is approved, the requested amount of cash is dispensed, a receipt is printed th", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Model", ContentHtml = "<p>Use Case Model</p>
<p>The ATM customer can withdraw funds from a checking or savings account, query the balance of the account, and transfer funds from one account to another.</p>
<p>The ATM operator can shut down the ATM, replenish the ATM cash dispenser, & start the ATM</p>
<p>ATM Customer UC specs</p>
<p>=> Ch21, pages 374-376</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Static ModelingConceptual static model", ContentHtml = "<p>Static ModelingConceptual static model</p>
<p>The conceptual static model of the problem domain is given in the class diagram below</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Static ModelingStatic Modeling of the System Context", ContentHtml = "<p>Static ModelingStatic Modeling of the System Context</p>
<p>This is to show the external classes to which the Banking System, shown as one aggregate class, has to interface</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Static ModelingStatic Modeling of the Entity Classes 1/2", ContentHtml = "<p>Static ModelingStatic Modeling of the Entity Classes 1/2</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Static ModelingStatic Modeling of the Entity Classes 2/2", ContentHtml = "<p>Static ModelingStatic Modeling of the Entity Classes 2/2</p>", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "Object Structuring", ContentHtml = "<p>Object Structuring</p>
<p>We next consider structuring the system into objects in preparation for deﬁning the dynamic model.</p>
<p>The object structuring criteria help determine the objects in the system.</p>
<p>After the objects and classes have been determined, a communication diagram or sequence diagram is developed for each use case to show the objects that participate in the use case and the dynamic sequence of interactions between them.</p>", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "Object StructuringClient/Server Subsystem Structuring", ContentHtml = "<p>Object StructuringClient/Server Subsystem Structuring</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "Object StructuringATM Client’s Boundary Objects", ContentHtml = "<p>Object StructuringATM Client’s Boundary Objects</p>", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "Object StructuringATM Client’s Objects Participating in UCs", ContentHtml = "<p>Object StructuringATM Client’s Objects Participating in UCs</p>
<p>Validate PIN: CardReaderInterface, ATMCard, CustomerInteraction, ATMTransaction, ATMControl</p>
<p>Withdraw Funds: ATM Transaction, CashDispenserInterface, ATMCash, ReceiptPrinterInterface, ATMControl</p>
<p>Other UCs: Operator Interaction, ATMControl</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "Object StructuringObject Structuring in Service Subsystem", ContentHtml = "<p>Object StructuringObject Structuring in Service Subsystem</p>
<p>Entity objects:</p>
<p>Customer,</p>
<p>Account, CheckingAccount, SavingAccount,</p>
<p>DebitCard, ATMTransaction, TransactionLog</p>
<p>Business logic objects:</p>
<p>PINValidationTransactionManager,</p>
<p>WithdrawalTransactionManager,</p>
<p>QueryTransactionManager</p>
<p>TransferTransactionManager</p>", OrderIndex = 14, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingValidate PIN UC – Communication Diagram", ContentHtml = "<p>Dynamic ModelingValidate PIN UC – Communication Diagram</p>
<p>At the ATM Client</p>", OrderIndex = 15, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: '﻿﻿Design of Bank Service Subsystem...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿﻿Design of Bank Service Subsystem", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, A bank has several automated teller machines (ATMs) that are geographically distributed and connecte?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Each ATM machine has a card reader, a cash dispenser, a keyboard/display, and a ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Each ATM machine has a card reader", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, By using the ATM machine, a customer can withdraw cash from either a checking or savings account, qu?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Dynamic ModelingValidate PIN UC – Communication Diagram",
                        Description = "Dynamic ModelingValidate PIN UC – Communication Diagram",
                        OrderIndex = 2,
                        EstimatedMinutes = 75,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Dynamic ModelingValidate PIN UC – Communication Diagram", ContentHtml = "<p>Dynamic ModelingValidate PIN UC – Communication Diagram</p>
<p>At the Banking Service</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingValidate PIN UC – Sequence Diagram", ContentHtml = "<p>Dynamic ModelingValidate PIN UC – Sequence Diagram</p>
<p>At the ATM Client</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingValidate PIN UC – Sequence Diagram", ContentHtml = "<p>Dynamic ModelingValidate PIN UC – Sequence Diagram</p>
<p>At the Banking Service</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingValidate PIN UC – Statechart", ContentHtml = "<p>Dynamic ModelingValidate PIN UC – Statechart</p>
<p>Because the Validate PIN interaction diagram is state-dependent, it is also necessary to consider the ATM statechart (shown in this figure), which is executed by the ATM Control object. In particular, the interaction between the statechart and ATM Control (depicted on the communication diagram) needs to be considered</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingWithdraw Funds – Communication Diagram", ContentHtml = "<p>Dynamic ModelingWithdraw Funds – Communication Diagram</p>
<p>At the ATM Client</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingWithdraw Funds – Communication Diagram", ContentHtml = "<p>Dynamic ModelingWithdraw Funds – Communication Diagram</p>
<p>At the Banking Service</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingWithdraw Funds – Sequence Diagram", ContentHtml = "<p>Dynamic ModelingWithdraw Funds – Sequence Diagram</p>
<p>At the ATM Client</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingWithdraw Funds – Sequence Diagram", ContentHtml = "<p>Dynamic ModelingWithdraw Funds – Sequence Diagram</p>
<p>At the Banking Service</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingWithdraw Funds – Statechart", ContentHtml = "<p>Dynamic ModelingWithdraw Funds – Statechart</p>
<p>This is state chart for ATM Control</p>", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "ATM Statechart﻿Top-level state chart for ATM Control", ContentHtml = "<p>ATM Statechart﻿Top-level state chart for ATM Control</p>
<p>﻿Five states are shown on the top-level statechart: Closed Down (which is the initial state), Idle, and three composite states, Processing Customer Input, Processing</p>
<p>﻿Transaction, &  Terminating Transaction.</p>
<p>﻿At system initialization time, given by the event Startup, the ATM transitions from the initial Closed Down state to Idle state. The event Display Welcome is triggered on entry into Idle state. In Idle state, the ", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "ATM Statechart﻿ ﻿Processing Customer Input 1/3", ContentHtml = "<p>ATM Statechart﻿ ﻿Processing Customer Input 1/3</p>
<p>﻿The Processing Customer Input composite state is decomposed into three substates</p>
<p>﻿Waiting for PIN: This substate is entered from Idle state when the customer inserts the card in the ATM, resulting in the Card Inserted event. In this state, the ATM waits for the customer to enter the PIN.</p>
<p>Validating PIN: This substate is entered when the customer enters the PIN. In this substate, the Banking Service validates the PIN.</p>
<p", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "ATM Statechart﻿ ﻿Processing Customer Input 2/3", ContentHtml = "<p>ATM Statechart﻿ ﻿Processing Customer Input 2/3</p>
<p>﻿When a customer inserts an ATM card, the event Card Inserted causes the ATM to transition to the Waiting for PIN substate of the Processing Customer Input composite state</p>", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "ATM Statechart﻿ ﻿Processing Customer Input 3/3", ContentHtml = "<p>ATM Statechart﻿ ﻿Processing Customer Input 3/3</p>
<p>﻿The Validating PIN substate is itself a composite state consisting of two substates: Validating PIN and Card as well as Checking PIN Status</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "ATM Statechart﻿ ﻿﻿Processing Transaction Composite State", ContentHtml = "<p>ATM Statechart﻿ ﻿﻿Processing Transaction Composite State</p>
<p>﻿The Processing Transaction composite state is also decomposed into three substates, one for each transaction:</p>
<p>Processing Withdrawal,</p>
<p>Processing Transfer, ﻿</p>
<p>Processing Query. ﻿</p>
<p>Depending on the customer’s selection – for example, withdrawal – the appropriate substate within Processing Transaction – for example, Processing Withdrawal – is entered, during which the customer’s request is processed.</p>", OrderIndex = 14, EstimatedMinutes = 5 },
                            new() { Title = "ATM Statechart﻿ ﻿Terminating Transaction Composite State", ContentHtml = "<p>ATM Statechart﻿ ﻿Terminating Transaction Composite State</p>
<p>﻿The Terminating Transaction composite state has substates for Dispensing, Printing, Ejecting, Confiscating, and Terminating.</p>", OrderIndex = 15, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Dynamic ModelingValidate PIN UC – Communication Diagram?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Dynamic ModelingValidate PIN UC – Sequence Diagram...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Dynamic ModelingValidate PIN UC – Sequence Diagram", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Dynamic ModelingValidate PIN UC – Sequence Diagram?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Dynamic ModelingValidate PIN UC – Statechart...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Dynamic ModelingValidate PIN UC – Statechart", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Because the Validate PIN interaction diagram is state-dependent, it is also necessary to consider th?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "﻿Integrated communication diagram﻿ATM Client subsystem",
                        Description = "﻿Integrated communication diagram﻿ATM Client subsystem",
                        OrderIndex = 3,
                        EstimatedMinutes = 75,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "﻿Integrated communication diagram﻿ATM Client subsystem", ContentHtml = "<p>﻿Integrated communication diagram﻿ATM Client subsystem</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "﻿Integrated communication diagram﻿Banking Service subsystem", ContentHtml = "<p>﻿Integrated communication diagram﻿Banking Service subsystem</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿ Integrated communication diagram Structuring the System ", ContentHtml = "<p>﻿ ﻿ Integrated communication diagram Structuring the System into Subsystems 1/3</p>
<p>﻿Multiple client/single service architectural pattern</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿ Integrated communication diagram Structuring the System ", ContentHtml = "<p>﻿ ﻿ Integrated communication diagram Structuring the System into Subsystems 2/3</p>
<p>﻿ ﻿Synchronous message communication with reply - This is from the considering the distributed nature of the application and defining the distributed message interfaces</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿ Integrated communication diagram Structuring the System ", ContentHtml = "<p>﻿ ﻿ Integrated communication diagram Structuring the System into Subsystems 3/3</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿﻿Design of ATM Client Subsystem﻿Design the Concurrent Ta", ContentHtml = "<p>﻿ ﻿﻿Design of ATM Client Subsystem﻿Design the Concurrent Task Architecture</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿﻿Design of ATM Client Subsystem﻿﻿Define the Task Interfa", ContentHtml = "<p>﻿ ﻿﻿Design of ATM Client Subsystem﻿﻿Define the Task Interfaces</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿﻿Design of ATM Client SubsystemDesign the Information Hi", ContentHtml = "<p>﻿ ﻿﻿Design of ATM Client SubsystemDesign the Information Hiding Classes</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿﻿Design of Banking Service SubsystemDesign the Concurren", ContentHtml = "<p>﻿ ﻿﻿Design of Banking Service SubsystemDesign the Concurrent Task Architecture</p>", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿﻿Design of Banking Service SubsystemDesign the Task Inte", ContentHtml = "<p>﻿ ﻿﻿Design of Banking Service SubsystemDesign the Task Interfaces</p>", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿﻿Design of Banking Service SubsystemDesign the Informati", ContentHtml = "<p>﻿ ﻿﻿Design of Banking Service SubsystemDesign the Information Hiding Classes 1/2</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿﻿Design of Banking Service SubsystemDesign the Informati", ContentHtml = "<p>﻿ ﻿﻿Design of Banking Service SubsystemDesign the Information Hiding Classes 2/2</p>", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "﻿ ﻿﻿Design of Banking Service SubsystemClass Diagram for th", ContentHtml = "<p>﻿ ﻿﻿Design of Banking Service SubsystemClass Diagram for the UC – Withdraw Funds</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "﻿Relational Database Design", ContentHtml = "<p>﻿Relational Database Design</p>
<p>﻿The data held by these entity classes need to be persistent and therefore need to be stored in a database</p>
<p>﻿the entity classes are designed as database wrapper classes</p>
<p>﻿the contents of the entity classes (as defined by the attributes of the entity classes) need to be stored in relational tables in the database</p>", OrderIndex = 14, EstimatedMinutes = 5 },
                            new() { Title = "Deployment of Banking System", ContentHtml = "<p>Deployment of Banking System</p>
<p>﻿Because this is a client/server system, there are multiple instances of the client subsystem and one instance of the service subsystem. Each subsystem instance executes on its own node, as depicted in the deployment diagram below. Thus, each instance of the ATM Client executes on an ATM node, and the one instance of the Banking Service executes on the server node.</p>", OrderIndex = 15, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿Integrated communication diagram﻿ATM Client subsystem?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Integrated communication diagram﻿Banking Service subsystem...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Integrated communication diagram﻿Banking Service subsystem", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿ ﻿ Integrated communication diagram Structuring the System into Subsystems 1/3?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: '﻿Multiple client/single service architectural pattern...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "﻿Multiple client/single service architectural pattern", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, ﻿ ﻿ Integrated communication diagram Structuring the System into Subsystems 2/3?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 22 SOA Case Study-Online Shopping System",
                Subtitle = "Service-oriented architecture applied to e-commerce",
                Description = "Ch14 - Designing Object-Oriented Software Architectures",
                ColorHex = "#14B8A6",
                IconName = "bi-cart3",
                Level = CourseLevel.Advanced,
                OrderIndex = 19,
                SlideFileName = "Ch22_SOA Case Study-Online Shopping System.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Object and Class Structuring",
                        OrderIndex = 1,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch14 - Designing Object-Oriented Software Architectures", ContentHtml = "<p>Ch14 - Designing Object-Oriented Software Architectures</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Table of contents", ContentHtml = "<p>Table of contents</p>
<p>Problem Description</p>
<p>Use Case Modeling</p>
<p>Static Modeling</p>
<p>Object and Class Structuring</p>
<p>Dynamic Modeling</p>
<p>Broker and Wrapper Technology Support</p>
<p>Design Modeling</p>
<p>Service Reuse</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Problem description", ContentHtml = "<p>Problem description</p>
<p>The Online Shopping System</p>
<p>The Online Shopping System case study is a highly distributed World Wide Web–based system that provides services for purchasing items such as books or clothes.</p>
<p>The solution uses a service-oriented architecture with multiple services; coordinator objects are used to facilitate the integration of the services. In addition, object brokers are used to provide services which include:</p>
<p>a catalog service</p>
<p>an inventory se", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Model", ContentHtml = "<p>Use Case Model</p>
<p>Actors</p>
<p>Customer: browses a catalog and requests to purchase items</p>
<p>Supplier: provides the catalog and services customer purchase requests</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Use Case ModelBrowse Catalog", ContentHtml = "<p>Use Case ModelBrowse Catalog</p>
<p>In the Browse Catalog use case, the customer browses a World Wide Web catalog, views various catalog items from a given supplier’s catalog, and selects items from the catalog.</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Use Case ModelMake Order Request", ContentHtml = "<p>Use Case ModelMake Order Request</p>
<p>Use Case Description for Make Order Request</p>
<p>Activity diagram for Make Order Request use case</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'The Online Shopping System case study is a highly distributed World Wide Web–bas...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The Online Shopping System case study is a highly distribute", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The solution uses a service-oriented architecture with multiple services; coordinator objects are us?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'a credit card authorization service...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "a credit card authorization service", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Customer: browses a catalog and requests to purchase items?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Use Case ModelOther Use Cases",
                        Description = "Use Case ModelOther Use Cases",
                        OrderIndex = 2,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Use Case ModelOther Use Cases", ContentHtml = "<p>Use Case ModelOther Use Cases</p>
<p>Process Delivery Order</p>
<p>Confirm Shipment and Bill Customer</p>
<p>View Order</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Static Modeling", ContentHtml = "<p>Static Modeling</p>
<p>Conceptual static model for Online Shopping System entity classes</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Static Modeling", ContentHtml = "<p>Static Modeling</p>
<p>The classes include customer classes (Customer and Customer Account), supplier classes (Supplier, Inventory, and Catalog), and classes that deal with the customer’s order such as Delivery Order, which is an aggregation of Item.</p>
<p>Entity classes for the Online Shopping System</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Object and Class Structuring", ContentHtml = "<p>Object and Class Structuring</p>
<p>Service and entity classes for the Online Shopping System</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Modeling", ContentHtml = "<p>Dynamic Modeling</p>
<p>Communication diagram for the Make Order Request use case</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Modeling", ContentHtml = "<p>Dynamic Modeling</p>
<p>Communication diagram for the Process Delivery Order use case</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Conceptual static model for Online Shopping System entity classes...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Conceptual static model for Online Shopping System entity cl", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The classes include customer classes (Customer and Customer Account), supplier classes (Supplier, In?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Entity classes for the Online Shopping System...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Entity classes for the Online Shopping System", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Service and entity classes for the Online Shopping System?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Broker & Wrapper Technology Support",
                        Description = "Broker & Wrapper Technology Support",
                        OrderIndex = 3,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Broker & Wrapper Technology Support", ContentHtml = "<p>Broker & Wrapper Technology Support</p>
<p>Several legacy databases are used in the Online Shopping System. Many of the entity classes in the static model represent persistent data stored in legacy databases.</p>
<p>Each legacy database is a stand-alone database that resides on a mainframe. These databases need to be integrated into the application, by means of a broker and wrapper technology.</p>
<p>Object broker and wrapper technology provide a systematic way of integrating the disparate le", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>The components are structured into the layered architecture such that each component is in a layer where it depends on components in the layers below but not the layers above. This layered architecture is based on the Layers of Abstraction pattern. Applying the component structuring criteria, the following components and services, organized by layer, are determined</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Concurrent communication diagram for Online Shopping System</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Each service has one provided interface through which the service operations are accessed.</p>
<p>The clients of the service invoke the appropriate operations provided by the interface synchronously. The service operations are designed by considering how each individual service is accessed on the use case–based interaction diagrams. Typically, each service is accessed in different ways corresponding to requests for different service operations.</p>
<p>The interaction di", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Service interface for Catalog Service</p>
<p>Service interface for Customer Account Service</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Service-oriented software architecture for Online Shopping System</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'Several legacy databases are used in the Online Shopping System. Many of the ent...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Several legacy databases are used in the Online Shopping Sys", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Each legacy database is a stand-alone database that resides on a mainframe. These databases need to ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Object broker and wrapper technology provide a systematic way of integrating the...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Object broker and wrapper technology provide a systematic wa", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The legacy databases in the supplier organization are the catalog database, the inventory database, ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Service Reuse",
                        Description = "Services can be composed into new applications. Other electronic commerce systems could be designed that would reuse the services provided by the Onli",
                        OrderIndex = 4,
                        EstimatedMinutes = 5,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Service Reuse", ContentHtml = "<p>Service Reuse</p>
<p>Services can be composed into new applications. Other electronic commerce systems could be designed that would reuse the services provided by the Online Shopping System, such as Catalog Service, Delivery Order Service, and Inventory Service.</p>
<p>In a business to business (B2B) system, for example, instead of using customer accounts, contracts would be established between business customers and suppliers.</p>
<p>The B2B system would necessitate the creation of additiona", OrderIndex = 1, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Services can be composed into new applications. Other electronic commerce systems could be designed ?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'In a business to business (B2B) system, for example, instead of using customer a...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "In a business to business (B2B) system", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The B2B system would necessitate the creation of additional services as well as different versions o?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A reusable service-oriented architecture for an Electronic Commerce software pro...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A reusable service-oriented architecture for an Electronic Commerce software product line", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 23 Component-Based Software Arch Case Study Emergency Monitoring System",
                Subtitle = "Emergency monitoring system using component-based architecture",
                Description = "Ch23 - Component-Based Software Architecture Case Study",
                ColorHex = "#F59E0B",
                IconName = "bi-exclamation-triangle",
                Level = CourseLevel.Advanced,
                OrderIndex = 20,
                SlideFileName = "Ch23_Component-Based Software Arch_Case Study Emergency Monitoring System.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "Software Component Deployment",
                        OrderIndex = 1,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch23 - Component-Based Software Architecture Case Study", ContentHtml = "<p>Ch23 - Component-Based Software Architecture Case Study</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Problem Description</p>
<p>Use Case Modeling</p>
<p>Static Modeling</p>
<p>Dynamic Modeling</p>
<p>Design Modeling</p>
<p>Software Component Deployment</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Problem Description", ContentHtml = "<p>Problem Description</p>
<p>The Emergency Monitoring System</p>
<p>An Emergency Monitoring System consists of several remote monitoring systems and monitoring sensors that provide sensor input to the system.</p>
<p>The status of the external environment is monitored with a variety of sensors. Some of these sensors are attached to remote monitoring systems, which send regular status input that is stored at a monitoring service.</p>
<p>In addition, from the sensor information, alarms are generat", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Modeling", ContentHtml = "<p>Use Case Modeling</p>
<p>Emergency Monitoring System use cases and actors</p>
<p>Actors: Monitoring Operator, Monitoring Sensor & Remote System</p>
<p>Monitoring Sensor & Remote System behave in a similar way. This similar behavior can be modeled by a generalized actor, Remote Sensor.</p>
<p>Use cases overview:</p>
<p>View Alarms: views outstanding alarms and acknowledges the cause.</p>
<p>View Monitoring Data: view the current status of one or more sensors.</p>
<p>Generate Monitoring Data: m", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Modeling", ContentHtml = "<p>Use Case Modeling</p>
<p>View Monitoring Data use case description</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Modeling", ContentHtml = "<p>Use Case Modeling</p>
<p>View Alarms use case description</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Modeling", ContentHtml = "<p>Use Case Modeling</p>
<p>Generate Monitoring Data use case description</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'An Emergency Monitoring System consists of several remote monitoring systems and...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "An Emergency Monitoring System consists of several remote mo", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The status of the external environment is monitored with a variety of sensors. Some of these sensors?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'In addition, from the sensor information, alarms are generated concerning undesi...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "In addition", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Monitoring operators view the status of the different sensors and view and update alarm conditions.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Use Case Modeling",
                        Description = "Generate Alarm use case description",
                        OrderIndex = 2,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Use Case Modeling", ContentHtml = "<p>Use Case Modeling</p>
<p>Generate Alarm use case description</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Static Modeling", ContentHtml = "<p>Static Modeling</p>
<p>Browse Catalog</p>
<p>For the Emergency Monitoring System, the external classes consist of one external user Monitoring Operator, one external system Remote System, and one external input device, Monitoring Sensor.</p>
<p>Since there are multiple instances of each external class, each of the external classes has a one-to-many association with the Emergency Monitoring System.</p>
<p>The common behavior of Remote System and Monitoring Sensor is captured by means of a gene", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Modeling", ContentHtml = "<p>Dynamic Modeling</p>
<p>Class structuring for Emergency Monitoring System</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Modeling", ContentHtml = "<p>Dynamic Modeling</p>
<p>Communication diagram for the View Alarms use case</p>
<p>Communication diagram for the View Monitoring Data use case</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic Modeling", ContentHtml = "<p>Dynamic Modeling</p>
<p>Communication diagram for the Generate Alarm use case</p>
<p>Communication diagram for the Generate Monitoring</p>
<p>Status use case</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Integrated Communication diagram for Emergency Monitoring System</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Layered architecture of the Emergency Monitoring System</p>
<p>Layer 1: Service Layer. This layer consists of the services Alarm Service and Monitoring Data Service.</p>
<p>Layer 2: Monitoring Layer. This layer consists of the Remote System Proxy and Monitoring Sensor Component. The components require the two services at the Service Layer.</p>
<p>Layer 3: User Layer. This layer consists of the user interaction component Operator Presentation and the components it contai", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'For the Emergency Monitoring System, the external classes consist of one externa...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "For the Emergency Monitoring System", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Since there are multiple instances of each external class, each of the external classes has a one-to?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'The common behavior of Remote System and Monitoring Sensor is captured by means ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "The common behavior of Remote System and Monitoring Sensor is captured by means of a generalized external class", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Class structuring for Emergency Monitoring System?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Design Modeling",
                        Description = "Concurrent communication diagram for the Emergency Monitoring System",
                        OrderIndex = 3,
                        EstimatedMinutes = 35,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Concurrent communication diagram for the Emergency Monitoring System</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Distributed component-based software architecture for Emergency Monitoring System</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Component interfaces of Alarm Service</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Component interfaces of Monitoring Data Service</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Component interfaces of client components</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Design Modeling", ContentHtml = "<p>Design Modeling</p>
<p>Component interfaces of user interaction components</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Software Component Deployment", ContentHtml = "<p>Software Component Deployment</p>
<p>Deployment diagram for an Emergency Monitoring System</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Concurrent communication diagram for the Emergency Monitoring System?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Distributed component-based software architecture for Emergency Monitoring Syste...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Distributed component-based software architecture for Emerge", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Component interfaces of Monitoring Data Service...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Component interfaces of Monitoring Data Service", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "Chapter 24 Real-Time Software Arch Case Study Automated Guided Vehicle System",
                Subtitle = "Automated guided vehicle system with real-time architecture",
                Description = "Ch14 - Real-Time Software Architecture Case Study: Automated Guided Vehicle System",
                ColorHex = "#EC4899",
                IconName = "bi-truck",
                Level = CourseLevel.Advanced,
                OrderIndex = 21,
                SlideFileName = "Ch24_Real-Time Software Arch_Case Study Automated Guided Vehicle System.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Part 1",
                        Description = "An AGV System has the following characteristics:",
                        OrderIndex = 1,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Ch14 - Real-Time Software Architecture Case Study: Automated", ContentHtml = "<p>Ch14 - Real-Time Software Architecture Case Study: Automated Guided Vehicle System</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Main Contents", ContentHtml = "<p>Main Contents</p>
<p>Problem Description</p>
<p>Use Case Modeling</p>
<p>Static Modeling</p>
<p>Dynamic Modeling</p>
<p>Design Modeling</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Problem Description", ContentHtml = "<p>Problem Description</p>
<p>An AGV System has the following characteristics:</p>
<p>A computer-based AGV can move along a track in the factory in a clockwise direction, and start and stop at factory stations.</p>
<p>The AGV system receives Move commands from an external Supervisory System. It sends vehicle Acknowledgements (Acks) to the Supervisory System</p>
<p>indicating that is has started moving, passed a station, or stopped at a station. The AGV system also sends vehicle status to an exte", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Modeling", ContentHtml = "<p>Use Case Modeling</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Static Modeling", ContentHtml = "<p>Static Modeling</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Static ModelingSoftware System Context Modeling", ContentHtml = "<p>Static ModelingSoftware System Context Modeling</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, An AGV System has the following characteristics:?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'A computer-based AGV can move along a track in the factory in a clockwise direct...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "A computer-based AGV can move along a track in the factory in a clockwise direction", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, The AGV system receives Move commands from an external Supervisory System. It sends vehicle Acknowle?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'indicating that is has started moving, passed a station, or stopped at a station...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "indicating that is has started moving", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, It is given that the arrival sensor is an event-driven input device and that the motor and arm are p?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Static ModelingObject and Class Structuring",
                        Description = "Static ModelingObject and Class Structuring",
                        OrderIndex = 2,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Static ModelingObject and Class Structuring", ContentHtml = "<p>Static ModelingObject and Class Structuring</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingDynamic State Machine Modeling", ContentHtml = "<p>Dynamic ModelingDynamic State Machine Modeling</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingDynamic Interaction Modeling", ContentHtml = "<p>Dynamic ModelingDynamic Interaction Modeling</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Dynamic ModelingDynamic Interaction Modeling", ContentHtml = "<p>Dynamic ModelingDynamic Interaction Modeling</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Design ModelingIntegrated Communication Diagram", ContentHtml = "<p>Design ModelingIntegrated Communication Diagram</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Design ModelingFactory Automation System 1/3", ContentHtml = "<p>Design ModelingFactory Automation System 1/3</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Static ModelingObject and Class Structuring?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Dynamic ModelingDynamic State Machine Modeling...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Dynamic ModelingDynamic State Machine Modeling", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Dynamic ModelingDynamic Interaction Modeling...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Dynamic ModelingDynamic Interaction Modeling", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Design ModelingFactory Automation System 2/3",
                        Description = "Design ModelingFactory Automation System 2/3",
                        OrderIndex = 3,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Design ModelingFactory Automation System 2/3", ContentHtml = "<p>Design ModelingFactory Automation System 2/3</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Design ModelingFactory Automation System 3/3", ContentHtml = "<p>Design ModelingFactory Automation System 3/3</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Design ModelingConcurrent Software Architecture", ContentHtml = "<p>Design ModelingConcurrent Software Architecture</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Design ModelingArchitectural Communication Patterns", ContentHtml = "<p>Design ModelingArchitectural Communication Patterns</p>
<p>To handle the variety of communication between the tasks in the AGV System, four communication patterns are applied</p>
<p>Asynchronous Message Communication</p>
<p>Bidirectional Asynchronous Communication</p>
<p>Synchronous Message Communication without Reply</p>
<p>Call/Return</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Design ModelingComponent-Based Software Architecture", ContentHtml = "<p>Design ModelingComponent-Based Software Architecture</p>
<p>The Automated Guided Vehicle System component is designed as a composite component that contains eight simple part components; seven of these are concurrent components (Supervisory System Proxy, Arrival Sensor Component, Vehicle Control, Vehicle Timer, Arm Component, Motor Component, and Display Proxy), and the other is a passive data abstraction object (Vehicle Status).</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Design ModelingDesign of Component Interfaces 1/3", ContentHtml = "<p>Design ModelingDesign of Component Interfaces 1/3</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Design ModelingFactory Automation System 2/3?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Design ModelingFactory Automation System 3/3...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Design ModelingFactory Automation System 3/3", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Design ModelingArchitectural Communication Patterns...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Design ModelingArchitectural Communication Patterns", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, To handle the variety of communication between the tasks in the AGV System, four communication patte?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Design ModelingDesign of Component Interfaces 2/3",
                        Description = "Design ModelingDesign of Component Interfaces 2/3",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Design ModelingDesign of Component Interfaces 2/3", ContentHtml = "<p>Design ModelingDesign of Component Interfaces 2/3</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Design ModelingDesign of Component Interfaces 3/3", ContentHtml = "<p>Design ModelingDesign of Component Interfaces 3/3</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Design ModelingDesign of Component Interfaces 2/3?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Design ModelingDesign of Component Interfaces 3/3...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Design ModelingDesign of Component Interfaces 3/3", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "SWD392 Design Partern",
                Subtitle = "Creational, structural, and behavioral design patterns",
                Description = "Introduction to Design Patterns",
                ColorHex = "#EF4444",
                IconName = "bi-collection",
                Level = CourseLevel.Intermediate,
                OrderIndex = 22,
                SlideFileName = "SWD392_Design Partern.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Introduction to Design Patterns",
                        Description = "Introduction to Design Patterns",
                        OrderIndex = 1,
                        EstimatedMinutes = 145,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Introduction to Design Patterns", ContentHtml = "<p>Introduction to Design Patterns</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "Content", ContentHtml = "<p>Content</p>
<p>What are Design Patterns?</p>
<p>Why use Design Patterns?</p>
<p>Elements of a Design Pattern</p>
<p>Design Patterns Classification</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "What Are Design Patterns?", ContentHtml = "<p>What Are Design Patterns?</p>
<p>Wikipedia definition</p>
<p>“a design pattern is a general repeatable solution to a commonly occurring problem in software design”</p>
<p>Quote from Christopher Alexander</p>
<p>“Each pattern describes a problem which occurs over and over again in our environment, and then describes the core of the solution to that problem, in such a way that you can use this solution a million times over, without ever doing it the same way twice” (GoF,1995)</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Why use Design Patterns?", ContentHtml = "<p>Why use Design Patterns?</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Why use Design Patterns?", ContentHtml = "<p>Why use Design Patterns?</p>
<p>Design Objectives</p>
<p>Good Design (the “ilities”)</p>
<p>High readability and maintainability</p>
<p>High extensibility</p>
<p>High scalability</p>
<p>High testability</p>
<p>High reusability</p>
<p>Why use Design Patterns?</p>
<p>Promote reusability and flexibility</p>
<p>Facilitate better communication within development teams</p>
<p>Capture best practices from experienced designers</p>
<p>Provide a common vocabulary for design</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Elements of a Design Pattern", ContentHtml = "<p>Elements of a Design Pattern</p>
<p>A pattern has four essential elements (GoF)</p>
<p>Name</p>
<p>Describes the pattern</p>
<p>Adds to common terminology for facilitating communication (i.e. not just sentence enhancers)</p>
<p>Problem</p>
<p>Describes when to apply the pattern</p>
<p>Answers - What is the pattern trying to solve?</p>
<p>Solution</p>
<p>Describes elements, relationships, responsibilities, and collaborations which make up the design</p>
<p>Consequences</p>
<p>Results of applyi", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Pros/Cons of Design Patterns", ContentHtml = "<p>Pros/Cons of Design Patterns</p>
<p>Pros</p>
<p>Add consistency to designs by solving similar problems the same way, independent of language</p>
<p>Add clarity to design and design communication by enabling a common vocabulary</p>
<p>Improve time to solution by providing templates which serve as foundations for good design</p>
<p>Improve reuse through composition</p>
<p>Cons</p>
<p>Some patterns come with negative consequences (i.e. object proliferation, performance hits, additional layers)</", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Design Patterns Classification", ContentHtml = "<p>Design Patterns Classification</p>
<p>A Pattern can be classified as</p>
<p>Creational: deals with object creation</p>
<p>Structural: deals with compositions of objects and classes</p>
<p>Behavioral: are used to distribute responsibility between classes and objects</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Creational patterns", ContentHtml = "<p>Creational patterns</p>
<p>Abstract factory groups object factories that have a common theme.</p>
<p>Builder constructs complex objects by separating construction and representation.</p>
<p>Factory method creates objects without specifying the exact class to create.</p>
<p>Prototype creates objects by cloning an existing object.</p>
<p>Singleton restricts object creation for a class to only one instance.</p>
<p>9</p>", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "Structural patterns", ContentHtml = "<p>Structural patterns</p>
<p>Adapter allows classes with incompatible interfaces to work together by wrapping its own interface around that of an already existing class.</p>
<p>Bridge decouples an abstraction from its implementation so that the two can vary independently.</p>
<p>Composite composes zero-or-more similar objects so that they can be manipulated as one object.</p>
<p>Decorator dynamically adds/overrides behaviour in an existing method of an object.</p>
<p>Facade provides a simplifie", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "Behavioral patterns", ContentHtml = "<p>Behavioral patterns</p>
<p>Chain of responsibility delegates commands to a chain of processing objects.</p>
<p>Command creates objects which encapsulate actions and parameters.</p>
<p>Interpreter implements a specialized language.</p>
<p>Iterator accesses the elements of an object sequentially without exposing its underlying representation.</p>
<p>Mediator allows loose coupling between classes by being the only class that has detailed knowledge of their methods.</p>
<p>Memento provides the ab", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "Behavioral patterns", ContentHtml = "<p>Behavioral patterns</p>
<p>Observer is a publish/subscribe pattern which allows a number of observer objects to see an event.</p>
<p>State allows an object to alter its behavior when its internal state changes.</p>
<p>Strategy allows one of a family of algorithms to be selected on-the-fly at runtime.</p>
<p>Template method defines the skeleton of an algorithm as an abstract class, allowing its subclasses to provide concrete behavior.</p>
<p>Visitor separates an algorithm from an object struct", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "Design pattern space", ContentHtml = "<p>Design pattern space</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "How to Select a Design Pattern", ContentHtml = "<p>How to Select a Design Pattern</p>
<p>Consider howdesign patterns solve design problems.</p>
<p>Scan Intent sections</p>
<p>Study how patterns interrelate</p>
<p>Study patterns of like purpose</p>
<p>Examine a cause of redesign</p>
<p>Consider what should be variable in your design</p>", OrderIndex = 14, EstimatedMinutes = 5 },
                            new() { Title = "Pattern Structure Template", ContentHtml = "<p>Pattern Structure Template</p>
<p>Each pattern follows a standard structure:</p>
<p>Pattern Name & Type</p>
<p>Intent – What does it do?</p>
<p>Motivation – Why is it needed?</p>
<p>Structure – UML class/object diagram</p>
<p>Participants – Key classes/objects</p>
<p>Collaborations – How they interact</p>
<p>Consequences – Pros & cons</p>
<p>Sample Code – In C++ or Smalltalk</p>
<p>Known Uses – Real-world examples</p>", OrderIndex = 15, EstimatedMinutes = 5 },
                            new() { Title = "Design Pattern Catalog", ContentHtml = "<p>Design Pattern Catalog</p>", OrderIndex = 16, EstimatedMinutes = 5 },
                            new() { Title = "Creational patterns", ContentHtml = "<p>Creational patterns</p>", OrderIndex = 17, EstimatedMinutes = 5 },
                            new() { Title = "ABSTRACT FACTORY", ContentHtml = "<p>ABSTRACT FACTORY</p>
<p>IntentProvide an interface for creating families of related or dependent objects without specifying their concrete classes.</p>
<p>Motivation</p>
<p>To support multiple look-and-feel standards without hard-coding UI components, the Abstract Factory pattern provides an interface for creating families of related widgets, allowing applications to remain independent of their concrete implementations.</p>", OrderIndex = 18, EstimatedMinutes = 5 },
                            new() { Title = "ABSTRACT FACTORY", ContentHtml = "<p>ABSTRACT FACTORY</p>
<p>Structure</p>", OrderIndex = 19, EstimatedMinutes = 5 },
                            new() { Title = "ABSTRACT FACTORY", ContentHtml = "<p>ABSTRACT FACTORY</p>", OrderIndex = 20, EstimatedMinutes = 5 },
                            new() { Title = "ABSTRACT FACTORY", ContentHtml = "<p>ABSTRACT FACTORY</p>", OrderIndex = 21, EstimatedMinutes = 5 },
                            new() { Title = "BUILDER", ContentHtml = "<p>BUILDER</p>
<p>Intent</p>
<p>Separate the construction of a complex object from its representation so that thesame construction process can create different representations</p>
<p>Motivation</p>
<p>A complex object that has multiple pluggable components of different types. A builder will provide a simple flexible way to build such object.</p>", OrderIndex = 22, EstimatedMinutes = 5 },
                            new() { Title = "BUILDER", ContentHtml = "<p>BUILDER</p>
<p>EX: To support multiple output formats, an RTFReader should be able to convert RTF documents into various representations like ASCII, TeX, or editable text widgets without changing its parsing logic. By applying the Builder pattern, the RTFReader (director) delegates the construction of the output to a TextConverter (builder), making it easy to extend with new formats through subclassing.</p>", OrderIndex = 23, EstimatedMinutes = 5 },
                            new() { Title = "BUILDER", ContentHtml = "<p>BUILDER</p>
<p>Solution</p>
<p>24</p>", OrderIndex = 24, EstimatedMinutes = 5 },
                            new() { Title = "BUILDER", ContentHtml = "<p>BUILDER</p>
<p>Builder: specifies an abstract interface for creating parts of a Product object</p>
<p>Concrete Builder: constructs and assembles parts of the product by implementing the Builder interface. Defines and keeps track of the representation it creates.</p>
<p>Director: constructs an object using the Builder interface.</p>
<p>Product: represents the complex object under construction. ConcreteBuilder builds the product's internal representation and defines the process by which it's as", OrderIndex = 25, EstimatedMinutes = 5 },
                            new() { Title = "Singleton", ContentHtml = "<p>Singleton</p>
<p>Intent: Ensure a class only has one instance, and provide a global point of access to it.</p>
<p>Motivation:</p>
<p>It's important for some classes to have exactly one instance. Although there can be many printers in a system, there should be only one printer spooler. There should be only one file system and one window manager.</p>
<p>How do we ensure that a class has only one instance and that the instance is easily accessible? A global variable makes an object accessible, b", OrderIndex = 26, EstimatedMinutes = 5 },
                            new() { Title = "Singleton", ContentHtml = "<p>Singleton</p>
<p>Solution</p>
<p>27</p>", OrderIndex = 27, EstimatedMinutes = 5 },
                            new() { Title = "Singleton", ContentHtml = "<p>Singleton</p>
<p>Code example</p>
<p>Advanced Programming</p>
<p>28</p>", OrderIndex = 28, EstimatedMinutes = 5 },
                            new() { Title = "FACTORY METHOD", ContentHtml = "<p>FACTORY METHOD</p>
<p>Intent</p>
<p>Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.</p>
<p>Motivation:</p>
<p>Frameworks often rely on abstract classes to manage object relationships and creation, but they cannot instantiate these abstract classes directly. In applications like document editors, the framework knows when to create a document but not which specific subclass to instan", OrderIndex = 29, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: '“a design pattern is a general repeatable solution to a commonly occurring probl...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "“a design pattern is a general repeatable solution to a comm", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, “Each pattern describes a problem which occurs over and over again in our environment, and then desc?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'High readability and maintainability...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "High readability and maintainability", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "FACTORY METHOD",
                        Description = "defines the interface of objects the factory method creates.",
                        OrderIndex = 2,
                        EstimatedMinutes = 145,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "FACTORY METHOD", ContentHtml = "<p>FACTORY METHOD</p>
<p>Solution</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "FACTORY METHOD", ContentHtml = "<p>FACTORY METHOD</p>
<p>Product (Document):</p>
<p>defines the interface of objects the factory method creates.</p>
<p>ConcreteProduct (MyDocument):</p>
<p>implements theProduct interface.</p>
<p>Creator (Application)</p>
<p>declares the factory method, which returns an object oftype Product. Creator may also define a default implementation of the factory method that returns a default ConcreteProduct object.</p>
<p>may call the factory method to create a Product object.</p>
<p>ConcreteCreator (", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "PROTOTYPE", ContentHtml = "<p>PROTOTYPE</p>
<p>Intent</p>
<p>Specify the kinds of objects to create using a prototypical instance, and create newobjects by copying this prototype.</p>
<p>Motivation</p>
<p>The Prototype Pattern allows a framework to create new objects by cloning existing prototypes instead of instantiating subclasses directly. This reduces the number of subclasses and increases flexibility when adding new objects, such as in a music editing application.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "PROTOTYPE", ContentHtml = "<p>PROTOTYPE</p>
<p>Solution</p>
<p>Prototype (Graphic)</p>
<p>declares an interface for cloning itself.</p>
<p>ConcretePrototype (Staff, WholeNote, HalfNote)</p>
<p>implements an operation for cloning itself.</p>
<p>Client (GraphicTool)</p>
<p>creates a new object by asking a prototype to clone itself</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Structural Patterns", ContentHtml = "<p>Structural Patterns</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Adapter", ContentHtml = "<p>Adapter</p>
<p>Intent: Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.</p>
<p>Example: Integer is a class to adapt int type</p>
<p>Motivation: Sometimes a toolkit class that's designed for reuse isn't reusable only because its interface doesn't match the domain-specific interface an application requires.</p>
<p>Advanced Programming</p>
<p>35</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "Adapter", ContentHtml = "<p>Adapter</p>
<p>Solution 1: multiple inheritance</p>
<p>Current class: Target, Old class: Adaptee</p>
<p>Client can work with Target, not Adaptee</p>
<p>-> Adapter will adapt Adaptee to work with Client</p>
<p>Advanced Programming</p>
<p>36</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "Adapter", ContentHtml = "<p>Adapter</p>
<p>Solution 2: using object of adaptee inside an adapter</p>
<p>Current class: Target, Old class: Adaptee</p>
<p>Client can work with Target, not Adaptee</p>
<p>-> Adapter uses Adaptee object to work with Client</p>
<p>Advanced Programming</p>
<p>37</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "Adapter", ContentHtml = "<p>Adapter</p>
<p>Example: Consider for example a drawing editor that lets users draw and arrange graphical elements (lines, polygons, text, etc.) into pictures and diagrams. The drawing editor's key abstraction is the graphical object, which has an editable shape and can draw itself. The interface for graphical objects is defined by an abstract class called Shape. The editor defines a subclass of Shape for each kind of graphical object: a LineShape class for lines, a PolygonShape class for poly", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "Adapter", ContentHtml = "<p>Adapter</p>
<p>Example (continued): Meanwhile, an off-the-shelf user interface toolkit might already provide a sophisticated TextView class for displaying and editing text. Ideally we'd like to reuse TextView to implement TextShape, but the toolkit wasn't designed with Shape classes in mind. So we can't use TextView and Shape objects interchangeably.</p>
<p>Advanced Programming</p>
<p>39</p>", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "Adapter", ContentHtml = "<p>Adapter</p>
<p>Solution 1 for example problem</p>
<p>Advanced Programming</p>
<p>40</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "BRIDGE", ContentHtml = "<p>BRIDGE</p>
<p>Intent</p>
<p>Decouple an abstraction from its implementation so that the two can vary independently.</p>
<p>Motivation</p>
<p>The Bridge Pattern separates an object's abstraction from its implementation into two independent class hierarchies, allowing them to vary independently. This solves the problem of tight coupling caused by inheritance and increases flexibility when extending to multiple platforms or object types.</p>", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "BRIDGE", ContentHtml = "<p>BRIDGE</p>
<p>All operations on Window subclasses are implemented in terms of abstract operations from the Windowlmp interface. This decouples the window abstractionsfrom the various platform-specific implementations. We refer to the relationship between Window and Windowlmp as a bridge,because it bridges the abstraction and its implementation, letting them vary independently.</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "BRIDGE", ContentHtml = "<p>BRIDGE</p>
<p>Solution</p>", OrderIndex = 14, EstimatedMinutes = 5 },
                            new() { Title = "COMPOSITE", ContentHtml = "<p>COMPOSITE</p>
<p>IntentCompose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly</p>
<p>Motivation The Composite Pattern allows individual objects and groups of objects to be treated uniformly by organizing them into a recursive tree structure. This eliminates the need for clients to distinguish between primitives and composites, simplifying the design and increasing system flexibility.</p>", OrderIndex = 15, EstimatedMinutes = 5 },
                            new() { Title = "COMPOSITE", ContentHtml = "<p>COMPOSITE</p>", OrderIndex = 16, EstimatedMinutes = 5 },
                            new() { Title = "COMPOSITE", ContentHtml = "<p>COMPOSITE</p>
<p>Participants</p>
<p>Component (Graphic)</p>
<p>declares the interface for objects in the composition.</p>
<p>implements default behavior for the interface common to all classes, as appropriate.</p>
<p>declares an interfacefor accessing and managing its child components.</p>
<p>(optional) defines an interface for accessing a component's parent in the recursive structure, and implements it if that's appropriate.</p>
<p>Leaf (Rectangle, Line, Text,etc.)</p>
<p>represents leaf ob", OrderIndex = 17, EstimatedMinutes = 5 },
                            new() { Title = "DECORATOR", ContentHtml = "<p>DECORATOR</p>
<p>Intent</p>
<p>Attach additional responsibilities to an object dynamically. Decorators provide aflexible alternative to subclassing for extending functionality</p>
<p>Motivation</p>
<p>Decorator Pattern allows adding responsibilities to individual objects dynamically by wrapping them in decorator classes without modifying the original class. Decorators follow the same interface as the original object, support recursive composition, and remain transparent to the client.</p>", OrderIndex = 18, EstimatedMinutes = 5 },
                            new() { Title = "DECORATOR", ContentHtml = "<p>DECORATOR</p>", OrderIndex = 19, EstimatedMinutes = 5 },
                            new() { Title = "DECORATOR", ContentHtml = "<p>DECORATOR</p>
<p>Participants</p>
<p>Component (VisualComponent)</p>
<p>defines the interface for objects that can have responsibilities added to themdynamically.</p>
<p>ConcreteComponent (TextView)</p>
<p>defines an object to which additional responsibilities canbe attached.</p>
<p>Decorator</p>
<p>maintains a reference to a Component object and defines an interface that conforms to Component's interface.</p>
<p>ConcreteDecorator (BorderDecorator, ScrollDecorator)</p>
<p>adds responsibilitie", OrderIndex = 20, EstimatedMinutes = 5 },
                            new() { Title = "FACADE", ContentHtml = "<p>FACADE</p>
<p>Intent</p>
<p>Provide a unified interface to a set of interfaces in a subsystem. Facade defines ahigher-level interface that makes the subsystem easier to use.</p>
<p>Motivation</p>
<p>Structuring a system into subsystems helps reduce complexity.A common designgoal is to minimize the communication and dependencies between subsystems.One way to achieve this goal is to introduce a facade object that provides a single,simplified interface to the more general facilities of a sub", OrderIndex = 21, EstimatedMinutes = 5 },
                            new() { Title = "FACADE", ContentHtml = "<p>FACADE</p>", OrderIndex = 22, EstimatedMinutes = 5 },
                            new() { Title = "FACADE", ContentHtml = "<p>FACADE</p>
<p>Participants</p>
<p>Facade (Compiler)</p>
<p>knows which subsystem classes areresponsible for a request.</p>
<p>delegates client requests to appropriate subsystem objects.</p>
<p>subsystem classes (Scanner, Parser, ProgramNode, etc.)</p>
<p>implement subsystem functionality.</p>
<p>handle work assigned by theFacade object.</p>
<p>have no knowledge ofthe facade; that is, they keep no references to it.</p>", OrderIndex = 23, EstimatedMinutes = 5 },
                            new() { Title = "FLYWEIGHT", ContentHtml = "<p>FLYWEIGHT</p>
<p>Intent</p>
<p>Use sharing to support large numbers of fine-grained objects efficiently.</p>
<p>Motivation</p>
<p>Flyweight Pattern reduces memory usage by sharing common objects across multiple contexts, which is especially useful when dealing with large numbers of similar objects. It separates intrinsic state (shared) from extrinsic state (context-dependent) to optimize resource usage. For example, identical characters in a text editor can share the same flyweight to improve", OrderIndex = 24, EstimatedMinutes = 5 },
                            new() { Title = "FLYWEIGHT", ContentHtml = "<p>FLYWEIGHT</p>", OrderIndex = 25, EstimatedMinutes = 5 },
                            new() { Title = "FLYWEIGHT", ContentHtml = "<p>FLYWEIGHT</p>
<p>Participants</p>
<p>Flyweight (Glyph)</p>
<p>declares an interface through which flyweights can receive and act on extrinsic state.</p>
<p>ConcreteFlyweight (Character)</p>
<p>implements the Flyweight interface and adds storage for intrinsic state, if any. A ConcreteFlyweight object must be sharable. Any state it stores must be intrinsic; that is, it must be independent of the ConcreteFlyweight object's context.</p>
<p>UnsharedConcreteFlyweight (Row, Column)</p>
<p>not all Fl", OrderIndex = 26, EstimatedMinutes = 5 },
                            new() { Title = "PROXY", ContentHtml = "<p>PROXY</p>
<p>Intent</p>
<p>Provide a surrogate or placeholder for another object to control access to it</p>
<p>Motivation</p>
<p>Proxy Pattern allows delaying the creation and initialization of expensive objects until they are actually needed, optimizing performance. The proxy acts as a stand-in for the real object and handles requests, such as creating an image only when it's time to draw it. This pattern hides the creation logic from the client, keeping the code clean and efficient.</p>", OrderIndex = 27, EstimatedMinutes = 5 },
                            new() { Title = "PROXY", ContentHtml = "<p>PROXY</p>", OrderIndex = 28, EstimatedMinutes = 5 },
                            new() { Title = "PROXY", ContentHtml = "<p>PROXY</p>
<p>Participants</p>
<p>Proxy (ImageProxy)</p>
<p>maintains a reference that lets the proxy access thereal subject. Proxymay refer to a Subject if the RealSubject and Subject interfaces are the same.</p>
<p>provides an interface identical to Subject's so that a proxy can by substituted for the real subject.</p>
<p>controls access to the real subject and may be responsible for creating and deleting it.</p>
<p>other responsibilities depend on the kind ofproxy:</p>
<p>remote proxies are", OrderIndex = 29, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, defines the interface of objects the factory method creates.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'implements theProduct interface....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "implements theProduct interface.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, declares the factory method, which returns an object oftype Product. Creator may also define a defau?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'may call the factory method to create a Product object....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "may call the factory method to create a Product object.", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "Behavioral Patterns",
                        Description = "CHAIN OF RESPONSIBILITY",
                        OrderIndex = 3,
                        EstimatedMinutes = 145,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Behavioral Patterns", ContentHtml = "<p>Behavioral Patterns</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "CHAIN OF RESPONSIBILITY", ContentHtml = "<p>CHAIN OF RESPONSIBILITY</p>
<p>IntentAvoid coupling the sender of a request to its receiver by giving more than oneobject a chance to handle the request. Chain the receiving objects and pass therequest along the chain until an object handles it.</p>
<p>Motivation:In a GUI with context-sensitive help, a help request triggered by a user (e.g., clicking a button) should be handled by the most specific component available. If none exists, the request should move up to a more general context (", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "CHAIN OF RESPONSIBILITY", ContentHtml = "<p>CHAIN OF RESPONSIBILITY</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "CHAIN OF RESPONSIBILITY", ContentHtml = "<p>CHAIN OF RESPONSIBILITY</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "CHAIN OF RESPONSIBILITY", ContentHtml = "<p>CHAIN OF RESPONSIBILITY</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "OBSERVER", ContentHtml = "<p>OBSERVER</p>
<p>Intent: Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.</p>
<p>Motivation:</p>
<p>A common side-effect of partitioning a system into a collection of cooperating classes is the need to maintain consistency between related objects.</p>
<p>When a change to one object requires changing others, and you don't know how many objects need to be changed.</p>
<p>When an object should be able", OrderIndex = 6, EstimatedMinutes = 5 },
                            new() { Title = "OBSERVER", ContentHtml = "<p>OBSERVER</p>", OrderIndex = 7, EstimatedMinutes = 5 },
                            new() { Title = "OBSERVER", ContentHtml = "<p>OBSERVER</p>", OrderIndex = 8, EstimatedMinutes = 5 },
                            new() { Title = "OBSERVER", ContentHtml = "<p>OBSERVER</p>", OrderIndex = 9, EstimatedMinutes = 5 },
                            new() { Title = "ITERATOR", ContentHtml = "<p>ITERATOR</p>
<p>Intent</p>
<p>Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.</p>
<p>Motivation:</p>
<p>A list should allow access to its elements without exposing its internal structure and support multiple traversal methods without complicating its interface.</p>
<p>The Iterator design pattern addresses this by separating the responsibility of accessing and traversing the list into a dedicated iterator object</p>", OrderIndex = 10, EstimatedMinutes = 5 },
                            new() { Title = "ITERATOR", ContentHtml = "<p>ITERATOR</p>
<p>For example, a List class would call for a Listlterator with the following relationship between them:</p>", OrderIndex = 11, EstimatedMinutes = 5 },
                            new() { Title = "ITERATOR", ContentHtml = "<p>ITERATOR</p>
<p>Use the Iterator pattern</p>
<p>to access an aggregate object's contents without exposing its internal representation.</p>
<p>to support multiple traversals of aggregateobjects.</p>
<p>to provide a uniform interface for traversing different aggregate structures(that is, to support polymorphic iteration).</p>", OrderIndex = 12, EstimatedMinutes = 5 },
                            new() { Title = "ITERATOR", ContentHtml = "<p>ITERATOR</p>", OrderIndex = 13, EstimatedMinutes = 5 },
                            new() { Title = "ITERATOR", ContentHtml = "<p>ITERATOR</p>", OrderIndex = 14, EstimatedMinutes = 5 },
                            new() { Title = "MEDIATOR", ContentHtml = "<p>MEDIATOR</p>
<p>Intent</p>
<p>Define an object that encapsulateshow a set of objects interact. Mediator promotesloose coupling by keeping objects from referring to each other explicitly, and itlets you vary their interaction independently</p>
<p>Motivation</p>
<p>In object-oriented design, tight coupling between objects can lead to complex, hard-to-maintain systems as behavior is distributed across many classes. Customizing such behavior often requires creating numerous subclasses. The Medi", OrderIndex = 15, EstimatedMinutes = 5 },
                            new() { Title = "MEDIATOR", ContentHtml = "<p>MEDIATOR</p>
<p>EX:</p>", OrderIndex = 16, EstimatedMinutes = 5 },
                            new() { Title = "MEDIATOR", ContentHtml = "<p>MEDIATOR</p>
<p>Participants</p>
<p>Mediator (DialogDirector)</p>
<p>defines an interface for communicating with Colleague objects.</p>
<p>ConcreteMediator (FontDialogDirector)</p>
<p>implements cooperative behavior bycoordinating Colleague objects.</p>
<p>knows andmaintains itscolleagues.</p>
<p>Colleague classes (ListBox, EntryField)</p>
<p>each Colleague class knows itsMediator object.</p>
<p>each colleague communicates with its mediator whenever it would have otherwise communicated with a", OrderIndex = 17, EstimatedMinutes = 5 },
                            new() { Title = "MEMENTO", ContentHtml = "<p>MEMENTO</p>
<p>Intent</p>
<p>Without violating encapsulation, capture and externalize an object's internal stateso that the object can be restored to this state later.</p>
<p>Motivation</p>
<p>Sometimes an object’s internal state needs to be saved and restored, such as when implementing undo functionality. However, exposing internal state directly would violate encapsulation. The Memento pattern solves this by allowing an object (the originator) to create a snapshot of its state (a memento) ", OrderIndex = 18, EstimatedMinutes = 5 },
                            new() { Title = "MEMENTO", ContentHtml = "<p>MEMENTO</p>
<p>Participants</p>
<p>Memento (SolverState)</p>
<p>stores internal state of the Originator object. The memento may store as much or as little of the originator's internal state as necessary at its originator's discretion.</p>
<p>protects against access by objects other than the originator. Mementos have effectively two interfaces. Caretaker sees a narrow interface to the Memento—it can only pass the memento to other objects. Originator, in contrast, sees a wide interface, one tha", OrderIndex = 19, EstimatedMinutes = 5 },
                            new() { Title = "STATE", ContentHtml = "<p>STATE</p>
<p>IntentAllow an object to alter its behavior when its internal state changes. The object will appear to change its class</p>
<p>Motivation Objects like TCPConnection may need to change their behavior depending on their internal state, such as Established, Closed, or Listening. Instead of using conditional logic, the State pattern delegates behavior to separate state objects, allowing the object to change its behavior dynamically by switching its internal state object. This promo", OrderIndex = 20, EstimatedMinutes = 5 },
                            new() { Title = "STATE", ContentHtml = "<p>STATE</p>
<p>Participants</p>
<p>Context (TCPConnection)</p>
<p>defines the interface ofinterest to clients.</p>
<p>maintains an instance ofa ConcreteState subclass that defines the current state.</p>
<p>State (TCPState)</p>
<p>defines an interface for encapsulating the behavior associated with a particular state of the Context.</p>
<p>ConcreteState subclasses (TCPEstablished, TCPListen, TCPClosed)</p>
<p>each subclass implements abehavior associated with a state oftheContext.</p>", OrderIndex = 21, EstimatedMinutes = 5 },
                            new() { Title = "STRATEGY", ContentHtml = "<p>STRATEGY</p>
<p>Intent</p>
<p>Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it</p>
<p>Motivation</p>
<p>Hard-wiring line-breaking algorithms into client classes makes them complex, inflexible, and harder to maintain. The Strategy pattern solves this by encapsulating each algorithm in a separate class, allowing clients like Composition to delegate the task to interchangeable Compositor ob", OrderIndex = 22, EstimatedMinutes = 5 },
                            new() { Title = "STRATEGY", ContentHtml = "<p>STRATEGY</p>
<p>Participants</p>
<p>Strategy (Compositor)</p>
<p>declares an interface common to all supported algorithms. Context uses this interface to call the algorithm defined by a ConcreteStrategy.</p>
<p>ConcreteStrategy (SimpleCompositor, TeXCompositor,ArrayCompositor)</p>
<p>implements the algorithm using theStrategy interface.</p>
<p>Context (Composition)</p>
<p>is configured with a ConcreteStrategy object.</p>
<p>maintains a reference to a Strategy object.</p>
<p>may define an inte", OrderIndex = 23, EstimatedMinutes = 5 },
                            new() { Title = "TEMPLATE METHOD", ContentHtml = "<p>TEMPLATE METHOD</p>
<p>Intent</p>
<p>Define the skeleton of an algorithm in an operation, deferring some steps tosubclasses.Template Method lets subclasses redefine certain steps of an algorithmwithout changing the algorithm's structure</p>
<p>Motivation</p>
<p>When an application needs to perform a standard algorithm but allows certain steps to vary, hardcoding those variations can reduce flexibility. The Template Method pattern addresses this by defining the overall algorithm in a base cl", OrderIndex = 24, EstimatedMinutes = 5 },
                            new() { Title = "TEMPLATE METHOD", ContentHtml = "<p>TEMPLATE METHOD</p>
<p>Participants</p>
<p>AbstractClass (Application)</p>
<p>defines abstract primitive operations that concrete subclasses define to implement steps of an algorithm.</p>
<p>implements a template method defining the skeleton ofan algorithm. The template method calls primitive operations as well as operations definedin AbstractClass or those of other objects.</p>
<p>ConcreteClass (MyApplication)</p>
<p>implements the primitive operations to carry out subclass-specific stepsof", OrderIndex = 25, EstimatedMinutes = 5 },
                            new() { Title = "VISITOR", ContentHtml = "<p>VISITOR</p>
<p>Intent</p>
<p>Represent an operation to be performed on the elements of an object structure.Visitor lets you define a new operation without changing the classes of the elementson which it operates</p>
<p>Motivation</p>
<p>When many operations need to be performed on a complex object structure like an abstract syntax tree, embedding all operations within the node classes makes the system hard to maintain and extend. The Visitor pattern solves this by separating the operations i", OrderIndex = 26, EstimatedMinutes = 5 },
                            new() { Title = "VISITOR", ContentHtml = "<p>VISITOR</p>", OrderIndex = 27, EstimatedMinutes = 5 },
                            new() { Title = "VISITOR", ContentHtml = "<p>VISITOR</p>
<p>Participants</p>
<p>Visitor (NodeVisitor)</p>
<p>declares a Visit operation for each class of ConcreteElement in the object structure. Theoperation's name and signature identifies the class that sends the Visit request to the visitor. That lets the visitor determine the concrete class of the element being visited. Then the visitor can access the element directly through its particularinterface.</p>
<p>ConcreteVisitor (TypeCheckingVisitor)</p>
<p>implements each operation declar", OrderIndex = 28, EstimatedMinutes = 5 },
                            new() { Title = "COMMAND", ContentHtml = "<p>COMMAND</p>
<p>Intent</p>
<p>Encapsulate a request as an object, thereby letting you parameterize clients withdifferent requests, queue or log requests, and support undoable operations.</p>
<p>Motivation</p>
<p>Sometimes it's necessary to issue requests without knowing the receiver or how the request will be performed. The Command pattern solves this by encapsulating requests as objects, allowing them to be passed, stored, or composed. This decouples the invoker from the receiver and enables", OrderIndex = 29, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Motivation:In a GUI with context-sensitive help, a help request triggered by a user (e.g., clicking?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Intent: Define a one-to-many dependency between objects so that when one object ...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Intent: Define a one-to-many dependency between objects so that when one object changes state", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, A common side-effect of partitioning a system into a collection of cooperating classes is the need t?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'When a change to one object requires changing others, and you don't know how man...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "When a change to one object requires changing others", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, When an object should be able to notify other objects without making assumptions about who these obj?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "COMMAND",
                        Description = "declares an interface for executing an operation.",
                        OrderIndex = 4,
                        EstimatedMinutes = 10,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "COMMAND", ContentHtml = "<p>COMMAND</p>
<p>Participants</p>
<p>Command</p>
<p>declares an interface for executing an operation.</p>
<p>ConcreteCommand (PasteCommand, OpenCommand)</p>
<p>defines a binding between a Receiver object and an action.</p>
<p>implements Execute by invoking the corresponding operation(s) on Receiver.</p>
<p>Client (Application)</p>
<p>creates a ConcreteCommand object andsets its receiver.</p>
<p>Invoker (Menultem)</p>
<p>asks the command to carry out the request.</p>
<p>Receiver (Document,Applic", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "CONCLUSION", ContentHtml = "<p>CONCLUSION</p>
<p>Design patterns provide reusable solutions to common design problems.</p>
<p>They improve software flexibility, maintainability, and communication.</p>
<p>Three categories: Creational, Structural, Behavioral.</p>
<p>Use patterns wisely to avoid unnecessary complexity.</p>
<p>Mastering patterns builds strong design skills for real-world software development.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, declares an interface for executing an operation.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'ConcreteCommand (PasteCommand, OpenCommand)...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "ConcreteCommand (PasteCommand", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, defines a binding between a Receiver object and an action.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'implements Execute by invoking the corresponding operation(s) on Receiver....'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "implements Execute by invoking the corresponding operation(s", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, creates a ConcreteCommand object andsets its receiver.?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
            new()
            {
                Title = "SWD392 GenAI",
                Subtitle = "Generative AI in software engineering: code generation, testing, and prompt engineering",
                Description = "Applying AI in Software Architecture and Design. Objective: Guide students in using AI tools to support software system design and select appropriate architecture.. Key Tools: ChatGPT, GitHub Copilot,",
                ColorHex = "#06B6D4",
                IconName = "bi-robot",
                Level = CourseLevel.Intermediate,
                OrderIndex = 23,
                SlideFileName = "SWD392_GenAI.pptx",
                Chapters = new List<Chapter>
                {
                    new()
                    {
                        Title = "Applying AI in Software Architecture and Design",
                        Description = "Applying AI in Software Architecture and Design",
                        OrderIndex = 1,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "Applying AI in Software Architecture and Design", ContentHtml = "<p>Applying AI in Software Architecture and Design</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "INTRODUCTION", ContentHtml = "<p>INTRODUCTION</p>
<p>Objective: Guide students in using AI tools to support software system design and select appropriate architecture.</p>
<p>Key Tools: ChatGPT, GitHub Copilot, PlantUML</p>
<p>Related CLOs: CLO3, CLO4, CLO6</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Tools: ChatGPT, PlantUML, GitHub Copilot", ContentHtml = "<p>Tools: ChatGPT, PlantUML, GitHub Copilot</p>
<p>ChatGPT : https://chatgpt.com/</p>
<p>PlantUML: https://www.plantuml.com/</p>
<p>GitHub Copilot: https://github.com/copilot</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Analysis and Modeling with AI (Support Session 10)", ContentHtml = "<p>Use Case Analysis and Modeling with AI (Support Session 10)</p>
<p>ChatGPT:</p>
<p>Ask for suggestions on Actors and main Use Cases from a system description</p>
<p>Generate Use Case descriptions (brief, main flow, alternate flow) from input requirements</p>
<p>Suggest functionality based on business-related keywords</p>
<p>PlantUML:</p>
<p>Generate Use Case diagrams from text descriptions or ChatGPT outputs</p>
<p>Demo (illustrative slide):</p>
<p>Input: “Library management system with funct", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Analysis and Modeling with AI", ContentHtml = "<p>Use Case Analysis and Modeling with AI</p>
<p>Sample Prompt for ChatGPT:</p>
<p>Prompt 1: “As a software system designer, I need to design a library management system with the following functionalities:</p>
<p>Users can log in, search for books, borrow, and return them</p>
<p>Librarians can manage books and user accounts</p>
<p>Please help identify the Actors and major Use Cases.”</p>
<p>=> Let students explain the rationale behind the identified actors and use cases.</p>
<p>Prompt 2:  Write ", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Use Case Analysis and Modeling with AI", ContentHtml = "<p>Use Case Analysis and Modeling with AI</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Applying AI in Software Architecture and Design?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Objective: Guide students in using AI tools to support software system design an...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Objective: Guide students in using AI tools to support softw", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'GitHub Copilot: https://github.com/copilot...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "GitHub Copilot: https://github.com/copilot", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Use Case Analysis and Modeling with AI (Support Session 10)?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "AI-Supported System Design.",
                        Description = "AI-Supported System Design.",
                        OrderIndex = 2,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "AI-Supported System Design.", ContentHtml = "<p>AI-Supported System Design.</p>
<p>ChatGPT:</p>
<p>Suggest architectural structure based on style (Layered, MVC, Microservice, etc.)</p>
<p>Generate block-based system descriptions (Component Diagram, Deployment Diagram)</p>
<p>Assist in analyzing trade-offs between different architectural styles</p>
<p>PlantUML:</p>
<p>Quickly draw architecture diagrams (Component, Deployment)</p>
<p>Copilot:</p>
<p>Generate code templates for architectural components</p>
<p>Demo:</p>
<p>Input: “Design a Lay", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "AI-Supported System Design.", ContentHtml = "<p>AI-Supported System Design.</p>
<p>Sample Prompt for ChatGPT:</p>
<p>Help me design a 3-layered architecture for an online shopping system.</p>
<p>Layers: Presentation, Business, Data Access.</p>
<p>List key components and describe the role of each layer. Then generate a UML component diagram.</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "AI-Supported System Design.", ContentHtml = "<p>AI-Supported System Design.</p>
<p>Copy the PlantUML code to generate the diagram.</p>", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "AI-Supported System Design.", ContentHtml = "<p>AI-Supported System Design.</p>
<p>Use GitHub Copilot to:</p>
<p>Quickly generate Service and DAO classes</p>
<p>Auto-complete common methods (CRUD)</p>
<p>Support code generation following popular design patterns (Service, Repository, Dependency Injection...)</p>", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "AI Suggestions for Design Patterns", ContentHtml = "<p>AI Suggestions for Design Patterns</p>
<p>ChatGPT:</p>
<p>Ask: “Which pattern fits Use Case A?”</p>
<p>Suggest patterns that fit specific functionalities (e.g., Singleton for Logging, Strategy for Payment, etc.)</p>
<p>Generate sample code for specific patterns</p>
<p>Copilot:</p>
<p>Automatically generate pattern code when comments are written (e.g., “// Singleton pattern for configuration”)</p>
<p>Demo:</p>
<p>Input: “Design a flexible payment processing module that supports multiple method", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "AI Suggestions for Design Patterns", ContentHtml = "<p>AI Suggestions for Design Patterns</p>
<p>'The system supports multiple payment methods (Momo, ZaloPay, Credit Card). It must be easily extensible.“</p>
<p>Sample Prompt for ChatGPT:</p>
<p>I'm designing a payment system that can flexibly support different payment methods. Which Design Pattern should I use? Please explain and provide an example in Java.</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "According to the chapter, Suggest architectural structure based on style (Layered, MVC, Microservice, etc.)?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 1,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Generate block-based system descriptions (Component Diagram, Deployment Diagram)...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Generate block-based system descriptions (Component Diagram", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Assist in analyzing trade-offs between different architectural styles?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Quickly draw architecture diagrams (Component, Deployment)...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Quickly draw architecture diagrams (Component", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Generate code templates for architectural components?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                    new()
                    {
                        Title = "AI Suggestions for Design Patterns",
                        Description = "AI Suggestions for Design Patterns",
                        OrderIndex = 3,
                        EstimatedMinutes = 30,
                        Lessons = new List<Lesson>
                        {
                            new() { Title = "AI Suggestions for Design Patterns", ContentHtml = "<p>AI Suggestions for Design Patterns</p>", OrderIndex = 1, EstimatedMinutes = 5 },
                            new() { Title = "AI Suggestions for Design Patterns", ContentHtml = "<p>AI Suggestions for Design Patterns</p>", OrderIndex = 2, EstimatedMinutes = 5 },
                            new() { Title = "Using AI to Select an Appropriate Architecture", ContentHtml = "<p>Using AI to Select an Appropriate Architecture</p>
<p>Describe the System Requirements</p>
<p>Sample Prompt for ChatGPT:</p>
<p>I am designing a real-time chat application with high concurrency, scalability, and fast message delivery. What architectural style do you recommend and why?</p>
<p>Use AI to Compare Architecture Styles</p>
<p>Sample Prompt for ChatGPT:</p>
<p>Compare Microservices, Layered Architecture, and Event-Driven Architecture for an online shopping system.  List pros and cons", OrderIndex = 3, EstimatedMinutes = 5 },
                            new() { Title = "Using AI to Select an Appropriate Architecture", ContentHtml = "<p>Using AI to Select an Appropriate Architecture</p>
<p>Case study:</p>
<p>You are assigned to design an Online Food Delivery System with the following requirements:</p>
<p>Functional Requirements:</p>
<p>Users can browse menus, place orders, and track orders in real time</p>
<p>Restaurants receive and prepare orders</p>
<p>Delivery drivers accept delivery tasks and update status</p>
<p>The system sends live order status updates to users</p>
<p>Non-Functional Requirements:</p>
<p>The system mus", OrderIndex = 4, EstimatedMinutes = 5 },
                            new() { Title = "Using AI to Select an Appropriate Architecture", ContentHtml = "<p>Using AI to Select an Appropriate Architecture</p>
<p>Use AI (e.g., ChatGPT) to recommend a suitable software architecture for the system</p>
<p>Explain why that architecture is appropriate</p>
<p>Ask the AI to compare at least two architectures (e.g., Microservices vs Layered)</p>
<p>Request a PlantUML Component Diagram for the recommended architecture</p>
<p>Identify and suggest appropriate Design Patterns for key components (e.g., payment, notification, delivery assignment)</p>", OrderIndex = 5, EstimatedMinutes = 5 },
                            new() { Title = "Conclusion", ContentHtml = "<p>Conclusion</p>
<p>Conclusion</p>
<p>AI is a supportive assistant, not a replacement for the designer</p>
<p>AI outputs need validation and refinement</p>
<p>Integrating AI helps students think more systematically and work more efficiently</p>", OrderIndex = 6, EstimatedMinutes = 5 },
                        },
                        QuizQuestions = new List<QuizQuestion>
                        {
                            new()
                            {
                                QuestionText = "What is described by: 'AI Suggestions for Design Patterns...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 2,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "AI Suggestions for Design Patterns", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, Using AI to Select an Appropriate Architecture?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 3,
                                Points = 2,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "What is described by: 'Describe the System Requirements...'?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 4,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "Describe the System Requirements", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "An unrelated concept", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A different approach", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "A variation of the topic", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                            new()
                            {
                                QuestionText = "According to the chapter, I am designing a real-time chat application with high concurrency, scalability, and fast message del?",
                                Type = QuestionType.MultipleChoice,
                                Difficulty = QuizDifficulty.Medium,
                                OrderIndex = 5,
                                Points = 1,
                                Options = new List<QuizOption>
                                {
                                    new() { OptionText = "True", IsCorrect = true, OrderIndex = 1 },
                                    new() { OptionText = "False", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "Not mentioned", IsCorrect = false, OrderIndex = 1 },
                                    new() { OptionText = "The opposite is true", IsCorrect = false, OrderIndex = 1 },
                                }
                            },
                        }
                    },
                }
            },
        };
        return courses;
    }
}