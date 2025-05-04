import type { Session } from "@auth/core/types";

import { CLIENT_ENV } from "@/lib/env/client";


export class SignInService {
    static async signIn( session: Session, provider: string ): Promise<any> {
        const newSession    = session as any;
        const accessToken   = newSession.accessToken;
        const url           = CLIENT_ENV.PUBLIC_GUARDIANAPI_URL + CLIENT_ENV.PUBLIC_GUARDIAN_AUTH_SOCIAL;

        try {
            const response = await fetch( url, {
                method  : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessToken, provider }),
            });

            if ( !response.ok ) {
                throw new Error( 'Error validating accessToken in GuardianAPI' );
            }

            return await response.json();
        } catch ( error ) {
            throw new Error( 'Error validating accessToken in GuardianAPI' );
        }
    }
}
