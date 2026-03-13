import { getLeaderboardData } from '@/lib/data';
import { LeaderboardTabs } from '@/components/leaderboard/LeaderboardTabs';

export default function LeaderboardPage() {
  const data = getLeaderboardData();

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="retro text-lg text-primary tracking-wide">
          Leaderboard
        </h1>
        <p className="retro text-[10px] text-muted-foreground leading-relaxed">
          Ranked by connections, mentions, and article appearances across the @葬AI knowledge graph.
        </p>
      </div>

      {/* Tabs + Tables */}
      <LeaderboardTabs data={data} />
    </section>
  );
}
