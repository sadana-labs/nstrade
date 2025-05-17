"use client";

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Strategy, SortField, SortDirection } from '@/lib/types';
import { metricTooltips, formatMetric } from '@/lib/metrics';
import { ArrowUpDown } from 'lucide-react';

interface LeaderboardTableProps {
  strategies: Strategy[];
}

export function LeaderboardTable({ strategies }: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<SortField>('sharpe');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStrategies = [...strategies].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortField === 'author_name' || sortField === 'strategy_name') {
      aValue = a[sortField];
      bValue = b[sortField];
    } else {
      aValue = a.development_metrics[sortField as keyof typeof a.development_metrics];
      bValue = b.development_metrics[sortField as keyof typeof b.development_metrics];
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Strategy</TableHead>
            {Object.keys(metricTooltips).map((metric) => (
              <TableHead key={metric} className="cursor-pointer" onClick={() => handleSort(metric as SortField)}>
                <div className="flex items-center gap-2">
                  {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStrategies.map((strategy, index) => (
            <TableRow key={index}>
              <TableCell>{strategy.author_name}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>{strategy.strategy_name}</TooltipTrigger>
                    <TooltipContent>
                      <p>{strategy.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              {Object.entries(strategy.development_metrics).map(([metric, value]) => (
                <TableCell key={metric}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {formatMetric(metric as keyof typeof metricTooltips, value)}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{metricTooltips[metric as keyof typeof metricTooltips]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 