'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Container,
    Chip,
    LinearProgress,
} from '@mui/material';
import {
    Star,
    ThumbUp,
    RateReview,
    AccountBalanceWallet,
    EmojiEvents,
    Timeline,
} from '@mui/icons-material';

export default function BelieverPointsSection() {
    const believerActivities = [
        {
            activity: 'Writing Reviews',
            points: '10-50 BP',
            description: 'Earn believer points by writing detailed project reviews',
            icon: <RateReview />,
            color: '#00ff88'
        },
        {
            activity: 'Voting & Rating',
            points: '5-25 BP',
            description: 'Participate in community voting and rate projects',
            icon: <ThumbUp />,
            color: '#ff6b6b'
        },
        {
            activity: 'Staking $BOB',
            points: '1 BP/day',
            description: 'Stake $BOB tokens to earn daily believer points',
            icon: <AccountBalanceWallet />,
            color: '#00ff88'
        },
        {
            activity: 'Early Adoption',
            points: '100-500 BP',
            description: 'Bonus points for being early supporters of successful projects',
            icon: <EmojiEvents />,
            color: '#ffa726'
        },
        {
            activity: 'KOL Endorsement',
            points: '200+ BP',
            description: 'Crypto influencers get bonus points for project endorsements',
            icon: <Star />,
            color: '#ab47bc'
        },
        {
            activity: 'Performance Tracking',
            points: 'Variable',
            description: 'Earn based on the success of projects you supported early',
            icon: <Timeline />,
            color: '#26c6da'
        }
    ];

    const topBelievers = [
        { rank: 1, username: '@crypto_sage', points: 2547, projects: 12 },
        { rank: 2, username: '@early_bird', points: 2103, projects: 8 },
        { rank: 3, username: '@degen_scout', points: 1876, projects: 15 },
        { rank: 4, username: '@alpha_hunter', points: 1654, projects: 9 },
        { rank: 5, username: '@conviction_king', points: 1432, projects: 11 },
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
                💫 Believer Points System
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'center', mb: 8, maxWidth: '600px', mx: 'auto' }}
            >
                Earn Believer Points (BP) by participating in the TokenReady ecosystem. Your on-chain reputation for early conviction and community participation.
            </Typography>

            {/* How to Earn Believer Points */}
            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
                    ⭐ How to Earn Believer Points
                </Typography>
                <Grid container spacing={3}>
                    {believerActivities.map((activity, index) => (
                        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(0, 255, 136, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        border: `1px solid ${activity.color}`,
                                        transform: 'translateY(-4px)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                backgroundColor: activity.color,
                                                color: 'black',
                                                mr: 2,
                                                width: 48,
                                                height: 48,
                                            }}
                                        >
                                            {activity.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight={600}>
                                                {activity.activity}
                                            </Typography>
                                            <Chip
                                                label={activity.points}
                                                size="small"
                                                sx={{
                                                    backgroundColor: activity.color,
                                                    color: 'black',
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {activity.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Top Believers Leaderboard */}
            <Box>
                <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
                    🏆 Top Believers Leaderboard
                </Typography>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }} sx={{ mx: 'auto' }}>
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 255, 136, 0.1)',
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                {topBelievers.map((believer, index) => (
                                    <Box key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Chip
                                                    label={`#${believer.rank}`}
                                                    size="small"
                                                    color={believer.rank <= 3 ? 'primary' : 'default'}
                                                    sx={{ minWidth: '40px' }}
                                                />
                                                <Typography variant="h6" color="primary.main">
                                                    {believer.username}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Projects Supported
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {believer.projects}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Believer Points
                                                    </Typography>
                                                    <Typography variant="h6" color="primary.main">
                                                        {believer.points} BP
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        {index < topBelievers.length - 1 && (
                                            <Box sx={{ width: '100%', height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
                                        )}
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}