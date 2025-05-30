'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material';
import { useState } from 'react';
import { AccountBalanceWallet, TrendingUp } from '@mui/icons-material';

export default function StakingDashboard() {
    const [stakeAmount, setStakeAmount] = useState('');
    const [stakingPeriod, setStakingPeriod] = useState('90');
    const [connected, setConnected] = useState(false);

    const stakingData = {
        yourStaked: 0,
        estimatedAPR: 12.5,
        treasuryValue: 847000,
        activeProjects: 5,
    };

    const topStakers = [
        { rank: 1, wallet: '0x40ac...face', totalStaked: '11,991,912', period: '360 Days' },
        { rank: 2, wallet: '0xa98f...182e', totalStaked: '10,008,833', period: '360 Days' },
        { rank: 3, wallet: '0x94d4...b0c6', totalStaked: '7,000,000', period: '180 Days' },
        { rank: 4, wallet: '0x0819...3a24', totalStaked: '4,571,433', period: '360 Days' },
        { rank: 5, wallet: '0xfdcc...2905', totalStaked: '8,509,693', period: '90 Days' },
    ];

    const stakingFeatures = [
        '💰 Stake $BOB to earn share of yield from invested projects',
        '📊 Live staking dashboard with APR and pool metrics',
        '🔐 Non-custodial, chain-native staking contracts',
        '🎁 Future airdrops to long-term stakers',
    ];

    return (
        <Box sx={{ py: 4 }}>
            <Typography
                variant="h2"
                sx={{
                    mb: 2,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                💎 Staking & Rewards
            </Typography>

            <Grid container spacing={4}>
                {/* Connect Wallet Section */}
                <Grid size={{ xs: 12, md: 6 }} >
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" color="primary.main" gutterBottom>
                                Connect Wallet
                            </Typography>

                            {!connected ? (
                                <Button
                                    variant="contained"
                                    startIcon={<AccountBalanceWallet />}
                                    onClick={() => setConnected(true)}
                                    sx={{ mb: 3 }}
                                >
                                    Connect Wallet
                                </Button>
                            ) : (
                                <Chip
                                    label="Wallet Connected"
                                    color="success"
                                    sx={{ mb: 3 }}
                                />
                            )}

                            <Typography variant="h6" gutterBottom>
                                Staking Pool Overview
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                {stakingFeatures.map((feature, index) => (
                                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                                        {feature}
                                    </Typography>
                                ))}
                            </Box>

                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid size={{ xs: 6 }} >
                                    <Typography variant="body2" color="text.secondary">
                                        Your Staked Amount:
                                    </Typography>
                                    <Typography variant="h6" color="primary.main">
                                        {stakingData.yourStaked} $BOB
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }} >
                                    <Typography variant="body2" color="text.secondary">
                                        Estimated APR:
                                    </Typography>
                                    <Typography variant="h6" color="secondary.main">
                                        {stakingData.estimatedAPR}%
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }} >
                                    <Typography variant="body2" color="text.secondary">
                                        DAO Treasury Value:
                                    </Typography>
                                    <Typography variant="h6">
                                        ${stakingData.treasuryValue.toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }} >
                                    <Typography variant="body2" color="text.secondary">
                                        Active Projects:
                                    </Typography>
                                    <Typography variant="h6">
                                        {stakingData.activeProjects}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <TextField
                                fullWidth
                                label="Amount to Stake:"
                                placeholder="Enter amount in $BOB"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                sx={{ mb: 3 }}
                                disabled={!connected}
                            />

                            <FormControl component="fieldset" sx={{ mb: 3 }}>
                                <FormLabel component="legend">Staking Period:</FormLabel>
                                <RadioGroup
                                    row
                                    value={stakingPeriod}
                                    onChange={(e) => setStakingPeriod(e.target.value)}
                                >
                                    <FormControlLabel value="30" control={<Radio />} label="30 Days" disabled={!connected} />
                                    <FormControlLabel value="90" control={<Radio />} label="90 Days" disabled={!connected} />
                                    <FormControlLabel value="180" control={<Radio />} label="180 Days" disabled={!connected} />
                                    <FormControlLabel value="360" control={<Radio />} label="360 Days" disabled={!connected} />
                                </RadioGroup>
                            </FormControl>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={!connected || !stakeAmount}
                                    startIcon={<TrendingUp />}
                                >
                                    Stake More
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    disabled={!connected}
                                >
                                    Unstake
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Leaderboard Section */}
                <Grid size={{ xs: 12, md: 6 }} >
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" color="primary.main" gutterBottom>
                                🏆 Leaderboard — Top $BOB Stakers
                            </Typography>

                            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Rank</TableCell>
                                            <TableCell>Wallet</TableCell>
                                            <TableCell align="right">Total Staked</TableCell>
                                            <TableCell align="right">Period</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {topStakers.map((staker) => (
                                            <TableRow key={staker.rank}>
                                                <TableCell>
                                                    <Chip
                                                        label={`#${staker.rank}`}
                                                        size="small"
                                                        color={staker.rank <= 3 ? 'primary' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontFamily="monospace">
                                                        {staker.wallet}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                                                        {staker.totalStaked}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" color="text.secondary">
                                                        {staker.period}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}