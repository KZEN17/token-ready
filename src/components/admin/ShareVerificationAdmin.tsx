// src/components/admin/ShareVerificationAdmin.tsx - Fixed version
'use client';

import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    TextField,
    Alert,
    CircularProgress,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    alpha,
} from '@mui/material';
import {
    CheckCircle,
    Warning,
    Refresh,
    Verified,
    X,
    Timeline
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { TwitterVerificationService } from '@/lib/twitterVerificationService';
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

const SHARE_TRACKING_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SHARE_TRACKING_COLLECTION_ID || 'share_tracking';

interface ShareRecord {
    $id: string;
    shareId: string;
    userId: string;
    projectId: string;
    shareUrl: string;
    verified: boolean;
    pointsAwarded: boolean;
    createdAt: string;
    verifiedAt?: string;
    events: any[];
    // Appwrite system fields
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
}

export default function ShareVerificationAdmin() {
    const [shares, setShares] = useState<ShareRecord[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState<string | null>(null);
    const [selectedShare, setSelectedShare] = useState<ShareRecord | null>(null);
    const [manualVerifyDialog, setManualVerifyDialog] = useState(false);
    const [tweetUrl, setTweetUrl] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadShares(),
                loadStats()
            ]);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadShares = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                SHARE_TRACKING_COLLECTION_ID,
                [
                    Query.orderDesc('createdAt'),
                    Query.limit(50)
                ]
            );

            const shareRecords = response.documents.map(doc => ({
                ...doc,
                events: typeof doc.events === 'string' ? JSON.parse(doc.events) : (doc.events || [])
            })) as unknown as ShareRecord[];

            setShares(shareRecords);
        } catch (error) {
            console.error('Failed to load shares:', error);
        }
    };

    const loadStats = async () => {
        try {
            const stats = await TwitterVerificationService.getVerificationStats();
            setStats(stats);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleVerifyShare = async (share: ShareRecord) => {
        setVerifying(share.shareId);
        try {
            const result = await TwitterVerificationService.verifyTwitterShare(
                share.shareId,
                share.userId,
                share.projectId,
                share.shareUrl
            );

            if (result.verified) {
                // Refresh the data
                await loadData();
            }
        } catch (error) {
            console.error('Verification failed:', error);
        } finally {
            setVerifying(null);
        }
    };

    const handleManualVerify = async () => {
        if (!selectedShare) return;

        setVerifying(selectedShare.shareId);
        try {
            const result = await TwitterVerificationService.manuallyVerifyShare(
                selectedShare.shareId,
                'admin', // You could get actual admin user ID
                tweetUrl || undefined
            );

            if (result.verified) {
                setManualVerifyDialog(false);
                setTweetUrl('');
                setSelectedShare(null);
                await loadData();
            }
        } catch (error) {
            console.error('Manual verification failed:', error);
        } finally {
            setVerifying(null);
        }
    };

    const handleRunBackgroundVerification = async () => {
        setLoading(true);
        try {
            await TwitterVerificationService.verifyPendingShares();
            await loadData();
        } catch (error) {
            console.error('Background verification failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    // Get verification method from share events
    const getVerificationMethod = (share: ShareRecord): string | undefined => {
        // Get method from events
        const verificationEvent = share.events.find(event =>
            event.type === 'share_verified' ||
            event.type === 'manual_verification'
        );

        return verificationEvent?.metadata?.method;
    };

    const getVerificationMethodColor = (method?: string) => {
        switch (method) {
            case 'referral_tracking': return '#00ff88';
            case 'time_based': return '#ffa726';
            case 'behavior': return '#8b5cf6';
            case 'manual': return '#ff6b6b';
            case 'fallback': return '#666';
            default: return '#888';
        }
    };

    const getStatusChip = (share: ShareRecord) => {
        if (share.verified && share.pointsAwarded) {
            return <Chip label="Verified & Paid" color="success" size="small" />;
        } else if (share.verified) {
            return <Chip label="Verified" color="primary" size="small" />;
        } else {
            const age = Date.now() - new Date(share.createdAt).getTime();
            const hours = age / (1000 * 60 * 60);

            if (hours > 24) {
                return <Chip label="Stale" color="error" size="small" />;
            } else if (hours > 1) {
                return <Chip label="Pending" color="warning" size="small" />;
            } else {
                return <Chip label="Recent" color="info" size="small" />;
            }
        }
    };

    if (loading && shares.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#1DA1F2' }}>
                🔍 Share Verification Admin
            </Typography>

            {/* Stats Cards */}
            <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
                <Card sx={{ minWidth: 200 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                            {stats.total || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Shares
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 200 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#00ff88' }}>
                            {stats.verified || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Verified
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 200 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#ffa726' }}>
                            {stats.pending || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pending
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ minWidth: 200 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#8b5cf6' }}>
                            {stats.verificationRate || 0}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Success Rate
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>

            {/* Actions */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={handleRunBackgroundVerification}
                    disabled={loading}
                >
                    Run Background Verification
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Timeline />}
                    onClick={loadData}
                    disabled={loading}
                >
                    Refresh Data
                </Button>
            </Box>

            {/* Verification Method Stats */}
            {stats.byMethod && Object.keys(stats.byMethod).length > 0 && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Verification Methods
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            {Object.entries(stats.byMethod).map(([method, count]) => (
                                <Chip
                                    key={method}
                                    label={`${method}: ${count}`}
                                    sx={{
                                        backgroundColor: alpha(getVerificationMethodColor(method), 0.2),
                                        color: getVerificationMethodColor(method),
                                        border: `1px solid ${getVerificationMethodColor(method)}`,
                                    }}
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Shares Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Recent Shares
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: alpha('#00ff88', 0.1) }}>
                                    <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Share ID</TableCell>
                                    <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>User ID</TableCell>
                                    <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Created</TableCell>
                                    <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Method</TableCell>
                                    <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shares.map((share) => (
                                    <TableRow
                                        key={share.$id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: alpha('#00ff88', 0.05),
                                            },
                                            backgroundColor: share.verified
                                                ? alpha('#00ff88', 0.05)
                                                : 'transparent'
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                {share.shareId.slice(-12)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                {share.userId.slice(-8)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatDate(share.createdAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusChip(share)}
                                        </TableCell>
                                        <TableCell>
                                            {getVerificationMethod(share) && (
                                                <Chip
                                                    label={getVerificationMethod(share)}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(getVerificationMethodColor(getVerificationMethod(share)), 0.2),
                                                        color: getVerificationMethodColor(getVerificationMethod(share)),
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                {!share.verified && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={verifying === share.shareId ? <CircularProgress size={16} /> : <CheckCircle />}
                                                        onClick={() => handleVerifyShare(share)}
                                                        disabled={verifying === share.shareId}
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="warning"
                                                    startIcon={<Verified />}
                                                    onClick={() => {
                                                        setSelectedShare(share);
                                                        setManualVerifyDialog(true);
                                                    }}
                                                    disabled={verifying === share.shareId}
                                                >
                                                    Manual
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {shares.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <X sx={{ fontSize: '4rem', color: '#666', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No shares found
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Manual Verification Dialog */}
            <Dialog
                open={manualVerifyDialog}
                onClose={() => setManualVerifyDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Manual Verification
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            This will manually mark the share as verified and award points to the user.
                        </Alert>

                        {selectedShare && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Share ID: {selectedShare.shareId}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    User ID: {selectedShare.userId}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Share URL: {selectedShare.shareUrl}
                                </Typography>
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            label="Tweet URL (optional)"
                            placeholder="https://twitter.com/user/status/..."
                            value={tweetUrl}
                            onChange={(e) => setTweetUrl(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setManualVerifyDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleManualVerify}
                        disabled={verifying !== null}
                        startIcon={verifying === selectedShare?.shareId ? <CircularProgress size={16} /> : <Verified />}
                    >
                        Verify & Award Points
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}