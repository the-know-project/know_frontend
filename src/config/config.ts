import { PORT } from "./data/data";

export const EnvConfig = {
  env: {
    PROD_URL: process.env.NEXT_PUBLIC_PROD_URL || "",
    STAGING_URL:
      process.env.NEXT_PUBLIC_STAGING_URL || `http://localhost:${PORT}`,
  },
};
