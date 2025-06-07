'use client';

import { Fab, alpha } from '@mui/material';
import { Add } from '@mui/icons-material';
import Link from 'next/link';

export default function FloatingActionButton() {
    return (
        <Fab
            component={Link}
            href="/submit"
            sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                color: '#000',
                width: 64,
                height: 64,
                '&:hover': {
                    background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 25px rgba(0, 255, 136, 0.4)',
                },
                boxShadow: `0 8px 25px ${alpha('#00ff88', 0.4)}`,
            }}
        >
            <Add sx={{ fontSize: '2rem' }} />
        </Fab>
    );
}