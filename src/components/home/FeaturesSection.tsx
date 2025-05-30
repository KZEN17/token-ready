'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
} from '@mui/material';
import {
    CheckCircle,
    Group,
    Schedule,
    TrendingUp,
    AccountBalanceWallet,
    Star,
} from '@mui/icons-material';

export default function FeaturesSection() {
    const founderFeatures = [
        {
            icon: <CheckCircle />,
            title: 'Launch Checklist',
            description: 'Follow a step-by-step launch guide based on the Aixbc Founder Playbook. Mark progress and get verified.',
        },
        {
            icon: <Group />,
            title: 'Community Vetting',
            description: 'Get reviewed, rated, and supported by BOB believers. Build trust and momentum before you launch.',
        },
        {
            icon: <Schedule />,
            title: 'Schedule Launch',
            description: 'Coordinate launch timing with BelieverApp, book a Twitter Space with Ben Pasternak, and maximize hype.',
        },
    ];

    const communityFeatures = [
        {
            icon: <TrendingUp />,
            title: 'Simulate Investments',
            description: 'Use virtual points to simulate investments in projects you believe in. Track performance and influence visibility.',
        },
        {
            icon: <AccountBalanceWallet />,
            title: 'Earn BOB Points',
            description: 'Submit reviews, vote, and support founders to earn BOB points — your on-chain rep for early conviction.',
        },
        {
            icon: <Star />,
            title: 'Public Signal',
            description: 'Top-reviewed projects get the BOB Signal, featured on Twitter and the BelieverApp launch radar.',
        },
    ];

    const comingSoonFeatures = [
        {
            icon: <Group />,
            title: 'Creator Dashboard',
            description: 'Supporters can sign up via Twitter to link themselves to upcoming projects they back.',
        },
        {
            icon: <Schedule />,
            title: 'Telegram Bot Alerts',
            description: 'Get notified when projects complete their checklist or schedule launches. Never miss a moment to ape in early.',
        },
        {
            icon: <TrendingUp />,
            title: 'Leaderboards',
            description: 'Track top reviewers and believers by points earned and performance of their virtual portfolio.',
        },
    ];

    const FeatureGrid = ({ features, title }: { features: typeof founderFeatures, title: string }) => (
        <Box sx={{ mb: 8 }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
                {title}
            </Typography>
            <Grid container spacing={4}>
                {features.map((feature, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 255, 136, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    border: '1px solid rgba(0, 255, 136, 0.3)',
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Avatar
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'black',
                                        mb: 2,
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    {feature.icon}
                                </Avatar>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

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
                Built for Believers
            </Typography>

            <FeatureGrid features={founderFeatures} title="📋 For Founders" />
            <FeatureGrid features={communityFeatures} title="⭐ For the Community" />
            <FeatureGrid features={comingSoonFeatures} title="🚀 Coming Soon" />
        </Box>
    );
}