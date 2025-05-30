'use client';

import ProjectForm from '@/components/projects/ProjectForm';
import { Container, Typography, Box } from '@mui/material';

export default function SubmitPage() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography
                variant="h2"
                sx={{
                    mb: 2,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                🚀 Submit Your Project to TokenReady
            </Typography>

            <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 6, textAlign: 'center' }}
            >
                Register to get curated by the community and schedule your BelieverApp launch.
            </Typography>

            <Box sx={{ mb: 4 }}>
                <ProjectForm />
            </Box>
        </Container>
    );
}