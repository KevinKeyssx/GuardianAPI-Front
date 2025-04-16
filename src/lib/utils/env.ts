import { z } from "zod";

const envVariables = z.object({
    GITHUB_CLIENT_ID        : z.string(),
    GITHUB_CLIENT_SECRET    : z.string(),
    BETTER_AUTH_SECRET      : z.string(),
    BETTER_AUTH_URL         : z.string().url(),
});


const _env = envVariables.safeParse(process.env);


if (_env.success === false) {
    console.error(
        "❌ Invalid environment variables:",
        _env.error.format()
    );
    throw new Error("Invalid environment variables");
}

export const ENV = _env.data;