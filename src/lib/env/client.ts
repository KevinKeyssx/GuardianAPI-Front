import { z } from 'zod';

import { loadEnv, type Env } from './load-env';

const clientEnvSchema = z.object({
    PUBLIC_GUARDIANAPI_URL         : z.string().url(),
    PUBLIC_GUARDIAN_AUTH_SOCIAL    : z.string(),
    PUBLIC_GUARDIANAPI_GRAPHQL_URL : z.string().url()
});

export type ClientEnv   = z.infer<typeof clientEnvSchema> & Env;
export const CLIENT_ENV = loadEnv( clientEnvSchema ) as ClientEnv;
