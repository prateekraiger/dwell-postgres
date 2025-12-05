import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

// Validate required environment variables
if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

if (!process.env.JWT_SECRET) {
  console.warn(
    "⚠️  JWT_SECRET not set, using default (not secure for production)"
  );
}
