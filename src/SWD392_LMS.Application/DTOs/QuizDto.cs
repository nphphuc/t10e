namespace SWD392_LMS.Application.DTOs;

public class QuizQuestionDto
{
    public int Id { get; set; }
    public int ChapterId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string? Explanation { get; set; }
    public string Type { get; set; } = "MultipleChoice";
    public string Difficulty { get; set; } = "Easy";
    public int OrderIndex { get; set; }
    public int Points { get; set; } = 1;
    public List<QuizOptionDto> Options { get; set; } = new();
}

public class QuizOptionDto
{
    public int Id { get; set; }
    public int QuizQuestionId { get; set; }
    public string OptionText { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
}

public class QuizSubmitDto
{
    public int ChapterId { get; set; }
    public List<QuestionAnswerDto> Answers { get; set; } = new();
}

public class QuestionAnswerDto
{
    public int QuestionId { get; set; }
    public List<int> SelectedOptionIds { get; set; } = new();
}

public class QuizResultDto
{
    public int ChapterId { get; set; }
    public string ChapterTitle { get; set; } = string.Empty;
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public double ScorePercent { get; set; }
    public bool IsPassed { get; set; }
    public int AttemptId { get; set; }
    public List<QuestionResultDto> QuestionResults { get; set; } = new();
}

public class QuestionResultDto
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public string? Explanation { get; set; }
    public List<int> SelectedOptionIds { get; set; } = new();
    public List<int> CorrectOptionIds { get; set; } = new();
}
