// src/components/vca/EnhancedVCADisplay.tsx
'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tooltip,
    alpha,
    IconButton,
    Grid,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import {
    ContentCopy,
    Done,
} from '@mui/icons-material';

interface EnhancedVCADisplayProps {
    vcaAddress?: string;
    projectMetrics?: {
        signalScore?: number;
        uniqueBackers?: number;
        reviews?: number;
        upvotes?: string[];
    };
}

export default function EnhancedVCADisplay({
    vcaAddress,
    projectMetrics = {}
}: EnhancedVCADisplayProps) {
    const [copied, setCopied] = useState(false);

    const {
        signalScore = 0,
        uniqueBackers = 0,
        reviews = 0,
        upvotes = []
    } = projectMetrics;

    // Handle copy address to clipboard
    const handleCopyAddress = () => {
        if (!vcaAddress) return;

        navigator.clipboard.writeText(vcaAddress)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error('Failed to copy:', err);
            });
    };

    if (!vcaAddress) {
        return null;
    }

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
                            {vcaAddress}
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
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                {signalScore}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Signal Score
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                {uniqueBackers}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Unique Backers
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                {reviews}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Reviews
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}