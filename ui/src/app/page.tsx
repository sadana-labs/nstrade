"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';
import { StrategyCharts } from '@/components/leaderboard/strategy-charts';
import { LeaderboardData, Strategy } from '@/lib/types';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

async function getLeaderboardData(): Promise<LeaderboardData> {
  const response = await fetch('http://localhost:3000/api/leaderboard', {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }

  return response.json();
}

export default function HomePageWrapper() {
  const [metricsType, setMetricsType] = useState<'dev' | 'holdout'>('dev');
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    getLeaderboardData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return <div className="container mx-auto py-10 text-center">Loading...</div>;
  }

  // Map strategies to use the selected metrics
  const mappedStrategies: Strategy[] = data.strategies.map((s) => ({
    ...s,
    development_metrics: metricsType === 'dev' ? s.development_metrics : s.holdout_metrics,
    holdout_metrics: s.holdout_metrics, // keep for table typing
  }));

  return (
    <main className="container mx-auto py-10 flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-8 w-full max-w-5xl mx-auto gap-4 md:gap-0">
        <div className="flex items-center gap-4">
          <img src="/ns-logo.svg" alt="NS Logo" width={48} height={54} />
          <div>
            <h1 className="text-5xl font-bold" style={{ fontFamily: 'var(--garamond-font), serif' }}>
              NSTrade Leaderboard
            </h1>
            <div className="text-lg text-muted-foreground" style={{ fontFamily: 'var(--garamond-font), serif', fontWeight: 400 }}>
              An NS Learnathon Joint Venture
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <ToggleGroup type="single" value={metricsType} onValueChange={v => v && setMetricsType(v as 'dev' | 'holdout')}>
            <ToggleGroupItem value="dev">Development</ToggleGroupItem>
            <ToggleGroupItem value="holdout">Holdout/Test</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </header>
      {/* Mobile Toggle */}
      <div className="block md:hidden flex justify-center mb-8">
        <ToggleGroup type="single" value={metricsType} onValueChange={v => v && setMetricsType(v as 'dev' | 'holdout')}>
          <ToggleGroupItem value="dev">Development</ToggleGroupItem>
          <ToggleGroupItem value="holdout">Holdout/Test</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {/* Charts and Table */}
      <div className="space-y-8 flex-1">
        <StrategyCharts strategies={mappedStrategies} />
        <LeaderboardTable strategies={mappedStrategies} />
      </div>
      {/* Footer */}
      <footer className="w-full mt-12 py-6">
        <div className="text-base md:text-lg italic text-muted-foreground font-sans text-center">
          In this business it&apos;s easy to confuse luck with brains. &mdash; Jim Simons
        </div>
      </footer>
    </main>
  );
}
