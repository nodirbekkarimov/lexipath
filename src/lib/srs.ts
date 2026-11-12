/**
 * SuperMemo SM-2 Spaced Repetition Algorithm (Enhanced Production Implementation)
 * Computes optimal memory review intervals based on learner recall performance,
 * with strict Tashkent timezone handling and mastery transitions.
 */

export type SRSRating = 0 | 1 | 2 | 3 | 4 | 5; 
// 0: Complete blackout
// 1: Incorrect response; the correct one remembered
// 2: Incorrect response; where the correct one seemed easy to recall
// 3: Correct response recalled with serious difficulty
// 4: Correct response after a hesitation
// 5: Perfect recall

export interface SRSState {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
}

export interface SRSResult extends SRSState {
  dueDate: string; // ISO date string (YYYY-MM-DD)
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
}

/**
 * Get current date string in Tashkent (or specified) timezone formatted as YYYY-MM-DD.
 * Prevents UTC midnight boundary displacement.
 */
export function getLocalISODate(timezone = 'Asia/Tashkent', offsetDays = 0): string {
  const targetDate = new Date();
  if (offsetDays !== 0) {
    targetDate.setDate(targetDate.getDate() + offsetDays);
  }
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(targetDate);
  } catch {
    // Fallback if timezone not recognized
    return targetDate.toISOString().split('T')[0];
  }
}

/**
 * Calculates next SM-2 interval, ease factor, repetition count, and target due date.
 */
export function calculateSM2(
  current: SRSState,
  rating: SRSRating,
  timezone = 'Asia/Tashkent'
): SRSResult {
  let { repetitions, intervalDays, easeFactor } = current;

  // Validate and clamp incoming values to safe ranges
  repetitions = Math.max(0, repetitions || 0);
  intervalDays = Math.max(1, intervalDays || 1);
  easeFactor = Math.max(1.3, easeFactor || 2.5);

  if (rating < 3) {
    // Failed recall: reset repetitions to zero and review tomorrow
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Successful recall
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const delta = 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02);
  easeFactor = Math.max(1.3, easeFactor + delta);
  // Round to 2 decimal places for clean storage
  easeFactor = Math.round(easeFactor * 100) / 100;

  // Calculate due date in Tashkent timezone
  const dueDate = getLocalISODate(timezone, intervalDays);

  // Determine mastery status
  let status: 'new' | 'learning' | 'reviewing' | 'mastered' = 'learning';
  if (repetitions >= 5 || intervalDays >= 21) {
    status = 'mastered';
  } else if (repetitions >= 2 || intervalDays >= 6) {
    status = 'reviewing';
  } else {
    status = 'learning';
  }

  return {
    repetitions,
    intervalDays,
    easeFactor,
    dueDate,
    status,
  };
}

/**
 * Maps simple UI button choices (Again, Hard, Good, Easy) to SM-2 ratings
 */
export function mapChoiceToRating(choice: 'again' | 'hard' | 'good' | 'easy'): SRSRating {
  switch (choice) {
    case 'again': return 1;
    case 'hard': return 3;
    case 'good': return 4;
    case 'easy': return 5;
  }
}
