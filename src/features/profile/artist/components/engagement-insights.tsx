"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eye, TrendingUp, UsersRound } from "lucide-react";

interface EngagementInsightsProps {
  viewsPerFollower?: number | null;
  conversionRate?: number;
}

const EngagementInsights = ({
  viewsPerFollower = 0,
  conversionRate = 0,
}: EngagementInsightsProps) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = prefersReducedMotion !== true;
  const safeViewsPerFollower = Number.isFinite(viewsPerFollower)
    ? Math.max(viewsPerFollower ?? 0, 0)
    : null;
  const safeConversionRate = Number.isFinite(conversionRate)
    ? Math.max(conversionRate, 0)
    : 0;
  const ringProgress = Math.min(safeConversionRate, 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const compactNumber =
    safeViewsPerFollower === null
      ? "—"
      : new Intl.NumberFormat("en", {
          maximumFractionDigits: 1,
          notation: "compact",
        }).format(safeViewsPerFollower);

  return (
    <section className="w-full py-8 sm:py-10">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-helvetica text-xl font-bold text-neutral-900 sm:text-2xl">
            Engagement insights
          </h2>
          <p className="font-grotesk mt-1 text-xs text-neutral-500 sm:text-sm">
            See how people discover and purchase your work.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        <motion.article
          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldAnimate ? 0.35 : 0 }}
          className="flex min-h-40 items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Eye className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="font-grotesk text-sm font-medium text-neutral-600">
              Views per follower
            </p>
            <p className="font-helvetica mt-1 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              {compactNumber}
              {safeViewsPerFollower !== null && (
                <span className="ml-1 text-xl font-semibold text-neutral-500">
                  ×
                </span>
              )}
            </p>
            <p className="font-grotesk mt-1 text-xs leading-5 text-neutral-500">
              {safeViewsPerFollower === null
                ? "This ratio appears after your first follower."
                : "Profile and post views divided by followers. Repeat views count."}
            </p>
          </div>
        </motion.article>

        <motion.article
          initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldAnimate ? 0.35 : 0,
            delay: shouldAnimate ? 0.08 : 0,
          }}
          className="flex min-h-40 items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center">
            <svg
              viewBox="0 0 112 112"
              className="absolute inset-0 h-full w-full -rotate-90"
              role="img"
              aria-label={`Conversion rate ${safeConversionRate.toFixed(1)} percent`}
            >
              <circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="9"
              />
              <motion.circle
                cx="56"
                cy="56"
                r={radius}
                fill="none"
                stroke="#16a34a"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={
                  shouldAnimate ? { strokeDashoffset: circumference } : false
                }
                animate={{
                  strokeDashoffset: circumference * (1 - ringProgress / 100),
                }}
                transition={{
                  duration: shouldAnimate ? 1 : 0,
                  delay: shouldAnimate ? 0.15 : 0,
                  ease: "easeOut",
                }}
              />
            </svg>
            <span className="font-helvetica text-lg font-bold text-neutral-900 tabular-nums">
              {safeConversionRate.toFixed(1)}%
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-green-700" />
              <p className="font-grotesk text-sm font-medium text-neutral-600">
                Sales conversion
              </p>
            </div>
            <p className="font-helvetica mt-1 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              {safeConversionRate.toFixed(1)}%
            </p>
            <p className="font-grotesk mt-1 text-xs leading-5 text-neutral-500">
              Items sold compared with post views.
            </p>
            {safeConversionRate > 100 && (
              <p className="font-grotesk mt-1 text-[11px] leading-4 text-amber-700">
                Ring fills at 100%; the value can exceed this when multiple
                items sell per view.
              </p>
            )}
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default EngagementInsights;
