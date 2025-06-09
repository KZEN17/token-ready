// src/components/debug/ManualShareTest.tsx
'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Alert,
    Stack,
    CircularProgress,
} from '@mui/material';
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { useUser } from '@/hooks/useUser';

const SHARE_TRACKING_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SHARE_TRACKING_COLLECTION_ID || 'share_tracking';

export default function ManualShareTest() {
    const { user, authenticated } = useUser();
    const [projectId, setProjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const createTestShare = async () => {
        if (!authenticated || !user) {
            setResult('❌ Please login first');
            return;
        }

        if (!projectId.trim()) {
            setResult('❌ Please enter a project ID');
            return;
        }

        setLoading(true);
        try {
            // Create a test share record manually
            const testShare = {
                shareId: `test_${Date.now()}`,
                userId: user.$id, // This is the user's document ID
                projectId: projectId.trim(),
                shareUrl: `https://tokenready.io/project/${projectId}?share=test_${Date.now()}`,
                twitterIntentUrl: 'https://twitter.com/intent/tweet?text=test',
                clickCount: 1,
                shareCount: 1,
                conversionCount: 1,
                events: JSON.stringify([{
                    type: 'test',
                    timestamp: new Date().toISOString(),
                    metadata: { manual: true }
                }]),
                pointsAwarded: true,
                verified: true,
                createdAt: new Date().toISOString(),
                verifiedAt: new Date().toISOString()
            };

            console.log('Creating test share:', testShare);

            const response = await databases.createDocument(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                ID.unique(),
                testShare
            );

            setResult(`✅ Test share created successfully! Document ID: ${response.$id}`);
            console.log('Test share created:', response);

        } catch (error: any) {
            setResult(`❌ Failed to create test share: ${error.message}`);
            console.error('Test share creation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkCollection = async () => {
        setLoading(true);
        try {
            // Try to list documents to see if collection exists
            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                []
            );

            setResult(`✅ Collection exists! Found ${response.documents.length} documents`);
            console.log('Collection check result:', response);

        } catch (error: any) {
            setResult(`❌ Collection check failed: ${error.message}`);
            console.error('Collection check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, border: '1px solid #333', borderRadius: 2, backgroundColor: '#1a1a1a' }}>
            <Typography variant="h6" sx={{ color: '#00ff88', mb: 3 }}>
                🧪 Manual Share Test Tool
            </Typography>

            <Stack spacing={2}>
                <Box>
                    <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                        Current User: {authenticated ? `${user?.displayName} (${user?.$id})` : 'Not logged in'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Collection ID: {SHARE_TRACKING_COLLECTION_ID}
                    </Typography>
                </Box>

                <TextField
                    label="Project ID"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="Enter a project ID from your projects"
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#0a0a0a',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#00ff88' },
                            '&.Mui-focused fieldset': { borderColor: '#00ff88' },
                        },
                        '& .MuiInputLabel-root': { color: '#888' },
                        '& .MuiOutlinedInput-input': { color: 'white' },
                    }}
                />

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={checkCollection}
                        disabled={loading}
                        sx={{ color: '#00ff88', borderColor: '#00ff88' }}
                    >
                        Check Collection
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={createTestShare}
                        disabled={loading || !authenticated || !projectId.trim()}
                        sx={{ color: '#ff6b6b', borderColor: '#ff6b6b' }}
                    >
                        Create Test Share
                    </Button>
                </Stack>

                {loading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" sx={{ color: '#888' }}>
                            Processing...
                        </Typography>
                    </Box>
                )}

                {result && (
                    <Alert
                        severity={result.startsWith('✅') ? 'success' : 'error'}
                        sx={{
                            backgroundColor: result.startsWith('✅') ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                            color: result.startsWith('✅') ? '#00ff88' : '#ff6b6b'
                        }}
                    >
                        {result}
                    </Alert>
                )}

                <Box sx={{ mt: 2, p: 2, backgroundColor: '#0a0a0a', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                        <strong>Steps to test:</strong><br />
                        1. First click "Check Collection" to see if the database collection exists<br />
                        2. Enter any project ID from your projects list<br />
                        3. Click "Create Test Share" to add fake share data<br />
                        4. Then check if the ProjectSharers component shows the data
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
}