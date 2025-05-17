"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ChartErrorProps {
  title: string;
}

export function ChartError({ title }: ChartErrorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <AlertCircle className="h-8 w-8" />
          <p>Failed to load chart data</p>
        </div>
      </CardContent>
    </Card>
  );
} 