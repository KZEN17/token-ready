// src/components/vca/SimpleVCADisplay.tsx
'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Tooltip,
    alpha,
    IconButton,
    Chip,
} from '@mui/material';
import {
    ContentCopy,
    Done,
} from '@mui/icons-material';

interface SimpleVCADisplayProps {
    vcaAddress?: string;
}

export default function SimpleVCADisplay({ vcaAddress }: SimpleVCADisplayProps) {
    const [copied, setCopied] = useState(false);

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

    // Format address for display
    const formatAddress = (address: string) => {
        if (!address) return '';
        if (address.length <= 12) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    if (!vcaAddress) {
        return null;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                p: 2,
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #333',
                borderRadius: 2,
            }}
        >
            <Box>
                <Typography variant="body2" sx={{ color: '#888', mb: 0.5 }}>
                    Virtual Contract Address:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontFamily="monospace" sx={{ color: '#00ff88' }}>
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
                                },
                            }}
                        >
                            {copied ? <Done fontSize="small" /> : <ContentCopy fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Chip
                label="VCA"
                size="small"
                sx={{
                    backgroundColor: alpha('#00ff88', 0.2),
                    color: '#00ff88',
                    fontWeight: 'bold',
                }}
            />
        </Box>
    );
}