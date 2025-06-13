// src/components/projects/ProjectHeader.tsx 
'use client';

import {
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    Avatar,
    alpha,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import {
    ThumbUp,
    Launch,
    GitHub,
    X,
    Star,
    ThumbUpOutlined,
    People,
    AccountBalanceWallet,
    Person,
    Verified,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from '@/lib/appwrite';
import { Project } from '@/lib/types';
import { toTitleCase } from '@/utils/helpers';



interface Creator {
    $id: string;
    username: string;
    displayName: string;
    profileImage: string;
    isVerifiedKOL: boolean;
    verified: boolean;
    believerRank: string;
    followerCount: number;
}

interface ProjectHeaderProps {
    project: Project;
    currentUserId: string;
    onUpvote: () => void;
}

export default function ProjectHeader({
    project,
    currentUserId,
    onUpvote,
}: ProjectHeaderProps) {
    // Creator state
    const [creator, setCreator] = useState<Creator | null>(null);
    const [loadingCreator, setLoadingCreator] = useState(false);

    // Fetch creator information
    useEffect(() => {
        const fetchCreator = async () => {
            if (!project.createdBy || project.createdBy === 'user-id-placeholder') return;

            setLoadingCreator(true);
            try {
                const creatorResponse = await databases.getDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    project.createdBy
                );

                setCreator({
                    $id: creatorResponse.$id,
                    username: creatorResponse.username || 'anonymous',
                    displayName: creatorResponse.displayName || 'Anonymous Creator',
                    profileImage: creatorResponse.profileImage || '',
                    isVerifiedKOL: creatorResponse.isVerifiedKOL || false,
                    verified: creatorResponse.verified || false,
                    believerRank: creatorResponse.believerRank || 'Believer',
                    followerCount: creatorResponse.followerCount || 0,
                });
            } catch (error) {
                console.error('Failed to fetch creator:', error);
                setCreator(null);
            } finally {
                setLoadingCreator(false);
            }
        };

        fetchCreator();
    }, [project.createdBy]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return '#00ff88';
            case 'pending': return '#ffa726';
            case 'rejected': return '#ff6b6b';
            default: return '#757575';
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const isUpvoted = project.upvotes.includes(currentUserId);

    const renderCreatorInfo = () => {
        if (loadingCreator) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <CircularProgress size={16} sx={{ color: '#666' }} />
                    <Typography variant="caption" sx={{ color: '#888' }}>
                        Loading creator...
                    </Typography>
                </Box>
            );
        }

        if (!creator) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Person sx={{ color: '#666', fontSize: '1rem' }} />
                    <Typography variant="caption" sx={{ color: '#888' }}>
                        Creator: Unknown
                    </Typography>
                </Box>
            );
        }

        return (


            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                <Chip
                    avatar={<Avatar src={creator.profileImage || undefined} />}
                    label={`Creator: @${creator.username}`}
                    variant="outlined"
                    sx={{ color: '#00ff88', borderColor: '#00ff88' }}
                />

                <Chip
                    avatar={<Avatar src={`/${project.platform}.svg`} />}
                    label={`Platform: ${toTitleCase(project.platform)}`}
                    variant="outlined"
                    sx={{ color: '#00ff88', borderColor: '#00ff88' }}
                />

                <Chip
                    avatar={<Avatar src={`/${project.chain}.svg`} />}
                    label={`Chain: ${toTitleCase(project.chain)}`}
                    variant="outlined"
                    sx={{ color: '#00ff88', borderColor: '#00ff88' }}
                />

            </Box>


        );
    };

    return (
        <Card sx={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #333',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
        }}>
            <CardContent sx={{ p: 4 }}>
                {/* Status Indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: getStatusColor(project.status),
                        borderRadius: '12px 12px 0 0',
                    }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, mt: 1 }}>
                    <Avatar
                        src={project.logoUrl || undefined}
                        sx={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            color: '#000',
                            fontSize: '2rem',
                            fontWeight: 700,
                            border: '3px solid #333'
                        }}
                    >
                        {project.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h3" sx={{
                            color: '#00ff88',
                            fontWeight: 700,
                            mb: 1
                        }}>
                            {project.name}
                        </Typography>
                        <Typography variant="h6" sx={{
                            color: '#4dffb0',
                            mb: 2,
                            fontWeight: 'bold'
                        }}>
                            {project.ticker}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                                label={project.status}
                                sx={{
                                    backgroundColor: alpha(getStatusColor(project.status), 0.2),
                                    color: getStatusColor(project.status),
                                    border: `1px solid ${getStatusColor(project.status)}`,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}
                            />
                            <Chip
                                label={project.category}
                                sx={{
                                    backgroundColor: alpha('#00ff88', 0.1),
                                    color: '#00ff88',
                                    border: '1px solid #00ff88',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Chip
                                label="Community Reviewed"
                                sx={{
                                    backgroundColor: alpha('#ff6b6b', 0.1),
                                    color: '#ff6b6b',
                                    border: '1px solid #ff6b6b'
                                }}
                            />
                        </Box>

                        {/* Creator Info */}
                        {renderCreatorInfo()}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={isUpvoted ? <ThumbUp /> : <ThumbUpOutlined />}
                            onClick={onUpvote}
                            sx={{
                                background: isUpvoted
                                    ? 'linear-gradient(45deg, #00ff88, #4dffb0)'
                                    : 'linear-gradient(45deg, #333, #555)',
                                color: isUpvoted ? '#000' : '#FFF',
                                fontWeight: 'bold',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                                }
                            }}
                        >
                            Upvote ({formatNumber(project.upvotes?.length || 0)})
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Star />}
                            sx={{
                                borderColor: '#ffa726',
                                color: '#ffa726',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: alpha('#ffa726', 0.1),
                                    borderColor: '#ffa726'
                                }
                            }}
                        >
                            Submit Review
                        </Button>
                    </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: '#b0b0b0' }}>
                    {project.pitch}
                </Typography>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <ThumbUp sx={{ color: '#00ff88', mb: 1, fontSize: '2rem' }} />
                            <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                {formatNumber(project.upvotes?.length || 0)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Upvotes
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <People sx={{ color: '#ff6b6b', mb: 1, fontSize: '2rem' }} />
                            <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                {formatNumber(project.believers)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Believers
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <AccountBalanceWallet sx={{ color: '#00ff88', mb: 1, fontSize: '2rem' }} />
                            <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                ${formatNumber(project.totalStaked)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Total Staked
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Star sx={{ color: '#ffa726', mb: 1, fontSize: '2rem' }} />
                            <Typography variant="h6" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                {project.bobScore || '-'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                BOB Score
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        startIcon={<Launch />}
                        href={project.website}
                        target="_blank"
                        sx={{
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                            }
                        }}
                    >
                        Website
                    </Button>
                    {project.github && (
                        <Button
                            variant="outlined"
                            startIcon={<GitHub />}
                            href={project.github}
                            target="_blank"
                            sx={{
                                borderColor: '#000',
                                color: '#666',
                                '&:hover': {
                                    backgroundColor: alpha('#666', 0.1),
                                    borderColor: '#666'
                                }
                            }}
                        >
                            GitHub
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={null}
                        href={`https://twitter.com/${project.twitter.replace('@', '')}`}
                        target="_blank"
                        sx={{
                            textAlign: 'center',
                            borderColor: '#000',
                            backgroundColor: '#000',
                            justifyContent: 'center',
                            alignContent: 'center',
                            color: '#fff',
                            minWidth: '70px',
                            padding: '6px 0',
                            '&:hover': {
                                backgroundColor: '#000',
                                borderColor: '#fff'
                            }
                        }}
                    >
                        <X fontSize='medium' />
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}