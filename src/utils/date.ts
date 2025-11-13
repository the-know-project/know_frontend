/**
 * Formats an ISO date string to a readable format like "Jun 20 12:15"
 * @param isoDateString - ISO date string like "2025-06-20T11:08:24.127Z"
 * @returns Formatted date string like "Jun 20 12:15"
 */
export const formatDateToReadable = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${month} ${day} ${hours}:${minutes}`;
};

/**
 * Formats a milliseconds timestamp to a readable format like "Jun 20 12:17"
 * @param timestamp - Timestamp in milliseconds (from Date.now())
 * @returns Formatted date string like "Jun 20 12:17"
 */
export const formatTimestampToReadable = (timestamp: number): string => {
  const date = new Date(timestamp);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${month} ${day} ${hours}:${minutes}`;
};

/**
 * Formats an ISO date string to a relative time format like "2 hours ago", "3 days ago"
 * @param isoDateString - ISO date string like "2025-06-20T11:08:24.127Z"
 * @returns Relative time string like "2 hours ago"
 */
export const formatDateToRelative = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const now = new Date();

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else {
    // For older dates, fall back to readable format
    return formatDateToReadable(isoDateString);
  }
};

/**
 * Formats an ISO date string to a full readable format like "June 20, 2025 at 12:15 PM"
 * @param isoDateString - ISO date string like "2025-06-20T11:08:24.127Z"
 * @returns Full formatted date string
 */
export const formatDateToFull = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
