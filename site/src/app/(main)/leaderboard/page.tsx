import { getLeaderboardData } from '@/lib/data';
import { LeaderboardTabs } from '@/components/leaderboard/LeaderboardTabs';
import { Footer } from '@/components/layout/Footer';

export default function LeaderboardPage() {
  const data = getLeaderboardData();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <LeaderboardTabs data={data} />
      </div>
      <Footer />
    </>
  );
}
