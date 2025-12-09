// src/features/metrics/data/metrics.route.ts
export enum METRICS_OP {
  INCREMENT_VIEW_COUNT = "/api/metrics/incrementPostViews",
  USER_METRICS = "/api/metrics/userMetrics",
  SALES_METRICS = "/api/metrics/salesMetrics",
  FOLLOW_USER = "/api/metrics/followUser",
  UNFOLLOW_USER = "/api/metrics/unfollowUser",
  USER_FOLLOWERS = "/api/metrics/fetchUserFollowers",
  USER_FOLLOWING = "/api/metrics/fetchUserFollowing",
  POST_PERFORMANCE = "/api/metrics/postPerformance",
  VALIDATE_FOLLOW = "/api/metrics/validateUserFollowing",
}
