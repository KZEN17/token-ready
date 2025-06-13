// src/components/vca/VCADisplay.tsx - UPDATED to use projectId
'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Button,
    Skeleton,
    Tooltip,
    alpha,
    IconButton,
    Divider,
    Grid,
} from '@mui/material';
import {
    ContentCopy,
    Launch,
    ThumbUp,
    Share,
    Star,
    Done,
} from '@mui/icons-material';
import { VCAApi } from '../../lib/vca/api';
import { useUser } from '@/hooks/useUser';
import { VCAMetadata } from '@/lib/types';

interface VCADisplayProps {
    projectId: string;
    compact?: boolean;
}

export default function VCADisplay({ projectId, compact = false }: VCADisplayProps) {
    const { user, authenticated } = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vcaData, setVcaData] = useState<{
        address: string;
        metadata: VCAMetadata;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    // Load VCA data for this project
    useEffect(() => {
        loadVCAData();
    }, [projectId]);

    const loadVCAData = async () => {
        if (!projectId) return;

        try {
            setLoading(true);
            setError(null);

            // Use getVCAByProjectId instead of getVCABySlug
            const vca = await VCAApi.getVCAByProjectId(projectId);
            setVcaData(vca);

            setLoading(false);
        } catch (err) {
            console.error('Error loading VCA data:', err);
            setError('Failed to load VCA data');
            setLoading(false);
        }
    };

    // Handle copy address to clipboard
    const handleCopyAddress = () => {
        if (!vcaData) return;

        navigator.clipboard.writeText(vcaData.address)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy:', err);
            });
    };

    // Handle activity simulation
    const handleActivity = async (type: 'backing' | 'review' | 'share') => {
        if (!vcaData || !authenticated || !user) return;

        try {
            await VCAApi.addActivity(vcaData.address, {
                type,
                userId: user.$id,
                timestamp: new Date().toISOString(),
            });

            // Refresh VCA data
            loadVCAData();
        } catch (err) {
            console.error(`Error recording ${type} activity:`, err);
        }
    };

    // Format address for display
    const formatAddress = (address: string) => {
        if (!address) return '';
        if (address.length <= 12) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Render compact version
    if (compact) {
        return (
            <Card sx={{
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #333',
                borderRadius: 2,
                mb: 2,
            }}>
                <CardContent sx={{ p: 2 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: alpha('#fff', 0.1) }} />
                        </Box>
                    ) : error || !vcaData ? (
                        <Typography variant="body2" color="error">
                            {error || 'No VCA found for this project'}
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                                    Virtual Contract Address:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" fontFamily="monospace" sx={{ color: '#00ff88' }}>
                                        {formatAddress(vcaData.address)}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={handleCopyAddress}
                                        sx={{
                                            color: copied ? '#00ff88' : '#666',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {copied ? <Done fontSize="small" /> : <ContentCopy fontSize="small" />}
                                    </IconButton>
                                </Box>
                            </Box>
                            <Chip
                                label={`Score: ${vcaData.metadata.signalScore}`}
                                size="small"
                                sx={{
                                    backgroundColor: alpha('#00ff88', 0.2),
                                    color: '#00ff88',
                                    fontWeight: 'bold',
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Render full version
    return (
        <Card sx={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #333',
            borderRadius: 3,
            mb: 3,
        }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#00ff88', fontWeight: 'bold' }}>
                    Virtual Contract Address (VCA)
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Skeleton variant="text" width="100%" height={24} sx={{ bgcolor: alpha('#fff', 0.1) }} />
                        <Skeleton variant="text" width="80%" height={24} sx={{ bgcolor: alpha('#fff', 0.1) }} />
                        <Skeleton variant="rectangular" width="100%" height={56} sx={{ bgcolor: alpha('#fff', 0.1) }} />
                    </Box>
                ) : error || !vcaData ? (
                    <Box sx={{ p: 2, border: '1px solid #333', borderRadius: 2 }}>
                        <Typography variant="body1" color="error">
                            {error || 'No VCA found for this project'}
                        </Typography>
                        {authenticated && (
                            <Typography variant="body2" sx={{ color: '#888', mt: 1 }}>
                                Would you like to create a VCA for this project?
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                                Address:
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 2,
                                backgroundColor: alpha('#00ff88', 0.05),
                                borderRadius: 2,
                                border: '1px solid #333',
                            }}>
                                <Typography variant="body1" fontFamily="monospace" sx={{ color: 'white', wordBreak: 'break-all' }}>
                                    {vcaData.address}
                                </Typography>
                                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} arrow>
                                    <IconButton
                                        size="small"
                                        onClick={handleCopyAddress}
                                        sx={{
                                            color: copied ? '#00ff88' : '#666',
                                            '&:hover': {
                                                backgroundColor: alpha('#00ff88', 0.1),
                                            }
                                        }}
                                    >
                                        {copied ? <Done /> : <ContentCopy />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                        {vcaData.metadata.signalScore}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        Signal Score
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                        {vcaData.metadata.uniqueBackers}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        Unique Backers
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                        {vcaData.metadata.reviews}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#888' }}>
                                        Reviews
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {vcaData.metadata.tokenAddress && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                                    Mapped Token Contract:
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 2,
                                    backgroundColor: alpha('#00ff88', 0.05),
                                    borderRadius: 2,
                                    border: '1px solid #333',
                                }}>
                                    <Typography variant="body1" fontFamily="monospace" sx={{ color: 'white', wordBreak: 'break-all' }}>
                                        {vcaData.metadata.tokenAddress}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        href={`https://etherscan.io/address/${vcaData.metadata.tokenAddress}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: '#666',
                                            '&:hover': {
                                                backgroundColor: alpha('#00ff88', 0.1),
                                                color: '#00ff88',
                                            }
                                        }}
                                    >
                                        <Launch />
                                    </IconButton>
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ my: 3, borderColor: '#333' }} />

                        {authenticated ? (
                            <Box>
                                <Typography variant="subtitle1" sx={{ mb: 2, color: '#00ff88', fontWeight: 'bold' }}>
                                    Express Conviction
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ThumbUp />}
                                        onClick={() => handleActivity('backing')}
                                        sx={{
                                            borderColor: '#00ff88',
                                            color: '#00ff88',
                                            '&:hover': {
                                                backgroundColor: alpha('#00ff88', 0.1),
                                                borderColor: '#00ff88',
                                            },
                                        }}
                                    >
                                        Back Project
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Star />}
                                        onClick={() => handleActivity('review')}
                                        sx={{
                                            borderColor: '#ffa726',
                                            color: '#ffa726',
                                            '&:hover': {
                                                backgroundColor: alpha('#ffa726', 0.1),
                                                borderColor: '#ffa726',
                                            },
                                        }}
                                    >
                                        Add Review
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Share />}
                                        onClick={() => handleActivity('share')}
                                        sx={{
                                            borderColor: '#ff6b6b',
                                            color: '#ff6b6b',
                                            '&:hover': {
                                                backgroundColor: alpha('#ff6b6b', 0.1),
                                                borderColor: '#ff6b6b',
                                            },
                                        }}
                                    >
                                        Share Project
                                    </Button>
                                </Stack>
                            </Box>
                        ) : (
                            <Box sx={{ p: 2, backgroundColor: alpha('#00ff88', 0.05), borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    Login to back this project, write reviews, and earn points!
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}