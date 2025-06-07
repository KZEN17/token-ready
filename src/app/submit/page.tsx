'use client';

import ProjectForm from '@/components/projects/ProjectForm';
import { theme } from '@/lib/theme';
import { Container, Typography, Box, Stack } from '@mui/material';

export default function SubmitPage() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack direction='row' spacing={2} justifyContent='center' alignItems='center' sx={{ mb: 2 }}>
                <Typography
                    variant="h2"
                    sx={{
                        mb: 2,
                        textAlign: 'center',
                    }}
                >
                    🚀
                </Typography>
                <Typography
                    variant="h2"
                    sx={{
                        mb: 2,
                        textAlign: 'center',
                        background: `linear-gradient(135deg, #ffffff 0%,${theme.palette.primary.main}  100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Submit Your Project to TokenReady
                </Typography>
            </Stack>

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