'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Container,
} from '@mui/material';
import {
    AccountBalanceWallet,
    Star,
    TrendingUp,
} from '@mui/icons-material';

export default function HowItWorksSection() {
    const steps = [
        {
            number: '01',
            title: 'Buy and Stake $VADER',
            description: 'Purchase and stake $VADER to start earning points. The longer you stake, the more Virtual Genesis Points you earn daily.',
            icon: <AccountBalanceWallet />,
            color: '#00ff88'
        },
        {
            number: '02',
            title: 'Earn Daily Virtual Genesis Points',
            description: 'Staking $VADER automatically generates Virtual Genesis Points every day. No extra steps required — just stake and earn.',
            icon: <Star />,
            color: '#ff6b6b'
        },
        {
            number: '03',
            title: 'Spend Virtual Genesis Points in the Virtual System',
            description: 'Use your Virtual Genesis Points to access features, benefits, and opportunities inside the Virtual ecosystem.',
            icon: <TrendingUp />,
            color: '#00ff88'
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
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
                How It Works
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'center', mb: 6, maxWidth: '600px', mx: 'auto' }}
            >
                Vader made a strategic partnership with the Virtual team and 5% of Virtual Genesis Points will be distributed to Vader Stakers based on $VADER Score.
            </Typography>

            <Grid container spacing={4}>
                {steps.map((step, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 255, 136, 0.1)',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'visible',
                                '&:hover': {
                                    border: '1px solid rgba(0, 255, 136, 0.3)',
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            {/* Step Number */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -20,
                                    left: 20,
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'black',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                }}
                            >
                                {step.number}
                            </Box>

                            <CardContent sx={{ p: 4, pt: 5 }}>
                                <Avatar
                                    sx={{
                                        backgroundColor: step.color,
                                        color: 'black',
                                        mb: 3,
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    {step.icon}
                                </Avatar>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                    {step.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                    {step.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}