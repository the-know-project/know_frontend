export const isProduction = () => {
  return process.env.NEXT_PUBLIC_API_ENV === "production";
};

export const isDevelopment = () => {
  return process.env.NEXT_PUBLIC_API_ENV === "development";
};

export const isTest = () => {
  return process.env.NODE_ENV === "test";
};

export const getEnvironment = () => {
  return process.env.NODE_ENV || "development";
};
