import { BurnoutData, MoodCheckIn, ResetLog, Practice } from "@/types";

// Function to calculate practice effectiveness based on user feedback
export const calculatePracticeEffectiveness = (
  practice: Practice,
  checkIns: MoodCheckIn[],
  resets: ResetLog[]
): number => {
  // Find all resets for this practice with feedback
  const practiceResets = resets.filter(
    reset => 
      reset.practiceId === practice.id && 
      reset.postMood !== undefined
  );

  if (practiceResets.length === 0) {
    return 0.5; // Neutral effectiveness if no data
  }

  // Calculate effectiveness based on positive outcomes
  const positiveOutcomes = practiceResets.filter(
    reset => reset.postMood === "better"
  ).length;

  return positiveOutcomes / practiceResets.length;
};

// Function to get practice effectiveness for a specific mood
export const getMoodSpecificEffectiveness = (
  practice: Practice,
  mood: string,
  checkIns: MoodCheckIn[],
  resets: ResetLog[]
): number => {
  // Find resets for this practice with this specific mood
  const moodSpecificResets = resets.filter(reset => {
    const checkIn = checkIns.find(ci => ci.practiceId === reset.practiceId);
    return reset.practiceId === practice.id && 
           checkIn?.mood === mood && 
           reset.postMood !== undefined;
  });

  if (moodSpecificResets.length === 0) {
    return 0.5; // Neutral effectiveness if no data for this mood
  }

  // Calculate mood-specific effectiveness
  const positiveOutcomes = moodSpecificResets.filter(
    reset => reset.postMood === "better"
  ).length;

  return positiveOutcomes / moodSpecificResets.length;
};

// Function to update effectiveness scores for future recommendations
export const updatePracticeEffectiveness = (
  practiceId: string,
  mood: string,
  postMood: "better" | "same" | undefined,
  data: BurnoutData
): BurnoutData => {
  // For now, just add the reset/log which will be used by the ML algorithm
  // The effectiveness calculation is handled by the ML system
  
  // This function can be expanded to maintain explicit effectiveness scores
  // if needed for performance reasons
  return data;
};

// Function to analyze practice patterns and suggest improvements
export const analyzePracticePatterns = (
  practices: Practice[],
  checkIns: MoodCheckIn[],
  resets: ResetLog[]
) => {
  return practices.map(practice => {
    const overallEffectiveness = calculatePracticeEffectiveness(practice, checkIns, resets);
    const moodSpecificEffectiveness = {
      calm: getMoodSpecificEffectiveness(practice, "calm", checkIns, resets),
      ok: getMoodSpecificEffectiveness(practice, "ok", checkIns, resets),
      stressed: getMoodSpecificEffectiveness(practice, "stressed", checkIns, resets),
      exhausted: getMoodSpecificEffectiveness(practice, "exhausted", checkIns, resets),
    };

    return {
      practice,
      overallEffectiveness,
      moodSpecificEffectiveness,
      usageCount: resets.filter(r => r.practiceId === practice.id).length,
    };
  });
};