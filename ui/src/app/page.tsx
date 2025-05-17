import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { StrategyCharts } from '@/components/leaderboard/strategy-charts';
import { LeaderboardData } from '@/lib/types';

async function getLeaderboardData(): Promise<LeaderboardData> {
  const response = await fetch('http://localhost:3000/api/leaderboard', {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }

  return response.json();
}

export default async function Home() {
  const data = await getLeaderboardData();

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Trading Strategy Leaderboard</h1>
      
      <div className="space-y-8">
        <StrategyCharts strategies={data.strategies} />
        <LeaderboardTable strategies={data.strategies} />
      </div>
    </main>
  );
}
