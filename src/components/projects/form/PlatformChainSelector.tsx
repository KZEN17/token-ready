// src/components/projects/form/LaunchPlatformSection.tsx
'use client';

import { chains, platforms } from '@/lib/constants';
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

interface LaunchPlatformSectionProps {
    selectedPlatform: string;
    selectedChain: string;
    onPlatformChange: (platform: string) => void;
    onChainChange: (chain: string) => void;
    platformError?: string;
    chainError?: string;
}



export default function LaunchPlatformSection({
    selectedPlatform,
    selectedChain,
    onPlatformChange,
    onChainChange,
    platformError,
    chainError,
}: LaunchPlatformSectionProps) {
    console.log(selectedPlatform, selectedChain, platformError, chainError);
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
                                                        <img
                                                            src={chain.logo}
                                                            alt={`${chain.name} logo`}
                                                            style={{ width: '100%', height: '100%', objectFit: 'contain', color: 'white' }}
                                                        />
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