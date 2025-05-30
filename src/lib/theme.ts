'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00ff88',
            light: '#4dffb0',
            dark: '#00cc6a',
        },
        secondary: {
            main: '#ff6b6b',
            light: '#ff9999',
            dark: '#cc5555',
        },
        background: {
            default: '#0a0a0a',
            paper: '#1a1a1a',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2.5rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '12px 24px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid #333',
                    background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '& fieldset': {
                            borderColor: '#333',
                        },
                        '&:hover fieldset': {
                            borderColor: '#555',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00ff88',
                        },
                    },
                },
            },
        },
    },
});