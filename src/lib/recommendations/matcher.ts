import { UserTrait } from "@/types/user";
import { CareerProfile, PsychometricProfile, Recommendation } from "./types";
import { careerOntology } from "./career-ontology";
import { getBadges, getMatchReason, getPotentialChallenge } from "./explanation";

export function getRecommendations(
  userProfile: PsychometricProfile,
  ontology: CareerProfile[] = careerOntology
): Recommendation[] {
  const recommendations: Recommendation[] = ontology.map((career) => {
    const { score, matchedTraits, gapTraits } = calculateMatch(userProfile, career);
    
    return {
      careerId: career.id,
      title: career.title,
      cluster: career.cluster,
      matchScore: Math.round(score),
      badges: getBadges(matchedTraits, career),
      reason: getMatchReason(matchedTraits, career),
      potentialChallenge: getPotentialChallenge(gapTraits, career),
      matchedTraits,
      gapTraits,
    };
  });

  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

function calculateMatch(
  userProfile: PsychometricProfile,
  career: CareerProfile
): { score: number; matchedTraits: UserTrait[]; gapTraits: UserTrait[] } {
  const requiredTraits = Object.entries(career.requiredTraits) as [UserTrait, number][];
  let totalSimilarity = 0;
  const matchedTraits: UserTrait[] = [];
  const gapTraits: UserTrait[] = [];
  let penalty = 0;

  requiredTraits.forEach(([trait, requiredValue]) => {
    const userValue = userProfile[trait] || 0;
    const diff = Math.abs(userValue - requiredValue);
    
    // Similarity component (0 to 1)
    const similarity = 1 - diff / 10;
    totalSimilarity += similarity;

    if (userValue >= requiredValue - 1) {
      matchedTraits.push(trait);
    } else if (userValue < requiredValue - 3) {
      gapTraits.push(trait);
      penalty += 0.1; // 10% penalty for major gap
    }
  });

  // Base score is average similarity
  let finalScore = (totalSimilarity / requiredTraits.length) * 100;

  // Dominant Trait Bonus
  const userTopTraits = getTopTraits(userProfile, 2);
  const careerTopTraits = getTopTraits(career.requiredTraits as PsychometricProfile, 2);

  if (userTopTraits[0] === careerTopTraits[0]) {
    finalScore += 10; // Major bonus for primary alignment
  } else if (careerTopTraits.includes(userTopTraits[0])) {
    finalScore += 5;
  }

  // Apply penalty
  finalScore = finalScore * (1 - Math.min(penalty, 0.4));

  // Cap at 99
  finalScore = Math.min(finalScore, 99);
  
  // Sort matched traits by user's strength
  matchedTraits.sort((a, b) => (userProfile[b] || 0) - (userProfile[a] || 0));

  return {
    score: finalScore,
    matchedTraits,
    gapTraits,
  };
}

function getTopTraits(profile: PsychometricProfile, count: number): UserTrait[] {
  return (Object.entries(profile) as [UserTrait, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([trait]) => trait);
}
