'use client';

import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    TextField,
    Slider,
    Alert,
    Divider,
    Link,
} from '@mui/material';
import { useState } from 'react';
import {
    ThumbUp,
    Launch,
    GitHub,
    Twitter,
    TrendingUp,
    People,
    Star,
} from '@mui/icons-material';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const [rating, setRating] = useState(8);
    const [review, setReview] = useState('');
    const [investment, setInvestment] = useState(1500);

    // Mock project data - replace with actual API call
    const project = {
        id: params.id,
        name: 'VaderAI',
        ticker: 'VADER',
        description: 'AI-powered trading agent protocol revolutionizing automated trading strategies with advanced machine learning algorithms.',
        longDescription: 'VaderAI represents the next evolution in automated trading technology. Our AI-powered protocol combines advanced machine learning algorithms with real-time market analysis to create sophisticated trading strategies that adapt to changing market conditions. Built on a decentralized infrastructure, VaderAI ensures transparency, security, and accessibility for traders of all levels.',
        website: 'https://vaderai.com',
        github: 'https://github.com/vaderai',
        twitter: '@vaderai',
        category: 'AI & Tools',
        status: 'live',
        believers: 178,
        reviews: 12,
        bobScore: 91,
        estimatedReturn: 14,
        simulatedInvestment: 127000,
        team: [
            { name: 'Alex Chen', role: 'CEO & Founder', twitter: '@alexchen' },
            { name: 'Sarah Kim', role: 'CTO', twitter: '@sarahkim' },
            { name: 'Mike Johnson', role: 'Head of AI', twitter: '@mikej' },
        ],
        roadmap: [
            { phase: 'Q1 2024', title: 'MVP Launch', status: 'completed' },
            { phase: 'Q2 2024', title: 'Beta Testing', status: 'completed' },
            { phase: 'Q3 2024', title: 'Public Launch', status: 'current' },
            { phase: 'Q4 2024', title: 'Advanced Features', status: 'upcoming' },
        ],
    };

    const recentReviews = [
        { user: '@alpha_bob', rating: 9, comment: 'SMOJO team is KYC&apos;d & docs ready. Worth watching.', bobPoints: 187 },
        { user: '@earlydgen', rating: 7, comment: 'XENO looks rushed. Website is one pager and no GitHub.', bobPoints: 161 },
        { user: '@honestbagger', rating: 8, comment: 'SARC is overhyped but still has devs shipping.', bobPoints: 140 },
        { user: '@checkmate', rating: 9, comment: 'SKAI has the best tokenomics I\'ve seen so far.', bobPoints: 126 },
    ];

    const handleSubmitReview = () => {
        console.log('Submitting review:', { rating, review, investment });
        // Reset form
        setRating(8);
        setReview('');
        setInvestment(1500);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Project Header */}
                <Grid size={{ xs: 12 }} >
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: 'primary.main',
                                        color: 'black',
                                        fontSize: '2rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    {project.name.charAt(0)}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h3" color="primary.main" fontWeight={700}>
                                        {project.name}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                        ${project.ticker}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip label={project.category} color="primary" variant="outlined" />
                                        <Chip label="Community Heat" color="warning" />
                                        <Chip label="Verified" color="success" />
                                        <Chip label="AMA Scheduled" color="info" />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Button variant="contained" startIcon={<ThumbUp />}>
                                        Upvote
                                    </Button>
                                    <Button variant="outlined" startIcon={<Star />}>
                                        Submit Review
                                    </Button>
                                </Box>
                            </Box>

                            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                                {project.description}
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 6, sm: 3 }} >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <People color="primary" sx={{ mb: 1 }} />
                                        <Typography variant="h6" color="primary.main">
                                            {project.believers}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Believers
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }} >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Star color="secondary" sx={{ mb: 1 }} />
                                        <Typography variant="h6" color="secondary.main">
                                            {project.reviews}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Reviews
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }} >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <TrendingUp sx={{ mb: 1 }} />
                                        <Typography variant="h6" color="primary.main">
                                            ${project.simulatedInvestment.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Simulated Investment
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }} >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                                            {project.bobScore}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            BOB Score
                                        </Typography>
                                        <Typography variant="body2" color="secondary.main">
                                            Est. Return: {project.estimatedReturn}%
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Launch />}
                                    component={Link}
                                    href={project.website}
                                    target="_blank"
                                >
                                    Website
                                </Button>
                                {project.github && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<GitHub />}
                                        component={Link}
                                        href={project.github}
                                        target="_blank"
                                    >
                                        GitHub
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    startIcon={<Twitter />}
                                    component={Link}
                                    href={`https://twitter.com/${project.twitter.replace('@', '')}`}
                                    target="_blank"
                                >
                                    Twitter
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Project Interaction */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                📊 Project Interaction Page — ${project.ticker}
                            </Typography>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Rate This Project (1-10)
                                </Typography>
                                <Slider
                                    value={rating}
                                    onChange={(_, newValue) => setRating(newValue as number)}
                                    min={1}
                                    max={10}
                                    step={1}
                                    marks
                                    valueLabelDisplay="on"
                                    sx={{ mb: 2 }}
                                />
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Short Review
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Why do you believe in this project?"
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                />
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Simulate Investment (in $BOB Points)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    placeholder="e.g. 1500"
                                    value={investment}
                                    onChange={(e) => setInvestment(Number(e.target.value))}
                                />
                                <Alert severity="warning" sx={{ mt: 1 }}>
                                    ⚠️ This project is considered oversubscribed after $100,000 total virtual pledges.
                                </Alert>
                            </Box>

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handleSubmitReview}
                                sx={{ py: 2 }}
                            >
                                📝 Submit Review & Simulated Investment
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Latest Reviews */}
                <Grid size={{ xs: 12, md: 4 }} >
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                📋 Latest Reviews
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {recentReviews.map((review, index) => (
                                    <Box key={index}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="subtitle2" color="primary.main">
                                                {review.user}
                                            </Typography>
                                            <Chip
                                                label={`${review.bobPoints} BOB Points`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            "{review.comment}"
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Star fontSize="small" color="secondary" />
                                            <Typography variant="body2">
                                                Rating: {review.rating}/10
                                            </Typography>
                                        </Box>
                                        {index < recentReviews.length - 1 && <Divider sx={{ mt: 2 }} />}
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Detailed Information */}
                <Grid size={{ xs: 12 }} >
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                About {project.name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                                {project.longDescription}
                            </Typography>

                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 6 }} >
                                    <Typography variant="h6" gutterBottom>
                                        👥 Team
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {project.team.map((member, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ backgroundColor: 'primary.main', color: 'black' }}>
                                                    {member.name.split(' ').map(n => n[0]).join('')}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle1">{member.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {member.role} • {member.twitter}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }} >
                                    <Typography variant="h6" gutterBottom>
                                        🗺️ Roadmap
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {project.roadmap.map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Chip
                                                    label={item.phase}
                                                    size="small"
                                                    color={
                                                        item.status === 'completed' ? 'success' :
                                                            item.status === 'current' ? 'primary' : 'default'
                                                    }
                                                />
                                                <Typography variant="body1">{item.title}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}