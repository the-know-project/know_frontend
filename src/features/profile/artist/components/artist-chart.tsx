"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/shared/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/ui/card";
import { useFetchEarnings } from "../hooks/use-fetch-earnings";

export const description = "A dynamic earnings line chart";

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const ArtistChart = () => {
  const { data: earningsData, isLoading, error } = useFetchEarnings();

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-32 rounded bg-gray-200 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error || !earningsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="stats_title text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="font-bricolage text-gray-500">
              Failed to load earnings data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { chartData, total, percentageChange } = earningsData;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="stats_title">{formatCurrency(total)}</CardTitle>
        <CardDescription>Total earnings this year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="font-bricolage font-medium text-[#66666]"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="earnings"
              type="linear"
              stroke="var(--color-earnings)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {percentageChange >= 0 ? "Trending up" : "Trending down"} by{" "}
          {Math.abs(percentageChange).toFixed(1)}% this month
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total earnings for the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArtistChart;
