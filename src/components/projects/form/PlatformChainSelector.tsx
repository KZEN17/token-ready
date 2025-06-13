// src/components/projects/form/LaunchPlatformSection.tsx
'use client';

import {
    Box,
    Typography,
    FormControl,
    FormGroup,
    FormControlLabel,
    Radio,
    alpha,
    Card,
    CardContent,
} from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

interface LaunchPlatformSectionProps {
    selectedPlatform: string;
    selectedChain: string;
    onPlatformChange: (platform: string) => void;
    onChainChange: (chain: string) => void;
    platformError?: string;
    chainError?: string;
}

const platforms = [
    {
        id: 'virtuals',
        name: 'Virtuals.io',
        description: 'AI Agents as co-owned and tokenized assets',
        icon: '🤖',
        color: '#8b5cf6'
    },
    {
        id: 'pumpfun',
        name: 'Pump.fun',
        description: 'Launch instantly tradable coins without liquidity',
        icon: '🚀',
        color: '#00ff88'
    },
    {
        id: 'believerapp',
        name: 'BelieverApp',
        description: 'Community-driven project launches',
        icon: '💎',
        color: '#ff6b6b'
    }
];

const chains = [
    {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        color: '#dc1fff',
        // Using inline SVG for Solana logo
        logo: (
            <svg width="24" height="24" viewBox="0 0 397.7 311.7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <linearGradient id="solana-gradient" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#00D18C" />
                    <stop offset="100%" stopColor="#4CDBF7" />
                </linearGradient>
                <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" fill="url(#solana-gradient)" />
                <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1L333.1 73.8c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solana-gradient)" />
                <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solana-gradient)" />
            </svg>
        )
    },
    {
        id: 'base',
        name: 'Base',
        symbol: 'BASE',
        color: '#0052ff',
        // Using inline SVG for Base logo
        logo: (
            <svg width="24" height="24" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 21.9398 0.275391 49.9554H70.8467V60.0788H0.275391C2.35281 88.0944 26.0432 110.034 54.921 110.034Z" fill="#0052ff" />
            </svg>
        )
    }
];

export default function LaunchPlatformSection({
    selectedPlatform,
    selectedChain,
    onPlatformChange,
    onChainChange,
    platformError,
    chainError,
}: LaunchPlatformSectionProps) {
    return (
        <Box>
            {/* Launch Platform Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{
                    color: 'primary.main',
                    mb: 2,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    🚀 Launch Platform *
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Select which platform you plan to use for launching your project
                </Typography>

                <FormControl component="fieldset" error={!!platformError}>
                    <FormGroup>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                            {platforms.map((platform) => (
                                <Card
                                    key={platform.id}
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedPlatform === platform.id
                                            ? `2px solid ${platform.color}`
                                            : '1px solid #333',
                                        backgroundColor: selectedPlatform === platform.id
                                            ? alpha(platform.color, 0.1)
                                            : 'transparent',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: platform.color,
                                            backgroundColor: alpha(platform.color, 0.05),
                                        }
                                    }}
                                    onClick={() => onPlatformChange(platform.id)}
                                >
                                    <CardContent sx={{ p: 2 }}>
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={selectedPlatform === platform.id}
                                                    onChange={() => onPlatformChange(platform.id)}
                                                    sx={{
                                                        color: platform.color,
                                                        '&.Mui-checked': {
                                                            color: platform.color,
                                                        }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                        <Typography variant="h4">{platform.icon}</Typography>
                                                        <Typography variant="subtitle1" sx={{
                                                            fontWeight: 'bold',
                                                            color: selectedPlatform === platform.id ? platform.color : 'text.primary'
                                                        }}>
                                                            {platform.name}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{
                                                        color: 'text.secondary',
                                                        fontSize: '0.8rem',
                                                        lineHeight: 1.3
                                                    }}>
                                                        {platform.description}
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{ m: 0, alignItems: 'flex-start' }}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </FormGroup>
                    {platformError && (
                        <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
                            {platformError}
                        </Typography>
                    )}
                </FormControl>
            </Box>

            {/* Blockchain Network Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{
                    color: 'primary.main',
                    mb: 2,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    ⛓️ Blockchain Network *
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Select which blockchain your project will be deployed on
                </Typography>

                <FormControl component="fieldset" error={!!chainError}>
                    <FormGroup>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                            {chains.map((chain) => (
                                <Card
                                    key={chain.id}
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedChain === chain.id
                                            ? `2px solid ${chain.color}`
                                            : '1px solid #333',
                                        backgroundColor: selectedChain === chain.id
                                            ? alpha(chain.color, 0.1)
                                            : 'transparent',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: chain.color,
                                            backgroundColor: alpha(chain.color, 0.05),
                                        }
                                    }}
                                    onClick={() => onChainChange(chain.id)}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    checked={selectedChain === chain.id}
                                                    onChange={() => onChainChange(chain.id)}
                                                    sx={{
                                                        color: chain.color,
                                                        '&.Mui-checked': {
                                                            color: chain.color,
                                                        }
                                                    }}
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '50%',
                                                        backgroundColor: alpha(chain.color, 0.1),
                                                        border: `2px solid ${alpha(chain.color, 0.3)}`
                                                    }}>
                                                        {chain.logo}
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h6" sx={{
                                                            fontWeight: 'bold',
                                                            color: selectedChain === chain.id ? chain.color : 'text.primary',
                                                            mb: 0.5
                                                        }}>
                                                            {chain.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{
                                                            color: 'text.secondary',
                                                            fontSize: '0.9rem'
                                                        }}>
                                                            ${chain.symbol}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                            sx={{ m: 0, alignItems: 'center' }}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </FormGroup>
                    {chainError && (
                        <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
                            {chainError}
                        </Typography>
                    )}
                </FormControl>
            </Box>
        </Box>
    );
}