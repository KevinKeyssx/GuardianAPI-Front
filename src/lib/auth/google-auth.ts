export async function setupAuthGoogle() {
    try {
        const { createAuthClient }  = await import('better-auth/client');
        const authClient            = createAuthClient();
        console.log('🚀 ~ setupAuthGoogle ~ authClient:', authClient);
        try {
            const data = await authClient.signIn.social({
                provider: "google"
            });
            console.log('Sign in successful:', data);
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    } catch (error) {
        console.error('Error setting up auth:', error);
    }
}