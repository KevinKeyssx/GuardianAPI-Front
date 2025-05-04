import { z } from 'zod';

export const baseEnvSchema = z.object({});
export type Env = z.infer<typeof baseEnvSchema>;

export function loadEnv<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>
): z.infer<z.ZodObject<T>> {
    const parsedEnv = schema.safeParse( import.meta.env );

    if ( !parsedEnv.success ) {
        console.error(
            "❌ Invalid environment variables:",
            parsedEnv.error.flatten().fieldErrors
        );
        throw new Error( 'Invalid environment variables' );
    }

    return parsedEnv.data as z.infer<z.ZodObject<T>>;
}
