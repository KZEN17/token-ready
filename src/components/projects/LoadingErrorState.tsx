'use client';

import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    alpha,
} from '@mui/material';

export function ProjectLoading() {
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            <CircularProgress
                size={60}
                sx={{
                    color: '#00ff88',
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    }
                }}
            />
            <Typography variant="h6" sx={{ mt: 2, color: '#00ff88' }}>
                Loading project details...
            </Typography>
        </Box>
    );
}

interface ProjectErrorProps {
    error: string;
}

export function ProjectError({ error }: ProjectErrorProps) {
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4
        }}>
            <Alert
                severity="error"
                sx={{
                    maxWidth: 600,
                    backgroundColor: alpha('#ff6b6b', 0.1),
                    color: '#ff6b6b',
                    border: '1px solid #ff6b6b',
                    borderRadius: 3,
                    '& .MuiAlert-icon': {
                        color: '#ff6b6b',
                    }
                }}
            >
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Project Not Found
                </Typography>
                {error || 'The project you are looking for does not exist or has been removed.'}
            </Alert>
        </Box>
    );
}