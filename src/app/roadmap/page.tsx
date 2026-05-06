import { MobileShell } from "@/components/MobileShell";
import { RoadmapView } from "@/components/roadmap/RoadmapView";

export default function RoadmapPage() {
  return (
    <MobileShell withBottomNav>
      <RoadmapView />
    </MobileShell>
  );
}
