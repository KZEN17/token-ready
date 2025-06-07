'use client';

import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Link from 'next/link';

interface EmptyStateProps {
    hasProjects: boolean;
}

export default function EmptyState({ hasProjects }: EmptyStateProps) {
    return (
        <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h4" sx={{ color: '#00ff88', mb: 2, fontWeight: 'bold' }}>
                No Projects Found
            </Typography>
            <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 4 }}>
                {!hasProjects
                    ? "Be the first to submit a project and get featured!"
                    : "Try adjusting your search or filters."}
            </Typography>
            <Button
                component={Link}
                href="/submit"
                variant="contained"
                size="large"
                startIcon={<Add />}
                sx={{
                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                    color: '#000',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                        background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                    }
                }}
            >
                Submit Your Project
            </Button>
        </Box>
    );
}