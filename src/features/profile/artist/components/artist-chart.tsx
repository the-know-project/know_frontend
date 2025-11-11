"use client";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useState } from "react";
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
import { useUserMetrics } from "../hooks/use-artist-stats";

export const description = "A dynamic revenue chart with period toggle";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const ArtistChart = () => {
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");
  const { data, isLoading, error } = useUserMetrics(undefined, period);

  // Format chart data from API response
  const chartData = data?.chartData || [];
  const totalRevenue = data?.totalRevenue || 0;
  const percentageChange = data?.percentageChange || 0;
  const isPositive = percentageChange >= 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
              <div className="h-9 w-20 animate-pulse rounded-md bg-gray-200" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse rounded bg-gray-100" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Failed to load stats</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : "An error occurred"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <CardTitle className="stats_title">
                ${totalRevenue.toLocaleString()}
              </CardTitle>
            </div>
            <CardDescription>
              Total Revenue -{" "}
              {period === "yearly" ? "Last 12 Months" : "Last 30 Days"}
            </CardDescription>
          </div>

          {/* Period Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod("monthly")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                period === "monthly"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("yearly")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                period === "yearly"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {chartData.length > 0 ? (
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
                className="font-bricolage font-medium text-[#666666]"
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="revenue"
                type="linear"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-gray-500">
            No revenue data available for this period
          </div>
        )}
      </CardContent>

      {percentageChange !== 0 && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none font-medium">
                {isPositive ? (
                  <>
                    Trending up by {Math.abs(percentageChange).toFixed(1)}% this
                    period
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </>
                ) : (
                  <>
                    Trending down by {Math.abs(percentageChange).toFixed(1)}%
                    this period
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </>
                )}
              </div>
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                Compared to previous{" "}
                {period === "yearly" ? "12 months" : "30 days"}
              </div>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ArtistChart;
