// src/components/common/BelieverPointsWidget.tsx
'use client';

import {
    Box,
    Chip,
    Typography,
    Tooltip,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Card,
    CardContent,
    LinearProgress,
    Button,
    alpha,
    Divider,
} from '@mui/material';
import { useState } from 'react';
import {
    LocalFireDepartment,
    TrendingUp,
    EmojiEvents,
    CheckCircle,
    Timer,
    Star,
} from '@mui/icons-material';
import { useBelieverPoints } from '@/hooks/useBelieverPoints';
import { useUser } from '@/hooks/useUser';
import { calculateBelieverRank, getNextRank, BELIEVER_ACTIONS } from '@/lib/believerPoints';

interface BelieverPointsWidgetProps {
    compact?: boolean;
    showRank?: boolean;
}

export default function BelieverPointsWidget({
    compact = true,
    showRank = true
}: BelieverPointsWidgetProps) {
    const { authenticated, user } = useUser();
    const {
        totalPoints,
        rank,
        todayPoints,
        streak,
        weeklyProgress,
        loading
    } = useBelieverPoints();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    if (!authenticated || loading) {
        return null;
    }

    const nextRank = getNextRank(totalPoints);
    const progressToNextRank = nextRank
        ? ((totalPoints - rank.minPoints) / (nextRank.rank.minPoints - rank.minPoints)) * 100
        : 100;

    if (compact) {
        return (
            <>
                <Tooltip title="View Believer Points Details">
                    <Box
                        onClick={handleClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            p: 1,
                            borderRadius: 2,
                            '&:hover': {
                                backgroundColor: alpha('#00ff88', 0.1),
                            }
                        }}
                    >
                        {/* Rank Badge */}
                        {showRank && (
                            <Chip
                                label={rank.name}
                                icon={<Typography fontSize="0.8rem">{rank.icon}</Typography>}
                                size="small"
                                sx={{
                                    backgroundColor: alpha(rank.color, 0.2),
                                    color: rank.color,
                                    border: `1px solid ${rank.color}`,
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    height: 24,
                                }}
                            />
                        )}

                        {/* Points Display */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocalFireDepartment sx={{ color: '#00ff88', fontSize: '1rem' }} />
                            <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                {totalPoints.toLocaleString()}
                            </Typography>
                        </Box>

                        {/* Today's Points */}
                        {todayPoints > 0 && (
                            <Chip
                                label={`+${todayPoints}`}
                                size="small"
                                sx={{
                                    backgroundColor: alpha('#ffa726', 0.2),
                                    color: '#ffa726',
                                    fontSize: '0.7rem',
                                    height: 20,
                                    '& .MuiChip-label': { px: 0.5 }
                                }}
                            />
                        )}

                        {/* Streak Indicator */}
                        {streak > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography fontSize="0.8rem">🔥</Typography>
                                <Typography variant="caption" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                    {streak}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Tooltip>

                {/* Detailed Popover */}
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            minWidth: 320,
                            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                            border: '1px solid #333',
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                        }
                    }}
                >
                    <Card sx={{ background: 'transparent', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 3 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                    💎 Believer Status
                                </Typography>
                                <Chip
                                    label={rank.name}
                                    icon={<Typography fontSize="0.8rem">{rank.icon}</Typography>}
                                    sx={{
                                        backgroundColor: alpha(rank.color, 0.2),
                                        color: rank.color,
                                        border: `1px solid ${rank.color}`,
                                        fontWeight: 'bold',
                                    }}
                                />
                            </Box>

                            {/* Progress to Next Rank */}
                            {nextRank && (
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ color: '#888' }}>
                                            Progress to {nextRank.rank.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                            {nextRank.pointsNeeded} needed
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressToNextRank}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: '#333',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: rank.color,
                                                borderRadius: 3,
                                            }
                                        }}
                                    />
                                </Box>
                            )}

                            {/* Stats */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                        {totalPoints.toLocaleString()}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                        Total Points
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                        {todayPoints}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                        Today's Points
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                        {streak}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                        Day Streak
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h5" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                                        {weeklyProgress}/7
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                        Weekly Actions
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Quick Actions */}
                            <Divider sx={{ mb: 2, borderColor: '#333' }} />
                            <Typography variant="subtitle2" sx={{ color: '#00ff88', mb: 2, fontWeight: 'bold' }}>
                                Quick Actions
                            </Typography>

                            <List dense sx={{ p: 0 }}>
                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Typography fontSize="1rem">📅</Typography>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" sx={{ color: 'white' }}>
                                                Daily Check-in
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" sx={{ color: '#00ff88' }}>
                                                +50 points
                                            </Typography>
                                        }
                                    />
                                    <CheckCircle sx={{ color: '#00ff88', fontSize: '1rem' }} />
                                </ListItem>

                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Typography fontSize="1rem">👍</Typography>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" sx={{ color: 'white' }}>
                                                Upvote Projects
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" sx={{ color: '#00ff88' }}>
                                                +75 points each
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <ListItem sx={{ px: 0, py: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Typography fontSize="1rem">📝</Typography>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" sx={{ color: 'white' }}>
                                                Write Reviews
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" sx={{ color: '#00ff88' }}>
                                                +100+ points
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>

                            {/* Weekly Bonus Progress */}
                            {weeklyProgress > 0 && (
                                <Box sx={{ mt: 2, p: 2, backgroundColor: alpha('#8b5cf6', 0.1), borderRadius: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#8b5cf6', fontWeight: 'bold', mb: 1 }}>
                                        🔥 Weekly Bonus Progress
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(weeklyProgress / 7) * 100}
                                        sx={{
                                            height: 4,
                                            borderRadius: 2,
                                            backgroundColor: '#333',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: weeklyProgress >= 7 ? '#00ff88' : '#8b5cf6',
                                            }
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ color: '#8b5cf6', mt: 0.5, display: 'block' }}>
                                        {weeklyProgress >= 7 ? '+500 Bonus Earned!' : `${weeklyProgress}/7 actions for +500 bonus`}
                                    </Typography>
                                </Box>
                            )}

                            {/* Action Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                    }
                                }}
                                href="/leaderboard"
                                onClick={handleClose}
                            >
                                View Full Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </Popover>
            </>
        );
    }

    // Full widget version (for dashboard pages)
    return (
        <Card sx={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                        💎 Believer Points
                    </Typography>
                    <Chip
                        label={rank.name}
                        icon={<Typography fontSize="0.8rem">{rank.icon}</Typography>}
                        sx={{
                            backgroundColor: alpha(rank.color, 0.2),
                            color: rank.color,
                            border: `1px solid ${rank.color}`,
                            fontWeight: 'bold',
                        }}
                    />
                </Box>

                {/* Progress to Next Rank */}
                {nextRank && (
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                Progress to {nextRank.rank.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                {nextRank.pointsNeeded} points needed
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progressToNextRank}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#333',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: rank.color,
                                    borderRadius: 4,
                                }
                            }}
                        />
                    </Box>
                )}

                {/* Stats Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                            {totalPoints.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                            Total Points
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                            {todayPoints}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                            Today
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                            {streak}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                            Streak
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                            {weeklyProgress}/7
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#888' }}>
                            Weekly
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}