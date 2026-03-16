import type { Metadata } from 'next';
import { getLeaderboardData, getSiteStats } from '@/lib/data';
import { GraphClient } from './GraphClient';

export const metadata: Metadata = {
  title: '知识图谱 - 葬AI Web4',
  description: '中文AI行业知识图谱可视化。探索公司、产品、人物与投资机构之间的关系网络。',
};

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
