import { z } from "zod";

// Define the environment schema
const envVariables = z.object({
    AUTH_SECRET             : z.string(),
    AUTH_TRUST_HOST         : z.string().optional(),
    GITHUB_CLIENT_ID        : z.string(),
    GITHUB_CLIENT_SECRET    : z.string(),
    GUARDIANAPI_URL         : z.string(),
    GUARDIAN_AUTH_SOCIAL    : z.string(),
    GUARDIANAPI_GRAPHQL_URL : z.string(),
});

// Type for our environment
type EnvType = z.infer<typeof envVariables>;

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a safe way to access environment variables that works in both server and client
function getEnvValue(key: string): string {
    if (isBrowser) {
        // In browser, only use import.meta.env
        return (import.meta.env as any)[key] || "";
    } else {
        // In server, use process.env
        return (process.env as any)[key] || "";
    }
}

// Default environment values
const envs: EnvType = {
    AUTH_SECRET: getEnvValue("AUTH_SECRET"),
    GITHUB_CLIENT_ID: getEnvValue("GITHUB_CLIENT_ID"),
    GITHUB_CLIENT_SECRET: getEnvValue("GITHUB_CLIENT_SECRET"),
    GUARDIANAPI_URL: getEnvValue("GUARDIANAPI_URL"),
    GUARDIAN_AUTH_SOCIAL: getEnvValue("GUARDIAN_AUTH_SOCIAL"),
    GUARDIANAPI_GRAPHQL_URL: getEnvValue("GUARDIANAPI_GRAPHQL_URL"),
};

// Get environment variables safely
function getEnv(): EnvType {
    try {
        // Just return our pre-built environment object
        // which already handles browser vs server environments
        return envs;
    } catch (error) {
        console.error("❌ Error accessing environment variables:", error);
        return envs;
    }
}

// Export the environment variables
export const ENV = getEnv();