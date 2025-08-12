export const isProduction = () => {
  return process.env.NODE_ENV === "production";
  // return true;
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

export const isTest = () => {
  return process.env.NODE_ENV === "test";
};

export const getEnvironment = () => {
  return process.env.NODE_ENV || "development";
};
