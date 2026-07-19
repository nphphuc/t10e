export interface ScreenState {
  id: string;
  role: 'hook' | 'explore' | 'feedback' | 'contrast' | 'apply' | 'transfer' | 'retrieve' | 'takeaway';
  type: string;
  weight?: number;
}

/** teach screens are never scored — they're learning moments, not assessment */
export function isGradedScreen(screen: ScreenState): boolean {
  if (screen.type === 'teach' || screen.type === 'takeaway') return false;
  if (screen.weight === 0) return false;
  return true;
}

export interface AnswerState {
  correct: boolean;
  attempts: number;
  hintsUsed: number;
  revealed: boolean;
}

export interface ScoreResult {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  isMastered: boolean;
  xpEarned: number;
}

/**
 * Gets the weight of a screen based on its role if not explicitly set in JSON
 */
export function getScreenWeight(screen: ScreenState): number {
  if (screen.weight !== undefined) {
    return screen.weight;
  }
  switch (screen.role) {
    case 'transfer':
      return 3;
    case 'retrieve':
      return 1;
    case 'takeaway':
      return 0; // Takeaways don't score points
    default:
      return 2; // Core concepts
  }
}

/**
 * Calculates the score, mastery status, and XP earned for a lesson
 */
export function calculateLessonScore(
  screens: ScreenState[],
  answers: Record<string, AnswerState>,
  lessonXp: number
): ScoreResult {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let transferSuccess = true;

  // Filter out teach + takeaway + weight:0 — they are learning moments, not assessment
  const scoreableScreens = screens.filter(isGradedScreen);

  scoreableScreens.forEach((screen) => {
    const weight = getScreenWeight(screen);
    maxPossibleScore += weight;

    const answer = answers[screen.id];
    if (answer) {
      // Correct before reveal (not revealed)
      if (answer.correct && !answer.revealed) {
        totalScore += weight;
      }
      
      // If it is a transfer item, check if it was answered correctly with <= 2 hints (which means attempts <= 3)
      if (screen.role === 'transfer') {
        if (!answer.correct || answer.revealed || answer.hintsUsed > 2) {
          transferSuccess = false;
        }
      }
    } else {
      if (screen.role === 'transfer') {
        transferSuccess = false;
      }
    }
  });

  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  
  // Mastery rule: score >= 80% AND transfer item was answered correctly with <= 2 hints
  const isMastered = percentage >= 80 && transferSuccess;

  // Gamification: Mastered -> 100% XP, Not Mastered -> 50% XP
  const xpEarned = isMastered ? lessonXp : Math.round(lessonXp * 0.5);

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    isMastered,
    xpEarned,
  };
}
