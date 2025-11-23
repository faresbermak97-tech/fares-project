const requiredEnvVars = {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_TO: process.env.EMAIL_TO,
} as const;

const requiredPublicEnvVars = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
} as const;

export function validateEnv() {
  const missing = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  const missingPublic = Object.entries(requiredPublicEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0 || missingPublic.length > 0) {
    const allMissing = [...missing, ...missingPublic];
    throw new Error(
      `Missing required environment variables: ${allMissing.join(", ")}\n` +
        "Please check your .env.local file."
    );
  }
}

// Server-only env vars
export const serverEnv = {
  emailUser: process.env.EMAIL_USER!,
  emailPass: process.env.EMAIL_PASS!,
  emailTo: process.env.EMAIL_TO!,
} as const;

// Public env vars
export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  gaId: process.env.NEXT_PUBLIC_GA_ID,
} as const;

// Validate on server startup
if (typeof window === "undefined") {
  validateEnv();
}
