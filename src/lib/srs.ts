/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 * Computes optimal memory review intervals based on learner recall performance.
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
}

export function calculateSM2(
  current: SRSState,
  rating: SRSRating
): SRSResult {
  let { repetitions, intervalDays, easeFactor } = current;

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
  // Round to 2 decimal places for clean persistence
  easeFactor = Math.round(easeFactor * 100) / 100;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);

  return {
    repetitions,
    intervalDays,
    easeFactor,
    dueDate: nextDate.toISOString().split('T')[0],
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
