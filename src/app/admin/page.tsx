// src/app/admin/page.tsx - Simple admin page without authentication
'use client';

import ShareVerificationAdmin from '@/components/admin/ShareVerificationAdmin';
import { Box, Typography, Container } from '@mui/material';

export default function AdminPage() {
    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            color: 'white',
            py: 4
        }}>
            <Container maxWidth="xl">
                <Typography
                    variant="h2"
                    sx={{
                        mb: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 900
                    }}
                >
                    🛠️ TokenReady Admin Panel
                </Typography>

                <ShareVerificationAdmin />
            </Container>
        </Box>
    );
}