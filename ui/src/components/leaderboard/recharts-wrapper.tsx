"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { Tooltip as RadixTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RechartsWrapperProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  tooltipStrategyKey?: string;
  title: string;
  color: string;
  yAxisTickFormatter?: (value: number) => string;
  horizontal?: boolean;
}

const TruncatedTick = (props: any) => {
  const { x, y, payload } = props;
  const label = payload.value;
  const truncated = label.length > 12 ? label.slice(0, 12) + "…" : label;
  return (
    <TooltipProvider>
      <RadixTooltip>
        <TooltipTrigger asChild>
          <text x={x} y={y} dy={16} textAnchor="end" fill="#fff" style={{ fontSize: 12, cursor: "pointer" }}>
            {truncated}
          </text>
        </TooltipTrigger>
        <TooltipContent>
          <span>{label}</span>
        </TooltipContent>
      </RadixTooltip>
    </TooltipProvider>
  );
};

export default function RechartsWrapper({
  data,
  dataKey,
  xAxisKey = "name",
  tooltipStrategyKey = "strategy",
  title,
  color,
  yAxisTickFormatter,
  horizontal = false,
}: RechartsWrapperProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 24, bottom: 0 }}
        layout={horizontal ? "vertical" : "horizontal"}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {horizontal ? (
          <YAxis
            type="category"
            dataKey={xAxisKey}
            width={120}
            tick={<TruncatedTick />}
          />
        ) : (
          <XAxis
            dataKey={xAxisKey}
            angle={-45}
            textAnchor="end"
            height={48}
            interval={0}
            minTickGap={10}
            tick={<TruncatedTick />}
          />
        )}
        {horizontal ? (
          <XAxis type="number" tickFormatter={yAxisTickFormatter} />
        ) : (
          <YAxis width={40} tickFormatter={yAxisTickFormatter} />
        )}
        <RechartsTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload;
              return (
                <div className="rounded bg-background p-2 text-xs shadow">
                  <div><b>{d[xAxisKey]}</b></div>
                  <div>Strategy: {d[tooltipStrategyKey]}</div>
                  <div>{title}: {d[dataKey as keyof typeof d].toFixed(2)}</div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey={dataKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
} 