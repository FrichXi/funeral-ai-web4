import type { Metadata } from 'next';
import { getLeaderboardData } from '@/lib/data';
import { LeaderboardPageClient } from '@/components/leaderboard/LeaderboardPageClient';
import { Footer } from '@/components/layout/Footer';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: '排行榜 - 葬AI Web4',
  description: '中文AI行业排行榜。产品、创始人、投资机构与公司的综合排名。',
};

export default function LeaderboardPage() {
  const data = getLeaderboardData();

  return (
    <>
      <PageContainer>
        <LeaderboardPageClient data={data} />
      </PageContainer>
      <Footer />
    </>
  );
}
