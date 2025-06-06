'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }

    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#f59e0b', // Orange/amber for buttons
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#000000',
        },
        secondary: {
            main: '#6366f1', // Purple/indigo as secondary
            light: '#818cf8',
            dark: '#4f46e5',
        },
        background: {
            default: '#0f0f23', // Very dark blue/purple background
            paper: '#1a1a2e', // Slightly lighter for cards
        },
        text: {
            primary: '#ffffff',
            secondary: '#94a3b8', // Light gray/blue for secondary text
        },
        divider: 'rgba(100, 116, 139, 0.12)', // Subtle blue-gray dividers
        grey: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b', // Dark surfaces
            900: '#0f172a', // Darker surfaces
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '3.5rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            fontWeight: 400,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    boxSizing: 'border-box',
                },
                '*, *::before, *::after': {
                    boxSizing: 'inherit',
                },
                body: {
                    margin: 0,
                    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                    minHeight: '100vh',
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#000000',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                        boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                    },
                    '&:disabled': {
                        background: '#334155',
                        color: '#64748b',
                    },
                },
                outlined: {
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    borderWidth: '1px',
                    '&:hover': {
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                        borderWidth: '1px',
                    },
                },
                text: {
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(26, 26, 46, 0.6)',
                    border: '1px solid rgba(100, 116, 139, 0.12)',
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(20px)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(26, 26, 46, 0.6)',
                    border: '1px solid rgba(100, 116, 139, 0.12)',
                    backdropFilter: 'blur(20px)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: 8,
                        '& fieldset': {
                            borderColor: 'rgba(100, 116, 139, 0.2)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(100, 116, 139, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#f59e0b',
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(148, 163, 184, 0.8)',
                        '&.Mui-focused': {
                            color: '#f59e0b',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                },
                filled: {
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#f59e0b',
                },
                outlined: {
                    borderColor: 'rgba(100, 116, 139, 0.2)',
                    color: 'rgba(148, 163, 184, 0.9)',
                    '&:hover': {
                        backgroundColor: 'rgba(100, 116, 139, 0.05)',
                    },
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(100, 116, 139, 0.15)',
                    borderRadius: 4,
                    height: 6,
                },
                bar: {
                    background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: 4,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(15, 15, 35, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(100, 116, 139, 0.12)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: 'rgba(148, 163, 184, 0.8)',
                    '&:hover': {
                        backgroundColor: 'rgba(100, 116, 139, 0.1)',
                        color: '#ffffff',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(100, 116, 139, 0.12)',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: 'rgba(26, 26, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(100, 116, 139, 0.12)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    },
                },
            },
        },
    },
});