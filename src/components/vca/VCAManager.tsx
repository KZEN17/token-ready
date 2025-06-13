// src/components/vca/VCAManager.tsx - UPDATED to use projectId consistently
'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    Grid,
    CircularProgress,
    Chip,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    alpha,
    Stack,
} from '@mui/material';
import { VCAMetadata, VCAActivity } from '../../lib/types';
import { useUser } from '@/hooks/useUser';
import { VCAApi } from '@/lib/vca/api';

export default function VCAManager() {
    const { user, authenticated } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [projectId, setProjectId] = useState('');
    const [currentVCAs, setCurrentVCAs] = useState<Array<{ address: string; metadata: VCAMetadata }>>([]);
    const [selectedVCA, setSelectedVCA] = useState<{ address: string; metadata: VCAMetadata } | null>(null);
    const [tokenAddress, setTokenAddress] = useState('');

    // Load VCAs on component mount
    useEffect(() => {
        loadVCAs();
    }, []);

    // Function to load VCAs
    const loadVCAs = async () => {
        try {
            setLoading(true);
            setError(null);

            const vcas = await VCAApi.listVCAs(20, 0);
            setCurrentVCAs(vcas);

            setLoading(false);
        } catch (err) {
            console.error('Error loading VCAs:', err);
            setError('Failed to load VCAs. Please try again.');
            setLoading(false);
        }
    };

    // Function to create new VCA
    const handleCreateVCA = async () => {
        if (!authenticated || !user) {
            setError('You must be logged in to create a VCA');
            return;
        }

        if (!projectId.trim()) {
            setError('Project ID is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Owner will be either Twitter handle or user ID
            const owner = user.username || user.$id;

            const result = await VCAApi.createVCA(projectId.trim(), owner);

            setSuccess(`VCA created successfully with address: ${result.address}`);
            setProjectId('');

            // Refresh VCA list
            await loadVCAs();

            // Select the newly created VCA
            setSelectedVCA(result);

            setLoading(false);
        } catch (err) {
            console.error('Error creating VCA:', err);
            setError('Failed to create VCA. Please try again.');
            setLoading(false);
        }
    };

    // Function to map VCA to real contract
    const handleMapToContract = async () => {
        if (!selectedVCA) {
            setError('Please select a VCA first');
            return;
        }

        if (!tokenAddress.trim() || !tokenAddress.startsWith('0x')) {
            setError('Valid token contract address is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            await VCAApi.mapToContract(selectedVCA.address, tokenAddress.trim());

            setSuccess(`VCA mapped successfully to token contract: ${tokenAddress}`);
            setTokenAddress('');

            // Refresh VCA details
            const updatedVCA = await VCAApi.getVCA(selectedVCA.address);
            if (updatedVCA) {
                setSelectedVCA(updatedVCA);
            }

            // Refresh VCA list
            await loadVCAs();

            setLoading(false);
        } catch (err) {
            console.error('Error mapping VCA:', err);
            setError('Failed to map VCA to contract. Please try again.');
            setLoading(false);
        }
    };

    // Function to select a VCA
    const handleSelectVCA = async (vcaAddress: string) => {
        try {
            setLoading(true);
            setError(null);

            const vca = await VCAApi.getVCA(vcaAddress);
            if (vca) {
                setSelectedVCA(vca);
            } else {
                setError('VCA not found');
            }

            setLoading(false);
        } catch (err) {
            console.error('Error selecting VCA:', err);
            setError('Failed to load VCA details. Please try again.');
            setLoading(false);
        }
    };

    // Function to simulate activity for a VCA (for testing)
    const handleSimulateActivity = async (type: 'backing' | 'review' | 'share') => {
        if (!selectedVCA) {
            setError('Please select a VCA first');
            return;
        }

        if (!authenticated || !user) {
            setError('You must be logged in to simulate activity');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const activity: VCAActivity = {
                type,
                userId: user.$id,
                timestamp: new Date().toISOString(),
                details: { simulated: true }
            };

            await VCAApi.addActivity(selectedVCA.address, activity);

            setSuccess(`${type} activity simulated successfully`);

            // Refresh VCA details
            const updatedVCA = await VCAApi.getVCA(selectedVCA.address);
            if (updatedVCA) {
                setSelectedVCA(updatedVCA);
            }

            // Refresh VCA list
            await loadVCAs();

            setLoading(false);
        } catch (err) {
            console.error('Error simulating activity:', err);
            setError('Failed to simulate activity. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Box sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#00ff88' }}>
                🔮 VCA Protocol Manager
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Create VCA Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #333',
                        borderRadius: 3,
                        height: '100%',
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, color: '#00ff88', fontWeight: 'bold' }}>
                                Create New VCA
                            </Typography>

                            <TextField
                                fullWidth
                                label="Project ID"
                                placeholder="e.g. vader-ai"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: alpha('#00ff88', 0.05),
                                        '& fieldset': { borderColor: '#333' },
                                        '&:hover fieldset': { borderColor: '#00ff88' },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#00ff88',
                                            boxShadow: `0 0 0 2px ${alpha('#00ff88', 0.2)}`,
                                        },
                                    },
                                    '& .MuiInputLabel-root': { color: '#888' },
                                    '& .MuiOutlinedInput-input': { color: 'white' },
                                }}
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleCreateVCA}
                                disabled={loading || !projectId.trim() || !authenticated}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                                    },
                                    '&:disabled': {
                                        background: alpha('#00ff88', 0.3),
                                        color: alpha('#000', 0.5),
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create VCA'}
                            </Button>

                            <Typography variant="body2" sx={{ mt: 2, color: '#888', textAlign: 'center' }}>
                                Create a Virtual Contract Address for your pre-launch project
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* VCA List Section */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #333',
                        borderRadius: 3,
                        height: '100%',
                        overflowY: 'auto',
                        maxHeight: '400px',
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, color: '#00ff88', fontWeight: 'bold' }}>
                                Existing VCAs ({currentVCAs.length})
                            </Typography>

                            {loading && currentVCAs.length === 0 ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <CircularProgress size={40} sx={{ color: '#00ff88' }} />
                                </Box>
                            ) : currentVCAs.length === 0 ? (
                                <Alert severity="info">
                                    No VCAs found. Create your first VCA to get started!
                                </Alert>
                            ) : (
                                <TableContainer component={Paper} sx={{ background: 'transparent' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: alpha('#00ff88', 0.1) }}>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Project</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>VCA Address</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Score</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {currentVCAs.map((vca) => (
                                                <TableRow
                                                    key={vca.address}
                                                    sx={{
                                                        '&:hover': { backgroundColor: alpha('#00ff88', 0.05) },
                                                        backgroundColor: selectedVCA?.address === vca.address ? alpha('#00ff88', 0.1) : 'transparent',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => handleSelectVCA(vca.address)}
                                                >
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {vca.metadata.projectId}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {vca.metadata.owner}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontFamily="monospace" sx={{ fontSize: '0.7rem' }}>
                                                            {vca.address}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={vca.metadata.signalScore}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha('#00ff88', 0.2),
                                                                color: '#00ff88',
                                                                fontWeight: 'bold',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectVCA(vca.address);
                                                            }}
                                                            sx={{
                                                                borderColor: '#00ff88',
                                                                color: '#00ff88',
                                                                '&:hover': {
                                                                    backgroundColor: alpha('#00ff88', 0.1),
                                                                    borderColor: '#00ff88',
                                                                },
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* VCA Details Section */}
                {selectedVCA && (
                    <Grid size={{ xs: 12 }}>
                        <Card sx={{
                            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                            border: '1px solid #333',
                            borderRadius: 3,
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" sx={{ mb: 3, color: '#00ff88', fontWeight: 'bold' }}>
                                    VCA Details
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                                                Project
                                            </Typography>
                                            <Typography variant="h6" sx={{ color: 'white' }}>
                                                {selectedVCA.metadata.projectId}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                                                Owner
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white' }}>
                                                {selectedVCA.metadata.owner}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                                                Created At
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white' }}>
                                                {new Date(selectedVCA.metadata.createdAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                                                VCA Address
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'white', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                                {selectedVCA.address}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                                                Token Address
                                            </Typography>
                                            {selectedVCA.metadata.tokenAddress ? (
                                                <Typography variant="body1" sx={{ color: 'white', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                                    {selectedVCA.metadata.tokenAddress}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic' }}>
                                                    Not mapped to a token yet
                                                </Typography>
                                            )}
                                        </Box>

                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                                                Stats
                                            </Typography>
                                            <Stack direction="row" spacing={2}>
                                                <Chip
                                                    label={`Score: ${selectedVCA.metadata.signalScore}`}
                                                    sx={{
                                                        backgroundColor: alpha('#00ff88', 0.2),
                                                        color: '#00ff88',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                                <Chip
                                                    label={`Backers: ${selectedVCA.metadata.uniqueBackers}`}
                                                    sx={{
                                                        backgroundColor: alpha('#ffa726', 0.2),
                                                        color: '#ffa726',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                                <Chip
                                                    label={`Reviews: ${selectedVCA.metadata.reviews}`}
                                                    sx={{
                                                        backgroundColor: alpha('#ff6b6b', 0.2),
                                                        color: '#ff6b6b',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3, borderColor: '#333' }} />

                                {/* Map to Contract Section */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 3, color: '#00ff88', fontWeight: 'bold' }}>
                                        Map to Real Contract
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 8 }}>
                                            <TextField
                                                fullWidth
                                                label="Token Contract Address"
                                                placeholder="0x..."
                                                value={tokenAddress}
                                                onChange={(e) => setTokenAddress(e.target.value)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: alpha('#00ff88', 0.05),
                                                        '& fieldset': { borderColor: '#333' },
                                                        '&:hover fieldset': { borderColor: '#00ff88' },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: '#00ff88',
                                                            boxShadow: `0 0 0 2px ${alpha('#00ff88', 0.2)}`,
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': { color: '#888' },
                                                    '& .MuiOutlinedInput-input': { color: 'white' },
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 4 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={handleMapToContract}
                                                disabled={loading || !tokenAddress.trim() || !tokenAddress.startsWith('0x')}
                                                sx={{
                                                    height: '100%',
                                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                                                    },
                                                    '&:disabled': {
                                                        background: alpha('#00ff88', 0.3),
                                                        color: alpha('#000', 0.5),
                                                    }
                                                }}
                                            >
                                                Map to Contract
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Simulate Activity Section */}
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 3, color: '#00ff88', fontWeight: 'bold' }}>
                                        Simulate Activity
                                    </Typography>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleSimulateActivity('backing')}
                                            disabled={loading}
                                            sx={{
                                                borderColor: '#00ff88',
                                                color: '#00ff88',
                                                '&:hover': {
                                                    backgroundColor: alpha('#00ff88', 0.1),
                                                    borderColor: '#00ff88',
                                                },
                                            }}
                                        >
                                            Add Backing
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleSimulateActivity('review')}
                                            disabled={loading}
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
                                            onClick={() => handleSimulateActivity('share')}
                                            disabled={loading}
                                            sx={{
                                                borderColor: '#ff6b6b',
                                                color: '#ff6b6b',
                                                '&:hover': {
                                                    backgroundColor: alpha('#ff6b6b', 0.1),
                                                    borderColor: '#ff6b6b',
                                                },
                                            }}
                                        >
                                            Add Share
                                        </Button>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}