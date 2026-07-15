export interface ScreenHintData {
  hints?: string[];
  solution?: string;
  correct?: any;
  correctSet?: number[];
  options?: string[];
}

/**
 * Returns the appropriate hint text based on the attempt count.
 */
export function getHintForAttempt(
  screen: ScreenHintData,
  attempts: number
): { text: string; level: number } | null {
  const hints = screen.hints || [];
  
  if (attempts === 1) {
    return {
      text: hints[0] || "Hãy quan sát kỹ yêu cầu và thử lại một lần nữa.",
      level: 1,
    };
  }
  
  if (attempts === 2) {
    return {
      text: hints[1] || "Gợi ý: Một số phương án sai đã bị vô hiệu hóa để giúp bạn thu hẹp lựa chọn.",
      level: 2,
    };
  }
  
  if (attempts >= 3) {
    return {
      text: screen.solution || "Đây là lời giải chi tiết cho câu hỏi này.",
      level: 3,
    };
  }
  
  return null;
}

/**
 * Identifies which option index to disable for single-choice/scenario questions
 * when they have failed twice (attempts >= 2).
 */
export function getDisabledDistractors(
  screen: ScreenHintData,
  attempts: number
): number[] {
  if (attempts < 2 || !screen.options || screen.correct === undefined) {
    return [];
  }
  
  const correctIdx = Number(screen.correct);
  const disabledList: number[] = [];

  // Find the first incorrect option and disable it
  for (let i = 0; i < screen.options.length; i++) {
    if (i !== correctIdx) {
      disabledList.push(i);
      break; // Only disable 1 distractor
    }
  }

  return disabledList;
}
