// src/components/projects/form/SubmitButton.tsx
'use client';

import {
    Button,
    CircularProgress,
    Box,
    alpha,
} from '@mui/material';

interface SubmitButtonProps {
    loading: boolean;
    disabled: boolean;
    onClick?: () => void;
}

export default function SubmitButton({ loading, disabled, onClick }: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || disabled}
            onClick={onClick}
            sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                color: (theme) => theme.palette.primary.contrastText,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
                '&:disabled': {
                    background: (theme) => alpha(theme.palette.text.secondary, 0.3),
                    color: (theme) => alpha(theme.palette.text.secondary, 0.7),
                    boxShadow: 'none',
                    transform: 'none',
                }
            }}
        >
            {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'inherit' }} />
                    Submitting for Curation...
                </Box>
            ) : (
                onClick ? '🔄 Submit Another Project' : '🚀 Submit Project'
            )}
        </Button>
    );
}