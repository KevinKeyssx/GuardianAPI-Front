import GitHub           from '@auth/core/providers/github'
import { defineConfig } from 'auth-astro'

import { SERVER_ENV } from "@/lib/env/server";

export default defineConfig({
	providers: [
		GitHub({
			clientId        : SERVER_ENV.GITHUB_CLIENT_ID,
			clientSecret    : SERVER_ENV.GITHUB_CLIENT_SECRET,
		}),
	],
    secret      : SERVER_ENV.AUTH_SECRET,
    trustHost   : true,
    cookies     : {
        sessionToken: {
            name    : `astro-auth.session-token`,
            options : {
                httpOnly    : true,
                sameSite    : 'lax',
                path        : '/',
                secure      : true,
                maxAge      : 60 * 60 * 24 * 7,
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
