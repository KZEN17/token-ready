'use client';

import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
    LinearProgress,
    IconButton,
    Button,
    alpha,
    CircularProgress,
    Alert,
    Stack,
} from '@mui/material';
import { useState, useEffect } from 'react';
import {
    TrendingUp,
    Star,
    ThumbUp,
    EmojiEvents,
    Timer,
    Whatshot,
    LocalFireDepartment,
    AccountCircle,
    Business,
} from '@mui/icons-material';
import { useUser } from '@/hooks/useUser';
import { BelieverPointsService } from '@/lib/believerPointsService';
import { calculateBelieverRank, BELIEVER_RANKS } from '@/lib/believerPoints';

interface UserLeaderboardEntry {
    userId: string;
    username: string;
    displayName: string;
    profileImage: string;
    totalPoints: number;
    rank: any;
    weeklyPoints: number;
    isVerifiedKOL: boolean;
    position: number;
}

interface ProjectLeaderboardEntry {
    projectId: string;
    projectName: string;
    totalPoints: number;
    totalUpvotes: number;
    totalReviews: number;
    averageRating: number;
    momentum: number;
    position: number;
}

export default function LeaderboardPage() {
    const { user, authenticated } = useUser();
    const [activeTab, setActiveTab] = useState(0);
    const [userLeaderboard, setUserLeaderboard] = useState<UserLeaderboardEntry[]>([]);
    const [projectLeaderboard, setProjectLeaderboard] = useState<ProjectLeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userStats, setUserStats] = useState<any>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        fetchLeaderboardData();
        if (authenticated && user) {
            fetchUserStats();
        }
    }, [authenticated, user]);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [users, projects] = await Promise.all([
                BelieverPointsService.getLeaderboard(50),
                BelieverPointsService.getProjectLeaderboard(20)
            ]);

            // Add position numbers
            const usersWithPosition = users.map((user, index) => ({
                ...user,
                position: index + 1
            }));

            const projectsWithPosition = projects.map((project, index) => ({
                ...project,
                position: index + 1
            }));

            setUserLeaderboard(usersWithPosition);
            setProjectLeaderboard(projectsWithPosition);

        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        if (!user) return;

        try {
            const stats = await BelieverPointsService.getUserStats(user.$id);
            setUserStats(stats);
        } catch (err) {
            console.error('Error fetching user stats:', err);
        }
    };

    const getRankIcon = (position: number) => {
        switch (position) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${position}`;
        }
    };

    const getRankColor = (position: number) => {
        switch (position) {
            case 1: return '#FFD700';
            case 2: return '#C0C0C0';
            case 3: return '#CD7F32';
            default: return '#666';
        }
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ color: '#00ff88', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#00ff88' }}>
                        Loading Leaderboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
                <Button onClick={fetchLeaderboardData} variant="contained">
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            py: 4
        }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            mb: 2,
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 900,
                            fontSize: { xs: '2.5rem', md: '4rem' }
                        }}
                    >
                        🏆 Leaderboard
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#b0b0b0', maxWidth: 600, mx: 'auto' }}>
                        Discover the most dedicated believers and highest-rated projects in the TokenReady ecosystem
                    </Typography>
                </Box>

                {/* User Stats Card (if authenticated) */}
                {authenticated && user && userStats && (
                    <Card sx={{
                        mb: 4,
                        background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                        border: '1px solid #00ff88',
                        borderRadius: 3,
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                                <Avatar
                                    src={user.profileImage || undefined}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: '#00ff88',
                                        color: '#000',
                                        fontSize: '2rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {user.displayName?.charAt(0) || 'U'}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 'bold', mb: 1 }}>
                                        Your Believer Journey
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Typography variant="h6" sx={{ color: 'white' }}>
                                            @{user.username}
                                        </Typography>
                                        <Chip
                                            label={userStats.rank.name}
                                            sx={{
                                                backgroundColor: alpha(userStats.rank.color, 0.2),
                                                color: userStats.rank.color,
                                                border: `1px solid ${userStats.rank.color}`,
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        {user.isVerifiedKOL && (
                                            <Chip
                                                label="KOL"
                                                sx={{
                                                    backgroundColor: alpha('#ff6b6b', 0.2),
                                                    color: '#ff6b6b',
                                                    border: '1px solid #ff6b6b',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                            {userStats.totalPoints.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#888' }}>
                                            Total Points
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                            {userStats.todayPoints}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#888' }}>
                                            Today's Points
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                            {userStats.streak}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#888' }}>
                                            Day Streak
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                                            {userStats.weeklyProgress}/7
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#888' }}>
                                            Weekly Actions
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs */}
                <Box sx={{ mb: 4 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                color: '#888',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                '&.Mui-selected': {
                                    color: '#00ff88',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#00ff88',
                                height: 3,
                            }
                        }}
                    >
                        <Tab
                            icon={<AccountCircle />}
                            label="Top Believers"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<Business />}
                            label="Top Projects"
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {/* Content */}
                {activeTab === 0 && (
                    <Box>
                        {/* Top 3 Users - Podium Style */}
                        {userLeaderboard.length >= 3 && (
                            <Box sx={{ mb: 6 }}>
                                <Typography variant="h5" sx={{ color: '#00ff88', mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
                                    🏆 Hall of Fame
                                </Typography>
                                <Grid container spacing={3} justifyContent="center">
                                    {/* 2nd Place */}
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card sx={{
                                            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                                            border: '2px solid #C0C0C0',
                                            borderRadius: 3,
                                            textAlign: 'center',
                                            p: 3,
                                            height: 200,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}>
                                            <Typography variant="h3" sx={{ mb: 2 }}>🥈</Typography>
                                            <Avatar
                                                src={userLeaderboard[1]?.profileImage}
                                                sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                                            >
                                                {userLeaderboard[1]?.displayName?.charAt(0)}
                                            </Avatar>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                @{userLeaderboard[1]?.username}
                                            </Typography>
                                            <Typography variant="h5" sx={{ color: '#C0C0C0', fontWeight: 'bold' }}>
                                                {userLeaderboard[1]?.totalPoints.toLocaleString()}
                                            </Typography>
                                        </Card>
                                    </Grid>

                                    {/* 1st Place */}
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card sx={{
                                            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                                            border: '2px solid #FFD700',
                                            borderRadius: 3,
                                            textAlign: 'center',
                                            p: 3,
                                            height: 250,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            transform: 'translateY(-25px)',
                                        }}>
                                            <Typography variant="h2" sx={{ mb: 2 }}>🥇</Typography>
                                            <Avatar
                                                src={userLeaderboard[0]?.profileImage}
                                                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                                            >
                                                {userLeaderboard[0]?.displayName?.charAt(0)}
                                            </Avatar>
                                            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                @{userLeaderboard[0]?.username}
                                            </Typography>
                                            <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                                {userLeaderboard[0]?.totalPoints.toLocaleString()}
                                            </Typography>
                                        </Card>
                                    </Grid>

                                    {/* 3rd Place */}
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Card sx={{
                                            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                                            border: '2px solid #CD7F32',
                                            borderRadius: 3,
                                            textAlign: 'center',
                                            p: 3,
                                            height: 200,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                        }}>
                                            <Typography variant="h3" sx={{ mb: 2 }}>🥉</Typography>
                                            <Avatar
                                                src={userLeaderboard[2]?.profileImage}
                                                sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}
                                            >
                                                {userLeaderboard[2]?.displayName?.charAt(0)}
                                            </Avatar>
                                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                @{userLeaderboard[2]?.username}
                                            </Typography>
                                            <Typography variant="h5" sx={{ color: '#CD7F32', fontWeight: 'bold' }}>
                                                {userLeaderboard[2]?.totalPoints.toLocaleString()}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Full User Leaderboard Table */}
                        <Card sx={{
                            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                            border: '1px solid #333',
                            borderRadius: 3,
                        }}>
                            <CardContent sx={{ p: 0 }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: alpha('#00ff88', 0.1) }}>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Rank</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Believer</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Tier</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Total Points</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Weekly</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {userLeaderboard.map((entry) => (
                                                <TableRow
                                                    key={entry.userId}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: alpha('#00ff88', 0.05),
                                                        },
                                                        backgroundColor: entry.userId === user?.$id
                                                            ? alpha('#00ff88', 0.1)
                                                            : 'transparent'
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                color: getRankColor(entry.position),
                                                                fontWeight: 'bold',
                                                                fontSize: entry.position <= 3 ? '1.2rem' : '1rem'
                                                            }}
                                                        >
                                                            {getRankIcon(entry.position)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar
                                                                src={entry.profileImage || undefined}
                                                                sx={{ width: 40, height: 40 }}
                                                            >
                                                                {entry.displayName?.charAt(0)}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                    {entry.displayName || 'Anonymous'}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                                    @{entry.username}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={entry.rank.name}
                                                            icon={<Typography>{entry.rank.icon}</Typography>}
                                                            sx={{
                                                                backgroundColor: alpha(entry.rank.color, 0.2),
                                                                color: entry.rank.color,
                                                                border: `1px solid ${entry.rank.color}`,
                                                                fontWeight: 'bold',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                                            {entry.totalPoints.toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                                            +{entry.weeklyPoints}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1}>
                                                            {entry.isVerifiedKOL && (
                                                                <Chip
                                                                    label="KOL"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: alpha('#ff6b6b', 0.2),
                                                                        color: '#ff6b6b',
                                                                        fontSize: '0.7rem'
                                                                    }}
                                                                />
                                                            )}
                                                            {entry.position <= 10 && (
                                                                <Chip
                                                                    label="Top 10"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: alpha('#8b5cf6', 0.2),
                                                                        color: '#8b5cf6',
                                                                        fontSize: '0.7rem'
                                                                    }}
                                                                />
                                                            )}
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Box>
                )}

                {activeTab === 1 && (
                    <Box>
                        {/* Top 3 Projects - Card Style */}
                        {projectLeaderboard.length >= 3 && (
                            <Box sx={{ mb: 6 }}>
                                <Typography variant="h5" sx={{ color: '#00ff88', mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
                                    🚀 Top Performing Projects
                                </Typography>
                                <Grid container spacing={3}>
                                    {projectLeaderboard.slice(0, 3).map((project, index) => (
                                        <Grid size={{ xs: 12, md: 4 }} key={project.projectId}>
                                            <Card sx={{
                                                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                                                border: `2px solid ${getRankColor(index + 1)}`,
                                                borderRadius: 3,
                                                p: 3,
                                                textAlign: 'center',
                                                height: '100%',
                                            }}>
                                                <Typography variant="h2" sx={{ mb: 2 }}>
                                                    {getRankIcon(index + 1)}
                                                </Typography>
                                                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                                                    {project.projectName || `Project #${project.projectId.substring(0, 8)}`}
                                                </Typography>
                                                <Typography variant="h4" sx={{ color: getRankColor(index + 1), fontWeight: 'bold', mb: 2 }}>
                                                    {project.totalPoints.toLocaleString()} pts
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#00ff88' }}>
                                                                {project.totalUpvotes}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                                Upvotes
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ xs: 6 }}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Typography variant="h6" sx={{ color: '#ffa726' }}>
                                                                {project.averageRating.toFixed(1)}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                                Rating
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {/* Full Project Leaderboard Table */}
                        <Card sx={{
                            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                            border: '1px solid #333',
                            borderRadius: 3,
                        }}>
                            <CardContent sx={{ p: 0 }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: alpha('#00ff88', 0.1) }}>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Rank</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Project</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Points</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Upvotes</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Reviews</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Rating</TableCell>
                                                <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Momentum</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {projectLeaderboard.map((project) => (
                                                <TableRow
                                                    key={project.projectId}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: alpha('#00ff88', 0.05),
                                                        }
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                color: getRankColor(project.position),
                                                                fontWeight: 'bold',
                                                                fontSize: project.position <= 3 ? '1.2rem' : '1rem'
                                                            }}
                                                        >
                                                            {getRankIcon(project.position)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {project.projectName || 'Unnamed Project'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#888' }}>
                                                                ID: {project.projectId.substring(0, 12)}...
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="h6" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                                            {project.totalPoints.toLocaleString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <ThumbUp fontSize="small" sx={{ color: '#00ff88' }} />
                                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {project.totalUpvotes}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Star fontSize="small" sx={{ color: '#ffa726' }} />
                                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                                {project.totalReviews}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body1" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                                                            {project.averageRating > 0 ? project.averageRating.toFixed(1) : '-'}/10
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Whatshot fontSize="small" sx={{ color: '#ff6b6b' }} />
                                                            <Typography variant="body1" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                                                +{project.momentum}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Box>
                )}

                {/* Believer Ranks Reference */}
                <Card sx={{
                    mt: 6,
                    background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                    border: '1px solid #333',
                    borderRadius: 3,
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" sx={{ color: '#00ff88', mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                            🎖️ Believer Rank Tiers
                        </Typography>
                        <Grid container spacing={2}>
                            {BELIEVER_RANKS.map((rank, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={rank.name}>
                                    <Card sx={{
                                        background: alpha(rank.color, 0.1),
                                        border: `1px solid ${rank.color}`,
                                        borderRadius: 2,
                                        p: 2,
                                        textAlign: 'center',
                                        height: '100%',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 8px 25px ${alpha(rank.color, 0.3)}`,
                                        }
                                    }}>
                                        <Typography variant="h4" sx={{ mb: 1 }}>
                                            {rank.icon}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: rank.color, fontWeight: 'bold', mb: 1 }}>
                                            {rank.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#888', fontSize: '0.8rem' }}>
                                            {rank.minPoints.toLocaleString()} - {rank.maxPoints === Infinity ? '∞' : rank.maxPoints.toLocaleString()}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                {!authenticated && (
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Card sx={{
                            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                            border: '1px solid #00ff88',
                            borderRadius: 3,
                            p: 4,
                            maxWidth: 600,
                            mx: 'auto',
                        }}>
                            <Typography variant="h5" sx={{ color: '#00ff88', mb: 2, fontWeight: 'bold' }}>
                                🚀 Ready to Climb the Ranks?
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                                Join TokenReady, start earning Believer Points, and compete with the best believers in crypto!
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                        boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                                    }
                                }}
                                href="/explore"
                            >
                                Start Your Journey
                            </Button>
                        </Card>
                    </Box>
                )}
            </Container>
        </Box>
    );
}