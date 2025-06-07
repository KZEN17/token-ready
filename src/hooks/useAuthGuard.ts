// src/hooks/useAuthGuard.ts
'use client';

import { useUser } from './useUser';
import { useState } from 'react';

interface AuthGuardResult {
    isAuthenticated: boolean;
    requireAuth: (action: () => void, actionName?: string) => void;
    showAuthDialog: boolean;
    hideAuthDialog: () => void;
    authMessage: string;
    login: () => void;
}

export const useAuthGuard = (): AuthGuardResult => {
    const { authenticated, login } = useUser();
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authMessage, setAuthMessage] = useState('');

    const requireAuth = (action: () => void, actionName = 'perform this action') => {
        if (authenticated) {
            action();
        } else {
            setAuthMessage(`Please login with X to ${actionName}`);
            setShowAuthDialog(true);
        }
    };

    const hideAuthDialog = () => {
        setShowAuthDialog(false);
        setAuthMessage('');
    };

    return {
        isAuthenticated: authenticated,
        requireAuth,
        showAuthDialog,
        hideAuthDialog,
        authMessage,
        login,
    };
};