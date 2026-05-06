export type RoadmapTask = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export type RoadmapMilestone = {
  id: string;
  title: string;
  description: string;
  tasks: RoadmapTask[];
};

export type CareerRoadmap = {
  careerId: string;
  careerTitle: string;
  milestones: RoadmapMilestone[];
};
