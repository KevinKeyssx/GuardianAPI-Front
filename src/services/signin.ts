import { ENV }          from "@/lib/utils/env";
import type { Session } from "@auth/core/types";


export class SignInService {
    static async signIn( session: Session, provider: string ): Promise<any> {
        const newSession = session as any;
        const accessToken = newSession.accessToken;

        try {
            const response = await fetch( ENV.GUARDIANAPI_URL + ENV.GUARDIAN_AUTH_SOCIAL, {
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