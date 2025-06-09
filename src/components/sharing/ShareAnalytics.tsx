// src/components/sharing/ShareAnalytics.tsx
'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Chip,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    alpha,
} from '@mui/material';
import {
    Share,
    Visibility,
    TrendingUp,
    LocalFireDepartment,
    X,
} from '@mui/icons-material';
import { useShareAnalytics } from '@/hooks/useShareTracking';
import { ShareTrackingData } from '@/lib/types';

interface ShareAnalyticsProps {
    userId: string;
}

export default function ShareAnalytics({ userId }: ShareAnalyticsProps) {
    const {
        totalShares,
        totalClicks,
        totalConversions,
        totalPointsEarned,
        recentShares,
        loading,
        error
    } = useShareAnalytics(userId);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getConversionRate = () => {
        if (totalClicks === 0) return 0;
        return ((totalConversions / totalClicks) * 100).toFixed(1);
    };

    if (loading) {
        return (
            <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={40} sx={{ color: '#1DA1F2', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                        Loading share analytics...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Alert severity="error">{error}</Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1DA1F2' }}>
                📊 Your Share Performance
            </Typography>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #1DA1F2',
                    }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Share sx={{ color: '#1DA1F2', fontSize: '2rem', mb: 1 }} />
                            <Typography variant="h4" sx={{ color: '#1DA1F2', fontWeight: 'bold' }}>
                                {totalShares}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Shares
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #ffa726',
                    }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Visibility sx={{ color: '#ffa726', fontSize: '2rem', mb: 1 }} />
                            <Typography variant="h4" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                {totalConversions}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Visits Generated
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #ff6b6b',
                    }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <TrendingUp sx={{ color: '#ff6b6b', fontSize: '2rem', mb: 1 }} />
                            <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                {getConversionRate()}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Conversion Rate
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #00ff88',
                    }}>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <LocalFireDepartment sx={{ color: '#00ff88', fontSize: '2rem', mb: 1 }} />
                            <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                {totalPointsEarned}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Points Earned
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Performance Summary */}
            {totalShares > 0 && (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            📈 Performance Summary
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Chip
                                label={`Average ${(totalConversions / totalShares).toFixed(1)} visits per share`}
                                sx={{
                                    backgroundColor: alpha('#1DA1F2', 0.1),
                                    color: '#1DA1F2',
                                    border: '1px solid #1DA1F2',
                                }}
                            />
                            <Chip
                                label={`${(totalPointsEarned / totalShares).toFixed(0)} points per share`}
                                sx={{
                                    backgroundColor: alpha('#00ff88', 0.1),
                                    color: '#00ff88',
                                    border: '1px solid #00ff88',
                                }}
                            />
                            {totalConversions > 10 && (
                                <Chip
                                    label="🔥 High Performer"
                                    sx={{
                                        backgroundColor: alpha('#ff6b6b', 0.1),
                                        color: '#ff6b6b',
                                        border: '1px solid #ff6b6b',
                                    }}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Recent Shares Table */}
            {recentShares.length > 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                            📋 Recent Shares
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: alpha('#1DA1F2', 0.1) }}>
                                        <TableCell sx={{ color: '#1DA1F2', fontWeight: 'bold' }}>
                                            Share ID
                                        </TableCell>
                                        <TableCell sx={{ color: '#1DA1F2', fontWeight: 'bold' }}>
                                            Date
                                        </TableCell>
                                        <TableCell sx={{ color: '#1DA1F2', fontWeight: 'bold' }}>
                                            Visits
                                        </TableCell>
                                        <TableCell sx={{ color: '#1DA1F2', fontWeight: 'bold' }}>
                                            Status
                                        </TableCell>
                                        <TableCell sx={{ color: '#1DA1F2', fontWeight: 'bold' }}>
                                            Points
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentShares.map((share: ShareTrackingData) => (
                                        <TableRow
                                            key={share.shareId}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: alpha('#1DA1F2', 0.05),
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" fontFamily="monospace">
                                                    {share.shareId.slice(-8)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {formatDate(share.createdAt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {share.conversionCount}
                                                    </Typography>
                                                    {share.conversionCount > 0 && (
                                                        <X sx={{ color: '#1DA1F2', fontSize: '1rem' }} />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={share.verified ? 'Verified' : 'Pending'}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: share.verified
                                                            ? alpha('#00ff88', 0.1)
                                                            : alpha('#ffa726', 0.1),
                                                        color: share.verified ? '#00ff88' : '#ffa726',
                                                        border: `1px solid ${share.verified ? '#00ff88' : '#ffa726'}`,
                                                        fontSize: '0.7rem',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: share.pointsAwarded ? '#00ff88' : '#666',
                                                        fontWeight: share.pointsAwarded ? 'bold' : 'normal',
                                                    }}
                                                >
                                                    {share.pointsAwarded ? '+150' : '—'}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {totalShares === 0 && (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <X sx={{ color: '#666', fontSize: '4rem', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                            No Shares Yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Start sharing projects on Twitter to see your analytics here!
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}