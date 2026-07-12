import json
import os

# Read extracted slide content
with open("slide_content.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Course metadata: icons, colors, levels based on actual content
course_meta = {
    "Ch01_Introduction.pptx": {"icon": "bi-laptop", "color": "#6366F1", "level": "CourseLevel.Beginner", "subtitle": "Foundations of software engineering and the COMET/UML approach"},
    "Ch02_Overview of UML Notation.pptx": {"icon": "bi-diagram-3", "color": "#8B5CF6", "level": "CourseLevel.Beginner", "subtitle": "Standardized graphical language for describing object-oriented models"},
    "Ch03_Software Life Cycle Models and Processes.pptx": {"icon": "bi-arrow-repeat", "color": "#EC4899", "level": "CourseLevel.Beginner", "subtitle": "Waterfall, prototyping, incremental, spiral, and RUP process models"},
    "Ch04_Software Design and Architecture Concepts.pptx": {"icon": "bi-puzzle", "color": "#F59E0B", "level": "CourseLevel.Intermediate", "subtitle": "OO concepts, concurrency, design patterns, and quality attributes"},
    "Ch05_Overview of Software Modeling & Design Methods.pptx": {"icon": "bi-eye", "color": "#14B8A6", "level": "CourseLevel.Intermediate", "subtitle": "COMET use case-driven iterative object-oriented method"},
    "Ch06_Use Case Modeling.pptx": {"icon": "bi-person-check", "color": "#06B6D4", "level": "CourseLevel.Intermediate", "subtitle": "Requirements modeling with actors, use cases, and activity diagrams"},
    "Ch07_Static Modeling.pptx": {"icon": "bi-columns-gap", "color": "#3B82F6", "level": "CourseLevel.Intermediate", "subtitle": "Class diagrams, associations, composition, aggregation, and generalization hierarchies"},
    "Ch08_Object and Class Structuring.pptx": {"icon": "bi-boxes", "color": "#10B981", "level": "CourseLevel.Intermediate", "subtitle": "Categorizing software objects: boundary, entity, control, and application logic classes"},
    "Ch09-11_Dynamic Modeling.pptx": {"icon": "bi-graph-up", "color": "#EF4444", "level": "CourseLevel.Intermediate", "subtitle": "Interaction modeling with communication and sequence diagrams, finite state machines"},
    "Ch12_Overview of Software Architecture.pptx": {"icon": "bi-layers", "color": "#6366F1", "level": "CourseLevel.Intermediate", "subtitle": "Component-based architecture, architectural patterns, and interface design"},
    "Ch13_Software Subsystem Architectural Design.pptx": {"icon": "bi-diagram-2", "color": "#8B5CF6", "level": "CourseLevel.Advanced", "subtitle": "Decomposing systems into subsystems, separation of concerns, and communication design"},
    "Ch14_Designing Object-Oriented Software Architectures.pptx": {"icon": "bi-box", "color": "#EC4899", "level": "CourseLevel.Advanced", "subtitle": "Detailed design of object-oriented architectures using COMET"},
    "Ch15_Designing Client Server Software Architectures.pptx": {"icon": "bi-hdd-network", "color": "#F59E0B", "level": "CourseLevel.Advanced", "subtitle": "Client/server design with distributed subsystems and message communication"},
    "Ch16_Designing Service-Oriented Architectures.pptx": {"icon": "bi-cloud", "color": "#10B981", "level": "CourseLevel.Advanced", "subtitle": "SOA concepts, service design, orchestration, and choreography"},
    "Ch17_Designing Component-Based Software Architectures.pptx": {"icon": "bi-cpu", "color": "#06B6D4", "level": "CourseLevel.Advanced", "subtitle": "Component-based development, component interfaces, and middleware"},
    "Ch18_Designing Concurrent and Real-Time Software Architectures.pptx": {"icon": "bi-speedometer", "color": "#EF4444", "level": "CourseLevel.Advanced", "subtitle": "Concurrent processing, real-time design, and performance analysis"},
    "Ch20_Software Quality Attributes.pptx": {"icon": "bi-star", "color": "#14B8A6", "level": "CourseLevel.Advanced", "subtitle": "Non-functional requirements: security, modifiability, performance, and more"},
    "Ch21_Client Server Software Architecture Case Study-Banking System.pptx": {"icon": "bi-bank", "color": "#3B82F6", "level": "CourseLevel.Advanced", "subtitle": "Real-world banking system designed with client-server architecture"},
    "Ch22_SOA Case Study-Online Shopping System.pptx": {"icon": "bi-cart3", "color": "#14B8A6", "level": "CourseLevel.Advanced", "subtitle": "Service-oriented architecture applied to e-commerce"},
    "Ch23_Component-Based Software Arch_Case Study Emergency Monitoring System.pptx": {"icon": "bi-exclamation-triangle", "color": "#F59E0B", "level": "CourseLevel.Advanced", "subtitle": "Emergency monitoring system using component-based architecture"},
    "Ch24_Real-Time Software Arch_Case Study Automated Guided Vehicle System.pptx": {"icon": "bi-truck", "color": "#EC4899", "level": "CourseLevel.Advanced", "subtitle": "Automated guided vehicle system with real-time architecture"},
    "SWD392_Design Partern.pptx": {"icon": "bi-collection", "color": "#EF4444", "level": "CourseLevel.Intermediate", "subtitle": "Creational, structural, and behavioral design patterns"},
    "SWD392_GenAI.pptx": {"icon": "bi-robot", "color": "#06B6D4", "level": "CourseLevel.Intermediate", "subtitle": "Generative AI in software engineering: code generation, testing, and prompt engineering"}
}

def escape_cs(s):
    """Escape string for C# verbatim string"""
    if not s:
        return ""
    s = s.replace('"', "'")
    s = s.replace('\\', '\\\\')
    return s

def generate_courses():
    output = []
    
    order = 1
    for entry in data:
        filename = entry["filename"]
        title_clean = filename.replace(".pptx", "").replace("_", " ").replace("Ch", "Chapter ")
        meta = course_meta.get(filename, {"icon": "bi-laptop", "color": "#6366F1", "level": "CourseLevel.Beginner", "subtitle": ""})
        
        # Collect slide texts
        all_texts = []
        for slide in entry["slides"]:
            for t in slide["texts"]:
                if t.strip():
                    all_texts.append(t.strip())
        
        # Create description from first few meaningful texts
        desc_lines = []
        for t in all_texts[:8]:
            if len(t) > 30 and not t.startswith("Software Design") and "Main Contents" not in t:
                desc_lines.append(escape_cs(t))
        desc = ". ".join(desc_lines[:3]) if desc_lines else f"Study {title_clean}"
        
        # Build chapters from slides (group slides into logical chapters)
        slides = entry["slides"]
        chapters_html = []
        chapter_idx = 0
        
        # Find slide groupings (by topic)
        # Group every 3-5 slides into a chapter
        chapter_size = max(3, len(slides) // 3) if len(slides) > 3 else 3
        
        for i in range(0, len(slides), chapter_size):
            chapter_slides = slides[i:i+chapter_size]
            chapter_idx += 1
            
            # Get chapter title from first slide
            ch_title = f"Part {chapter_idx}"
            if chapter_slides and chapter_slides[0]["texts"]:
                for t in chapter_slides[0]["texts"]:
                    if len(t) > 5 and "Software Design" not in t and "Ch" not in t and "Main Contents" not in t:
                        ch_title = escape_cs(t[:80])
                        break
            
            # Build chapter description
            ch_desc_lines = []
            for slide in chapter_slides:
                for t in slide["texts"]:
                    txt = t.strip()
                    if txt and len(txt) > 20 and "Software Design" not in txt and "Ch" not in txt:
                        ch_desc_lines.append(escape_cs(txt[:150]))
            ch_desc = ch_desc_lines[0] if ch_desc_lines else f"Explore {ch_title}"
            
            # Build lesson HTML content
            lessons_html = []
            lesson_idx = 0
            for slide in chapter_slides:
                slide_texts = [escape_cs(t) for t in slide["texts"] if t.strip() and "Software Design" not in t and "swD392" not in t.lower()]
                if not slide_texts:
                    continue
                    
                lesson_idx += 1
                lesson_title = slide_texts[0][:60] if slide_texts else f"Slide {slide['slide_number']}"
                
                # Build learning content from the slide
                content_parts = []
                for txt in slide_texts:
                    if len(txt) > 0:
                        content_parts.append(f"<p>{txt}</p>")
                
                content_html = "\n".join(content_parts) if content_parts else "<p>No content available.</p>"
                lessons_html.append((lesson_title, content_html, lesson_idx))
            
            # Generate quiz questions from content (pick key concepts)
            quiz_items = generate_quiz(ch_title, chapter_slides)
            
            chapters_html.append({
                "title": ch_title,
                "desc": ch_desc,
                "order": chapter_idx,
                "minutes": len(lessons_html) * 5,
                "lessons": lessons_html,
                "quiz": quiz_items
            })
        
        output.append({
            "filename": filename,
            "title": title_clean,
            "subtitle": meta["subtitle"],
            "desc": desc,
            "icon": meta["icon"],
            "color": meta["color"],
            "level": meta["level"],
            "order": order,
            "chapters": chapters_html
        })
        
        order += 1
    
    return output

def generate_quiz(ch_title, slides):
    """Generate quiz questions from slide content"""
    questions = []
    q_idx = 0
    
    # Collect all meaningful statements
    statements = []
    for slide in slides:
        for t in slide["texts"]:
            txt = t.strip()
            if txt and len(txt) > 30 and "Software Design" not in txt and "Ch" not in txt:
                statements.append(escape_cs(txt))
    
    # Create True/False and multiple choice questions from statements
    used = set()
    for s in statements[:5]:  # Max 5 questions per chapter
        q_idx += 1
        # Create a "what is" question from a definition
        if q_idx % 2 == 0:
            q_text = f"What is described by: '{s[:80]}...'?"
            options = [
                (s.split(",")[0] if "," in s else s[:60], True),
                (f"An unrelated concept", False),
                (f"A different approach", False),
                (f"A variation of the topic", False)
            ]
        else:
            # Extract a key term from the statement
            words = s.split()
            if len(words) > 5:
                term = words[0] if words[0].endswith(":") else words[1] if len(words) > 1 else "It"
                q_text = f"According to the chapter, {s[:100]}?"
                options = [
                    ("True", True),
                    ("False", False),
                    ("Not mentioned", False),
                    ("The opposite is true", False)
                ]
            else:
                continue
        
        questions.append({
            "text": q_text,
            "points": 2 if q_idx % 3 == 0 else 1,
            "order": q_idx,
            "options": options
        })
    
    return questions

# Generate all course data
courses_data = generate_courses()

# Write the seed data file
output_lines = []
output_lines.append("using Microsoft.AspNetCore.Identity;")
output_lines.append("using Microsoft.EntityFrameworkCore;")
output_lines.append("using Microsoft.Extensions.DependencyInjection;")
output_lines.append("using SWD392_LMS.Domain.Entities;")
output_lines.append("using SWD392_LMS.Domain.Enums;")
output_lines.append("")
output_lines.append("namespace SWD392_LMS.Infrastructure.Data;")
output_lines.append("")
output_lines.append("public static class SeedData")
output_lines.append("{")
output_lines.append("    public static async Task InitializeAsync(IServiceProvider serviceProvider)")
output_lines.append("    {")
output_lines.append("        using var scope = serviceProvider.CreateScope();")
output_lines.append("        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();")
output_lines.append("        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();")
output_lines.append("        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();")
output_lines.append("")
output_lines.append("        await context.Database.EnsureCreatedAsync();")
output_lines.append("")
output_lines.append("        if (!await roleManager.RoleExistsAsync(\"Admin\"))")
output_lines.append("            await roleManager.CreateAsync(new IdentityRole(\"Admin\"));")
output_lines.append("        if (!await roleManager.RoleExistsAsync(\"User\"))")
output_lines.append("            await roleManager.CreateAsync(new IdentityRole(\"User\"));")
output_lines.append("")
output_lines.append("        if (await userManager.FindByEmailAsync(\"admin@swd392.com\") == null)")
output_lines.append("        {")
output_lines.append("            var admin = new ApplicationUser")
output_lines.append("            {")
output_lines.append("                UserName = \"admin\",")
output_lines.append("                Email = \"admin@swd392.com\",")
output_lines.append("                FullName = \"Admin\",")
output_lines.append("                CreatedAt = DateTime.UtcNow")
output_lines.append("            };")
output_lines.append("            var result = await userManager.CreateAsync(admin, \"Admin@123\");")
output_lines.append("            if (result.Succeeded)")
output_lines.append("                await userManager.AddToRoleAsync(admin, \"Admin\");")
output_lines.append("        }")
output_lines.append("")
output_lines.append("        if (await userManager.FindByEmailAsync(\"demo@swd392.com\") == null)")
output_lines.append("        {")
output_lines.append("            var demoUser = new ApplicationUser")
output_lines.append("            {")
output_lines.append("                UserName = \"demo\",")
output_lines.append("                Email = \"demo@swd392.com\",")
output_lines.append("                FullName = \"Demo Learner\",")
output_lines.append("                Bio = \"SWD392 student exploring software design and architecture.\",")
output_lines.append("                CreatedAt = DateTime.UtcNow")
output_lines.append("            };")
output_lines.append("            var result = await userManager.CreateAsync(demoUser, \"Demo@123\");")
output_lines.append("            if (result.Succeeded)")
output_lines.append("                await userManager.AddToRoleAsync(demoUser, \"User\");")
output_lines.append("        }")
output_lines.append("")
output_lines.append("        if (!await context.Courses.AnyAsync())")
output_lines.append("        {")
output_lines.append("            var courses = GetSeedCourses();")
output_lines.append("            context.Courses.AddRange(courses);")
output_lines.append("            await context.SaveChangesAsync();")
output_lines.append("        }")
output_lines.append("    }")
output_lines.append("")
output_lines.append("    private static List<Course> GetSeedCourses()")
output_lines.append("    {")
output_lines.append("        var courses = new List<Course>")
output_lines.append("        {")

for c in courses_data:
    output_lines.append(f"            new()")
    output_lines.append(f"            {{")
    output_lines.append(f"                Title = \"{c['title']}\",")
    output_lines.append(f"                Subtitle = \"{c['subtitle']}\",")
    output_lines.append(f"                Description = \"{c['desc'][:200]}\",")
    output_lines.append(f"                ColorHex = \"{c['color']}\",")
    output_lines.append(f"                IconName = \"{c['icon']}\",")
    output_lines.append(f"                Level = {c['level']},")
    output_lines.append(f"                OrderIndex = {c['order']},")
    output_lines.append(f"                SlideFileName = \"{c['filename']}\",")
    output_lines.append(f"                Chapters = new List<Chapter>")
    output_lines.append(f"                {{")
    
    for ch in c["chapters"]:
        output_lines.append(f"                    new()")
        output_lines.append(f"                    {{")
        output_lines.append(f"                        Title = \"{ch['title'][:100]}\",")
        output_lines.append(f"                        Description = \"{ch['desc'][:150]}\",")
        output_lines.append(f"                        OrderIndex = {ch['order']},")
        output_lines.append(f"                        EstimatedMinutes = {ch['minutes']},")
        output_lines.append(f"                        Lessons = new List<Lesson>")
        output_lines.append(f"                        {{")
        
        for lesson in ch["lessons"]:
            lesson_title = lesson[0][:100]
            lesson_html = lesson[1].replace('"', "'")
            output_lines.append(f"                            new() {{ Title = \"{lesson_title}\", ContentHtml = \"{lesson_html[:500]}\", OrderIndex = {lesson[2]}, EstimatedMinutes = 5 }},")
        
        output_lines.append(f"                        }},")
        
        if ch["quiz"]:
            output_lines.append(f"                        QuizQuestions = new List<QuizQuestion>")
            output_lines.append(f"                        {{")
            for q in ch["quiz"]:
                qtext = q["text"][:150].replace('"', "'")
                output_lines.append(f"                            new()")
                output_lines.append(f"                            {{")
                output_lines.append(f"                                QuestionText = \"{qtext}\",")
                output_lines.append(f"                                Type = QuestionType.MultipleChoice,")
                output_lines.append(f"                                Difficulty = QuizDifficulty.Medium,")
                output_lines.append(f"                                OrderIndex = {q['order']},")
                output_lines.append(f"                                Points = {q['points']},")
                output_lines.append(f"                                Options = new List<QuizOption>")
                output_lines.append(f"                                {{")
                for opt in q["options"]:
                    opt_text = opt[0][:120].replace('"', "'")
                    is_correct = "true" if opt[1] else "false"
                    output_lines.append(f"                                    new() {{ OptionText = \"{opt_text}\", IsCorrect = {is_correct}, OrderIndex = 1 }},")
                output_lines.append(f"                                }}")
                output_lines.append(f"                            }},")
            output_lines.append(f"                        }}")
        
        output_lines.append(f"                    }},")
    
    output_lines.append(f"                }}")
    output_lines.append(f"            }},")

output_lines.append("        };")
output_lines.append("        return courses;")
output_lines.append("    }")
output_lines.append("}")

# Write the output
result = "\n".join(output_lines)
with open("SeedData_Generated.cs", "w", encoding="utf-8") as f:
    f.write(result)

print(f"[DONE] Generated SeedData_Generated.cs")
print(f"Total courses: {len(courses_data)}")
for c in courses_data:
    print(f"  - {c['title']}: {len(c['chapters'])} chapters")
