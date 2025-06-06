'use client';

import {
    Box,
    Container,
    Typography,
    Grid,
    Link,
    IconButton,
} from '@mui/material';
import { Twitter, GitHub, Telegram } from '@mui/icons-material';
import Logo from './Logo';

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                py: 6,
                px: 0,
                background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
                borderTop: '1px solid #333',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Logo size="large" />
                        <Typography variant="body2" color="text.secondary">
                            Where conviction meets launch. Curate, rate, and help projects launch with belief.
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            Platform
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/explore" color="text.secondary" underline="hover">
                                Explore Projects
                            </Link>
                            <Link href="/submit" color="text.secondary" underline="hover">
                                Submit Project
                            </Link>
                            <Link href="/staking" color="text.secondary" underline="hover">
                                Staking
                            </Link>
                            <Link href="/leaderboard" color="text.secondary" underline="hover">
                                Leaderboard
                            </Link>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            Community
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Link href="/docs" color="text.secondary" underline="hover">
                                Documentation
                            </Link>
                            <Link href="/blog" color="text.secondary" underline="hover">
                                Blog
                            </Link>
                            <Link href="/support" color="text.secondary" underline="hover">
                                Support
                            </Link>
                            <Link href="/faq" color="text.secondary" underline="hover">
                                FAQ
                            </Link>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" gutterBottom>
                            Connect
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <IconButton color="primary" size="small">
                                <Twitter />
                            </IconButton>
                            <IconButton color="primary" size="small">
                                <GitHub />
                            </IconButton>
                            <IconButton color="primary" size="small">
                                <Telegram />
                            </IconButton>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Powered by conviction, community, and $BOB.
                        </Typography>
                    </Grid>
                </Grid>
                <Box
                    sx={{
                        mt: 4,
                        pt: 4,
                        borderTop: '1px solid #333',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © 2024 TokenReady. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}