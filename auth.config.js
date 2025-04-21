import GitHub           from '@auth/core/providers/github'
import { defineConfig } from 'auth-astro'

import { ENV } from "./src/lib/utils/env";

export default defineConfig({
	providers: [
		GitHub({
			clientId: ENV.GITHUB_CLIENT_ID,
			clientSecret: ENV.GITHUB_CLIENT_SECRET,
		}),
	],
    secret: ENV.AUTH_SECRET,
    trustHost: true,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        }
    },
    callbacks: {
        async jwt({ token, account }) {
            if ( account ) {
                token.accessToken   = account.access_token;
                token.githubId      = account.providerAccountId;
            }

            return token;
        },
        async session({ session, token }) {
            session.accessToken     = token.accessToken;
            session.user.githubId   = token.githubId;

            return session;
        },
    },
});