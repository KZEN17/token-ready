// src/components/vca/SimpleTest.tsx
'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Alert,
    Paper,
    Stack,
    CircularProgress,
    Divider,
} from '@mui/material';

// Simplified test component for VCA functionality
export default function SimpleVCATest() {
    const [testSlug, setTestSlug] = useState(`test-project-${Date.now()}`);
    const [testOwner, setTestOwner] = useState('test-user');
    const [vcaAddress, setVcaAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const runTest = async (testName: string, testFunction: () => Promise<any>) => {
        setLoading(true);
        setError(null);
        try {
            setResult({ status: 'Running test: ' + testName });
            const testResult = await testFunction();
            setResult({ status: 'Success', data: testResult });
        } catch (err: any) {
            console.error(`Test failed: ${testName}`, err);
            setError(err.message || 'Unknown error');
            setResult({ status: 'Failed', error: err.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    // 1. Test creating a VCA
    const testCreateVCA = async () => {
        const response = await fetch('/api/vca', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'create',
                slug: testSlug,
                owner: testOwner
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to create VCA: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        setVcaAddress(data.address);
        return data;
    };

    // 2. Test getting a VCA by slug
    const testGetVCABySlug = async () => {
        const response = await fetch(`/api/vca?action=getBySlug&slug=${testSlug}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to get VCA by slug: ${errorData.error || response.statusText}`);
        }

        return response.json();
    };

    // 3. Test getting a VCA by address
    const testGetVCAByAddress = async () => {
        if (!vcaAddress) {
            throw new Error('No VCA address available. Please create a VCA first.');
        }

        const response = await fetch(`/api/vca?action=get&address=${vcaAddress}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to get VCA by address: ${errorData.error || response.statusText}`);
        }

        return response.json();
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                🧪 Simple VCA Test
            </Typography>

            <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h6" gutterBottom>
                    Test Configuration
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        label="Test Project Slug"
                        value={testSlug}
                        onChange={(e) => setTestSlug(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Test Owner"
                        value={testOwner}
                        onChange={(e) => setTestOwner(e.target.value)}
                        fullWidth
                    />
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        onClick={() => runTest('Create VCA', testCreateVCA)}
                        disabled={loading}
                    >
                        1. Create VCA
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => runTest('Get VCA by Slug', testGetVCABySlug)}
                        disabled={loading}
                    >
                        2. Get by Slug
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => runTest('Get VCA by Address', testGetVCAByAddress)}
                        disabled={loading || !vcaAddress}
                    >
                        3. Get by Address
                    </Button>
                </Stack>
            </Paper>

            {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CircularProgress size={24} />
                    <Typography>Running test...</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {result && (
                <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                    <Typography variant="h6" gutterBottom>
                        Test Result: {result.status}
                    </Typography>

                    {vcaAddress && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">
                                VCA Address:
                            </Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                                {vcaAddress}
                            </Typography>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2">
                        Response Data:
                    </Typography>
                    <Box
                        component="pre"
                        sx={{
                            p: 2,
                            bgcolor: '#f5f5f5',
                            borderRadius: 1,
                            overflow: 'auto',
                            maxHeight: 300,
                            fontSize: '0.875rem',
                            fontFamily: 'monospace'
                        }}
                    >
                        {JSON.stringify(result.data || result.error || {}, null, 2)}
                    </Box>
                </Paper>
            )}
        </Box>
    );
}