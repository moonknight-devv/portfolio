import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * Custom hook for modern Admin Authentication Lifecycle.
 * Handles rate limiting, lockout, and session persistence.
 */
export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.validateSession());
    const [isVerifying, setIsVerifying] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lastError, setLastError] = useState<string | null>(null);

    const MAX_ATTEMPTS = 3;

    // Check session on mount and focus
    useEffect(() => {
        const check = () => {
            const isValid = authService.validateSession();
            setIsAuthenticated(isValid);
            if (!isValid && isAuthenticated) {
                // Unexpected session loss
                setIsAuthenticated(false);
            }
        };
        window.addEventListener('focus', check);
        return () => window.removeEventListener('focus', check);
    }, [isAuthenticated]);

    const login = useCallback(async (passcode: string) => {
        if (isLocked || isVerifying) return false;

        setIsVerifying(true);
        setLastError(null);

        const token = await authService.authenticate(passcode);

        if (token) {
            setIsAuthenticated(true);
            setAttempts(0);
            setIsVerifying(false);
            return true;
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            setLastError("CRITICAL_ERROR: Unauthorized sequence.");

            if (newAttempts >= MAX_ATTEMPTS) {
                setIsLocked(true);
            }

            setIsVerifying(false);
            return false;
        }
    }, [attempts, isLocked, isVerifying]);

    const logout = useCallback(() => {
        authService.logout();
        setIsAuthenticated(false);
    }, []);

    return {
        isAuthenticated,
        isVerifying,
        isLocked,
        attempts,
        lastError,
        login,
        logout,
        MAX_ATTEMPTS
    };
};
