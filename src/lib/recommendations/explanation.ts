import { UserTrait } from "@/types/user";
import { CareerProfile } from "./types";

export function getBadges(matchedTraits: UserTrait[], career: CareerProfile): string[] {
  const badges: string[] = [];
  
  if (matchedTraits.length >= 3) badges.push("High Alignment");
  if (career.growthPotential === "High") badges.push("Future Proof");
  if (career.difficultyLevel === "High") badges.push("Challenge Seeker");
  
  if (matchedTraits.includes("creativity")) badges.push("Creative Spark");
  if (matchedTraits.includes("technicalAptitude")) badges.push("Tech Savvy");
  if (matchedTraits.includes("empathy")) badges.push("People Person");
  if (matchedTraits.includes("analysis")) badges.push("Deep Thinker");
  
  return badges.slice(0, 3);
}

export function getMatchReason(matchedTraits: UserTrait[], career: CareerProfile): string {
  const topTrait = matchedTraits[0];
  
  const reasonMap: Record<UserTrait, string> = {
    creativity: `Your imaginative approach is a perfect fit for ${career.title}.`,
    structuredThinking: `Your ability to organize complex information aligns with ${career.title} requirements.`,
    technicalAptitude: `Your natural technical skills make you a strong candidate for ${career.title}.`,
    empathy: `Your deep understanding of others is highly valued in ${career.title}.`,
    analysis: `Your analytical mind is exactly what's needed to succeed as a ${career.title}.`,
    communication: `Your ability to articulate ideas clearly is a key asset for ${career.title}.`,
    execution: `Your drive to get things done will help you excel in ${career.title}.`,
    curiosity: `Your desire to learn and explore is a great match for the evolving nature of ${career.title}.`,
  };

  return reasonMap[topTrait] || `Your unique profile shows a strong potential for success in ${career.title}.`;
}

export function getPotentialChallenge(gapTraits: UserTrait[], career: CareerProfile): string {
  if (gapTraits.length === 0) return "No major challenges identified.";
  
  const primaryGap = gapTraits[0];
  
  const challengeMap: Record<UserTrait, string> = {
    creativity: `You might find the creative demands of ${career.title} stretching at first.`,
    structuredThinking: `Managing the complex structures in ${career.title} may require extra focus.`,
    technicalAptitude: `There might be a steep learning curve for the technical aspects of ${career.title}.`,
    empathy: `Developing deep user/client empathy will be important for your success here.`,
    analysis: `Developing your data analysis skills will be key to mastering ${career.title}.`,
    communication: `Scaling your communication to high-stakes scenarios will be your primary challenge.`,
    execution: `Maintaining a high pace of delivery might be demanding in this role.`,
    curiosity: `Keeping up with the rapid pace of change in ${career.title} will require constant learning.`,
  };

  return challengeMap[primaryGap] || career.possibleChallenges[0];
}
