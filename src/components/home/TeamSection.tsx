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
    Stack,
} from '@mui/material';
import { Twitter, LinkedIn } from '@mui/icons-material';

export default function TeamSection() {
    const teamMembers = [
        {
            name: 'Alex Chen',
            role: 'CEO & Founder',
            description: 'Former Goldman Sachs, 10+ years in DeFi and trading algorithms',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            twitter: '@alexchen_tr',
            linkedin: 'alexchen'
        },
        {
            name: 'Sarah Kim',
            role: 'CTO',
            description: 'Ex-Google engineer, blockchain infrastructure expert',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            twitter: '@sarahkim_dev',
            linkedin: 'sarahkim'
        },
        {
            name: 'Mike Johnson',
            role: 'Head of Community',
            description: 'Crypto influencer with 100K+ followers, community growth specialist',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            twitter: '@mikej_crypto',
            linkedin: 'mikejohnson'
        },
        {
            name: 'Emma Davis',
            role: 'Lead Developer',
            description: 'Full-stack developer, smart contract security auditor',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            twitter: '@emma_builds',
            linkedin: 'emmadavis'
        },
        {
            name: 'David Park',
            role: 'Head of Partnerships',
            description: 'Business development, strategic partnerships in crypto',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            twitter: '@davidpark_biz',
            linkedin: 'davidpark'
        },
        {
            name: 'Lisa Wang',
            role: 'Product Manager',
            description: 'Product strategy, user experience design for Web3 platforms',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
            twitter: '@lisa_pm',
            linkedin: 'lisawang'
        }
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            {/* Team Description */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography
                    variant="h2"
                    sx={{
                        mb: 4,
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
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
                    sx={{ mb: 4, lineHeight: 1.7, fontSize: '1.1rem', maxWidth: '800px', mx: 'auto' }}
                >
                    We're a team of crypto natives, engineers, and community builders who believe in the power of conviction-driven investing. Our diverse backgrounds in traditional finance, blockchain technology, and community growth help us build the future of project launches.
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.7, fontSize: '1.1rem', maxWidth: '800px', mx: 'auto' }}
                >
                    From Wall Street to Silicon Valley, our team brings decades of combined experience in building products that connect communities with groundbreaking projects.
                </Typography>
                <Box sx={{
                    p: 3,
                    background: (theme) => `${theme.palette.primary.main}15`,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.primary.main}30`,
                    maxWidth: '600px',
                    mx: 'auto'
                }}>
                    <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                        🚀 We're Hiring!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Join our mission to revolutionize how projects launch and communities invest. We're looking for passionate builders who share our vision.
                    </Typography>
                </Box>
            </Box>

            {/* Team Cards - Horizontal on md/lg, vertical on smaller screens */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
                sx={{
                    overflowX: { md: 'auto' },
                    pb: { md: 2 },
                }}
            >
                {teamMembers.map((member, index) => (
                    <Card
                        key={index}
                        sx={{
                            minWidth: { md: '280px' },
                            flex: { md: '0 0 auto' },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}20`,
                            },
                        }}
                    >
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Avatar
                                src={member.avatar}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mx: 'auto',
                                    mb: 2,
                                    border: (theme) => `3px solid ${theme.palette.primary.main}`,
                                }}
                            />
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                {member.name}
                            </Typography>
                            <Typography variant="body2" color="primary.main" sx={{ mb: 2, fontWeight: 600 }}>
                                {member.role}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '0.85rem', lineHeight: 1.4 }}>
                                {member.description}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'primary.main' }}
                                    href={`https://twitter.com/${member.twitter.replace('@', '')}`}
                                    target="_blank"
                                >
                                    <Twitter fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    sx={{ color: 'primary.main' }}
                                    href={`https://linkedin.com/in/${member.linkedin}`}
                                    target="_blank"
                                >
                                    <LinkedIn fontSize="small" />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Container>
    );
}