'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Container,
    IconButton,
} from '@mui/material';
import { Twitter, LinkedIn } from '@mui/icons-material';

export default function TeamSection() {
    const teamMembers = [
        {
            name: 'Alex Chen',
            role: 'CEO & Founder',
            description: 'Former Goldman Sachs, 10+ years in DeFi and trading algorithms',
            avatar: 'AC',
            twitter: '@alexchen_tr',
            linkedin: 'alexchen'
        },
        {
            name: 'Sarah Kim',
            role: 'CTO',
            description: 'Ex-Google engineer, blockchain infrastructure expert',
            avatar: 'SK',
            twitter: '@sarahkim_dev',
            linkedin: 'sarahkim'
        },
        {
            name: 'Mike Johnson',
            role: 'Head of Community',
            description: 'Crypto influencer with 100K+ followers, community growth specialist',
            avatar: 'MJ',
            twitter: '@mikej_crypto',
            linkedin: 'mikejohnson'
        },
        {
            name: 'Emma Davis',
            role: 'Lead Developer',
            description: 'Full-stack developer, smart contract security auditor',
            avatar: 'ED',
            twitter: '@emma_builds',
            linkedin: 'emmadavis'
        },
        {
            name: 'David Park',
            role: 'Head of Partnerships',
            description: 'Business development, strategic partnerships in crypto',
            avatar: 'DP',
            twitter: '@davidpark_biz',
            linkedin: 'davidpark'
        },
        {
            name: 'Lisa Wang',
            role: 'Product Manager',
            description: 'Product strategy, user experience design for Web3 platforms',
            avatar: 'LW',
            twitter: '@lisa_pm',
            linkedin: 'lisawang'
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Grid container spacing={6} alignItems="center">
                {/* Left side - Text */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            mb: 4,
                            background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        👥 Our Team
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}
                    >
                        We're a team of crypto natives, engineers, and community builders who believe in the power of conviction-driven investing. Our diverse backgrounds in traditional finance, blockchain technology, and community growth help us build the future of project launches.
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}
                    >
                        From Wall Street to Silicon Valley, our team brings decades of combined experience in building products that connect communities with groundbreaking projects.
                    </Typography>
                    <Box sx={{ p: 3, background: 'rgba(0, 255, 136, 0.1)', borderRadius: 2, border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                        <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                            🚀 We're Hiring!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Join our mission to revolutionize how projects launch and communities invest. We're looking for passionate builders who share our vision.
                        </Typography>
                    </Box>
                </Grid>

                {/* Right side - Team Grid */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Grid container spacing={3}>
                        {teamMembers.map((member, index) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                <Card
                                    sx={{
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
                                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                        <Avatar
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                backgroundColor: 'primary.main',
                                                color: 'black',
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                mx: 'auto',
                                                mb: 2,
                                            }}
                                        >
                                            {member.avatar}
                                        </Avatar>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                            {member.name}
                                        </Typography>
                                        <Typography variant="body2" color="primary.main" sx={{ mb: 2, fontWeight: 600 }}>
                                            {member.role}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem', lineHeight: 1.4 }}>
                                            {member.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                sx={{ color: '#00ff88' }}
                                                href={`https://twitter.com/${member.twitter.replace('@', '')}`}
                                                target="_blank"
                                            >
                                                <Twitter fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ color: '#00ff88' }}
                                                href={`https://linkedin.com/in/${member.linkedin}`}
                                                target="_blank"
                                            >
                                                <LinkedIn fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}