"use client";

import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Strategy } from '@/lib/types';
import dynamic from 'next/dynamic';
import { ChartLoading } from './chart-loading';
import { ChartError } from './chart-error';

// Dynamically import Recharts components with no SSR
const RechartsWrapper = dynamic(
  () => import('@/components/leaderboard/recharts-wrapper'),
  { 
    ssr: false,
    loading: () => <ChartLoading />,
  }
);

interface StrategyChartsProps {
  strategies: Strategy[];
}

interface ChartConfig {
  dataKey: string;
  title: string;
  color: string;
}

const chartConfigs: ChartConfig[] = [
  {
    dataKey: 'sharpe',
    title: 'Sharpe Ratio Comparison',
    color: '#8884d8',
  },
  {
    dataKey: 'totalReturn',
    title: 'Total Return (%)',
    color: '#82ca9d',
  },
  {
    dataKey: 'winRate',
    title: 'Win Rate (%)',
    color: '#ffc658',
  },
];

const formatYAxisNumber = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(value) >= 1_000) return (value / 1_000).toFixed(1) + 'K';
  return value.toString();
};

export function StrategyCharts({ strategies }: StrategyChartsProps) {
  // Use author_name for Y-axis, but keep strategy_name for tooltip
  type ChartData = {
    author: string;
    strategy: string;
    sharpe: number;
    totalReturn: number;
    winRate: number;
  };
  const chartData: ChartData[] = strategies.map(strategy => ({
    author: strategy.author_name,
    strategy: strategy.strategy_name,
    sharpe: strategy.development_metrics.sharpe,
    totalReturn: strategy.development_metrics.total_return * 100,
    winRate: strategy.development_metrics.win_rate * 100,
  }));

  // Chart height: 48px per bar, min 180px
  const chartHeight = Math.max(135, chartData.length * 36); // 75% of previous values

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {chartConfigs.map((config) => {
        // Sort data by value for this chart
        const sortedData = [...chartData].sort(
          (a, b) => Number(b[config.dataKey as keyof ChartData]) - Number(a[config.dataKey as keyof ChartData])
        );
        return (
          <Card key={config.dataKey}>
            <CardHeader>
              <CardTitle>{config.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div style={{ height: chartHeight }}>
                <Suspense fallback={<ChartLoading />}>
                  <ErrorBoundary fallback={<ChartError title={config.title} />}>
                    <RechartsWrapper
                      data={sortedData}
                      dataKey={config.dataKey}
                      xAxisKey="author"
                      tooltipStrategyKey="strategy"
                      title={config.title}
                      color={config.color}
                      yAxisTickFormatter={config.dataKey === 'totalReturn' ? formatYAxisNumber : undefined}
                      horizontal
                    />
                  </ErrorBoundary>
                </Suspense>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
} 