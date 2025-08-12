import { TrendingUp } from "lucide-react";

const EngagementInsights = () => {
  const topInterestedBuyers = 80;
  const conversionRate = 20;

  const radius = 80;
  const strokeWidth = 20;

  const semicircleLength = Math.PI * radius;

  const topInterestedLength = (topInterestedBuyers / 100) * semicircleLength;
  const conversionLength = (conversionRate / 100) * semicircleLength;

  const topInterestedStrokeDashArray = `${topInterestedLength} ${semicircleLength}`;
  const conversionStrokeDashArray = `${conversionLength} ${semicircleLength}`;
  const conversionStrokeDashOffset = -topInterestedLength;

  return (
    <section className="bg-white">
      {/* Header */}
      <div className="mb-6 flex items-center gap-8">
        <div className="rounded-full bg-orange-100 p-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <h2 className="stats_title">Buyer Engagement Insights</h2>
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4 sm:gap-8">
        {/* Gauge Chart */}
        <div className="relative flex-shrink-0">
          <svg
            width="200"
            height="120"
            viewBox="0 0 200 120"
            className="h-auto w-full max-w-[150px] sm:max-w-[200px]"
            role="img"
            aria-label="Engagement insights gauge chart"
          >
            {/* Background arc */}
            <path
              d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Top Interested Buyers arc  */}
            <path
              d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
              fill="none"
              stroke="#F97316"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={topInterestedStrokeDashArray}
              strokeDashoffset="0"
              className="transition-all duration-700 ease-out"
            />

            {/* Conversion Rate arc */}
            <path
              d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
              fill="none"
              stroke="#34A853"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={conversionStrokeDashArray}
              strokeDashoffset={conversionStrokeDashOffset}
              className="transition-all duration-700 ease-out"
            />

            {/* Center text */}
            <text
              x="100"
              y="85"
              textAnchor="middle"
              className="hidden fill-black md:block"
            >
              <tspan x="100" className="stats_content !font-medium">
                Engagement
              </tspan>
              <tspan x="100" dy="16" className="stats_content !font-medium">
                Insights
              </tspan>
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Top Interested Buyers */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-[#F97316]" />
            <span className="stats_content">
              Top Interested Buyers ({topInterestedBuyers}%)
            </span>
          </div>

          {/* Conversion Rate */}
          <div className="flex items-center gap-3">
            <div className="bg-[] h-3 w-3 rounded-full" />
            <span className="stats_content">
              Conversion Rate ({conversionRate}%)
            </span>
          </div>
        </div>
      </div>

      <hr className="mt-5 block w-full border-t border-neutral-200" />
    </section>
  );
};

export default EngagementInsights;
