'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
} from '@mui/material';

export default function StatsSection() {
    const stats = [
        {
            label: 'Total Staked',
            value: '$645,000',
            progress: 64.5,
            color: 'primary.main',
        },
        {
            label: 'Average APR',
            value: '12.4%',
            progress: 12.4,
            color: 'secondary.main',
        },
        {
            label: 'Active Projects',
            value: '5',
            progress: 50,
            color: 'primary.main',
        },
        {
            label: 'Community Members',
            value: '1,247',
            progress: 75,
            color: 'secondary.main',
        },
    ];

    return (
        <Box sx={{ py: 8 }}>
            <Typography
                variant="h2"
                sx={{
                    textAlign: 'center',
                    mb: 6,
                    background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                💎 Staking & Rewards
            </Typography>

            <Grid container spacing={4}>
                {stats.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 255, 136, 0.1)',
                                textAlign: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    border: '1px solid rgba(0, 255, 136, 0.3)',
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        color: stat.color,
                                        fontWeight: 700,
                                        mb: 1,
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                    {stat.label}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={stat.progress}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: stat.color,
                                            borderRadius: 3,
                                        },
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    Stake $BOB to earn share of yield from invested projects. Non-custodial, chain-native staking contracts with future airdrops to long-term stakers.
                </Typography>
            </Box>
        </Box>
    );
}