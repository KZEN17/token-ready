'use client';

import { Typography, useTheme, Button } from '@mui/material';
import { Box, Container } from '@mui/system';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
export default function LeaderboardPage() {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
            }}
        >
            <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
                <LeaderboardOutlinedIcon
                    sx={{
                        fontSize: 280,
                        color: theme.palette.primary.main,
                        mb: 2,
                    }}
                />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Leaderboard Coming Soon
                </Typography>

                <Typography variant="body1" color="text.secondary" mb={4}>
                    This section is under development.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ borderRadius: '30px', px: 4 }}
                    href="/"
                >
                    Back to Home
                </Button>
            </Container>
        </Box>
    );
}
