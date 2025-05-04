import { z } from 'zod';

import { loadEnv, type Env } from './load-env';

const serverEnvSchema = z.object({
    AUTH_SECRET             : z.string(),
    GITHUB_CLIENT_ID        : z.string(),
    GITHUB_CLIENT_SECRET    : z.string(),
});

export type ServerEnv   = z.infer<typeof serverEnvSchema> & Env;
export const SERVER_ENV = loadEnv( serverEnvSchema ) as ServerEnv;
