'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Button,
    Avatar,
    Divider,
} from '@mui/material';
import {
    People,
    TrendingUp,
    Star,
    ThumbUp,
    AccountBalanceWallet,
} from '@mui/icons-material';
import { Project } from '../../lib/types';

interface ProjectCardProps {
    project: Project;
    onViewDetails?: (project: Project) => void;
    onUpvote?: (projectId: string) => void;
    onInvest?: (projectId: string) => void;
}

export default function ProjectCard({
    project,
    onViewDetails,
    onUpvote,
    onInvest,
}: ProjectCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live':
                return 'success';
            case 'pending':
                return 'warning';
            case 'ended':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'live':
                return 'Community Heat';
            case 'pending':
                return 'Initial Funding';
            case 'ended':
                return 'Verified';
            default:
                return status;
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 255, 136, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0, 255, 136, 0.2)',
                },
            }}
        >
            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                backgroundColor: 'primary.main',
                                color: 'black',
                                fontWeight: 700,
                            }}
                        >
                            {project.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" color="primary.main" fontWeight={600}>
                                {project.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ${project.ticker}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={getStatusLabel(project.status)}
                        size="small"
                        color={getStatusColor(project.status) as any}
                        sx={{ fontSize: '0.75rem' }}
                    />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, flexGrow: 1, lineHeight: 1.5 }}
                >
                    {project.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Chip
                        label={project.category}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                    />
                </Box>

                <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People fontSize="small" color="primary" />
                        <Typography variant="body2">
                            Believers: {project.believers}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star fontSize="small" color="secondary" />
                        <Typography variant="body2">
                            Reviews: {project.reviews}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceWallet fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                            Simulated: ${project.simulatedInvestment.toLocaleString()}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                        BOB Score: {project.bobScore}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="secondary.main" fontWeight={600}>
                        Est. Return: {project.estimatedReturn}%
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onViewDetails?.(project)}
                        sx={{ flex: 1 }}
                    >
                        Project Details
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<ThumbUp />}
                        onClick={() => onUpvote?.(project.$id!)}
                        sx={{ minWidth: 'auto' }}
                    >
                        Upvote
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={() => onInvest?.(project.$id!)}
                        sx={{ minWidth: 'auto' }}
                    >
                        Review
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}