import { Metrics } from './types';

export const metricTooltips: Record<keyof Metrics, string> = {
  sharpe: "Measures risk-adjusted returns. Higher values indicate better risk-adjusted performance.",
  total_return: "Total percentage return of the strategy over the period.",
  max_drawdown: "Largest peak-to-trough decline. Lower values indicate better risk management.",
  n_trades: "Total number of trades executed by the strategy.",
  win_rate: "Percentage of profitable trades. Higher values indicate better trade selection."
};

export const formatMetric = (key: keyof Metrics, value: number): string => {
  switch (key) {
    case 'sharpe':
      return value.toFixed(2);
    case 'total_return':
      return `${(value * 100).toFixed(2)}%`;
    case 'max_drawdown':
      return `${(value * 100).toFixed(2)}%`;
    case 'n_trades':
      return value.toString();
    case 'win_rate':
      return `${(value * 100).toFixed(2)}%`;
    default:
      return value.toString();
  }
}; 