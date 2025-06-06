'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Container,
    Button,
    LinearProgress,
} from '@mui/material';
import {
    TrendingUp,
} from '@mui/icons-material';
import Link from 'next/link';

export default function StakingInfoSection() {
    // Mock staking data from the images
    const stakingData = {
        marketCap: '$36,490,000',
        marketCapChange: '-$3,572,371 (-9.79%)',
        percentStaked: '57.09%',
        stakedUSD: '$20,832,988',
    };

    return (
        <Box sx={{ py: 8, backgroundColor: (theme) => theme.palette.grey[900] }}>
            <Container maxWidth="xl">
                <Typography
                    variant="h2"
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    💎 Staking Overview
                </Typography>

                <Grid container spacing={4} alignItems="center">
                    {/* Market Cap */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    $BOB Market Cap
                                </Typography>
                                <Typography variant="h4" color="primary.main" fontWeight={700}>
                                    {stakingData.marketCap}
                                </Typography>
                                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                                    {stakingData.marketCapChange}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Percentage Staked */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    % of $BOB Staked
                                </Typography>
                                <Typography variant="h4" color="primary.main" fontWeight={700}>
                                    {stakingData.percentStaked}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={57.09}
                                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Staked in USD */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Staked $BOB in USD
                                </Typography>
                                <Typography variant="h4" color="primary.main" fontWeight={700}>
                                    {stakingData.stakedUSD}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Staking CTA */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Link href="/staking" passHref>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<TrendingUp />}
                                    sx={{
                                        px: 4,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    Start Staking
                                </Button>
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}