/**
 * Adapter for Authentication management.
 * Abstracts the login logic and secret verification.
 * Prepares the system for a real JWT/OAuth backend flow.
 */
class AuthService {
    private readonly SECRET_HINT = import.meta.env.VITE_ADMIN_PASSCODE || "1234";
    private readonly SESSION_KEY = 'spector_sys_token';

    /**
     * Verifies passcode and returns an opaque session token on success.
     * In a real app, this would be a fetch() call returning a JWT.
     */
    async authenticate(passcode: string): Promise<string | null> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (passcode === this.SECRET_HINT) {
                    // Generate a "token" (In production, this comes from the backend)
                    const token = btoa(`admin:${Date.now()}:${Math.random()}`);
                    sessionStorage.setItem(this.SESSION_KEY, token);
                    resolve(token);
                } else {
                    resolve(null);
                }
            }, 1500);
        });
    }

    /**
     * Validates the current session token.
     * Prevents UI spoofing by checking token existence and format.
     */
    validateSession(): boolean {
        const token = sessionStorage.getItem(this.SESSION_KEY);
        if (!token) return false;

        try {
            // Mock validation: Check if it's a valid base64 admin token
            const decoded = atob(token);
            return decoded.startsWith('admin:');
        } catch {
            return false;
        }
    }

    /**
     * Revokes the current session.
     */
    logout(): void {
        sessionStorage.removeItem(this.SESSION_KEY);
    }
}

export const authService = new AuthService();
