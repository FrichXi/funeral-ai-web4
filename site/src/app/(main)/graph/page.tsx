import { getLeaderboardData, getSiteStats } from '@/lib/data';
import { GraphClient } from './GraphClient';

export default function GraphPage() {
  const leaderboard = getLeaderboardData();
  const stats = getSiteStats();

  return (
    <GraphClient
      leaderboard={leaderboard}
      stats={{
        articleCount: stats.articleCount,
        nodeCount: stats.nodeCount,
        linkCount: stats.linkCount,
      }}
    />
  );
}
