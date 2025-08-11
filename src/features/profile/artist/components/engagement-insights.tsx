import { TrendingUp } from "lucide-react";

const EngagementInsights = () => {
  const topInterestedBuyers = 70;
  const conversionRate = 30;

  // Calculate arc paths for the semi-circular gauge
  const radius = 90;
  const strokeWidth = 30;
  const center = { x: 120, y: 120 };

  const percentageToAngle = (percentage: number) => {
    return (percentage / 100) * 180 - 90; // -90 to start from left
  };

  const createArcPath = (
    startAngle: number,
    endAngle: number,
    isLargeArc: boolean = false,
  ) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center.x + radius * Math.cos(startRad);
    const y1 = center.y + radius * Math.sin(startRad);
    const x2 = center.x + radius * Math.cos(endRad);
    const y2 = center.y + radius * Math.sin(endRad);

    const largeArcFlag = isLargeArc ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  const topInterestedArc = createArcPath(
    -90,
    percentageToAngle(topInterestedBuyers),
    true,
  );
  const conversionArc = createArcPath(
    percentageToAngle(topInterestedBuyers),
    90,
  );

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-orange-500" />
        <h2 className="stats_title">Buyer Engagement Insights</h2>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between gap-8">
        {/* Gauge Chart */}
        <div className="relative">
          <svg
            width="240"
            height="140"
            viewBox="0 0 240 140"
            className="h-auto w-full"
            role="img"
            aria-label="Engagement insights gauge chart"
          >
            {/* Background arc */}
            <path
              d={createArcPath(-90, 90, true)}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Top Interested Buyers arc */}
            <path
              d={topInterestedArc}
              fill="none"
              stroke="#fb923c"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />

            {/* Conversion Rate arc */}
            <path
              d={conversionArc}
              fill="none"
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />

            {/* Center text */}
            <text
              x="120"
              y="110"
              textAnchor="middle"
              className="fill-gray-700 text-sm font-medium"
            >
              <tspan x="120" dy="0">
                Engagement
              </tspan>
              <tspan x="120" dy="20">
                Insights
              </tspan>
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Top Interested Buyers */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-orange-400" />
            <div className="min-w-0">
              <p className="text-sm text-gray-600">Top Interested Buyers</p>
              <p className="text-lg font-semibold text-gray-900">
                {topInterestedBuyers}%
              </p>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-green-500" />
            <div className="min-w-0">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {conversionRate}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementInsights;
