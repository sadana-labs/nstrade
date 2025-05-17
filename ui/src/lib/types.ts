export interface Metrics {
  sharpe: number;
  total_return: number;
  max_drawdown: number;
  n_trades: number;
  win_rate: number;
}

export interface Strategy {
  author_name: string;
  strategy_name: string;
  description: string;
  last_updated: string;
  development_metrics: Metrics;
  holdout_metrics: Metrics;
}

export interface LeaderboardData {
  strategies: Strategy[];
}

export type SortField = keyof Metrics | 'author_name' | 'strategy_name';
export type SortDirection = 'asc' | 'desc'; 