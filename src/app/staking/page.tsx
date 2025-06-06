'use client';

import {
    Container,
    Typography,
    Box,
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
    LinearProgress,
    Alert,
    Divider,
    Stack,
} from '@mui/material';
import { useState } from 'react';
import {
    AccountBalanceWallet,
    TrendingUp,
    AccessTime,
    Security,
    Timeline,
    Info,
} from '@mui/icons-material';

export default function StakingPage() {
    const [stakeAmount, setStakeAmount] = useState('');
    const [stakingPeriod, setStakingPeriod] = useState('90');
    const [connected, setConnected] = useState(false);
    const [activeTab, setActiveTab] = useState('stake');

    // Mock staking data
    const stakingData = {
        marketCap: '$36,490,000',
        marketCapChange: '-$3,572,371 (-9.79%)',
        percentStaked: '57.09%',
        stakedUSD: '$20,832,988',
        bobScore: '634,286',
        stakedTokens: '147,932',
        timeToWithdraw: '355 Days',
        maxAmount: '12,500',
        yourStaked: connected ? 5000 : 0,
        estimatedAPR: 12.5,
        treasuryValue: 847000,
        activeProjects: 5,
        pendingRewards: connected ? 125.4 : 0,
    };

    const stakingPeriods = [
        { value: '30', label: '30 Days', multiplier: 1.0, apr: '8.5%' },
        { value: '90', label: '90 Days', multiplier: 1.2, apr: '12.5%' },
        { value: '180', label: '180 Days', multiplier: 1.5, apr: '18.0%' },
        { value: '360', label: '360 Days', multiplier: 2.0, apr: '25.0%' },
    ];

    const topStakers = [
        { rank: 1, wallet: '0x40ac...face', totalStaked: '11,991,912', period: '360 Days', rewards: '298,978' },
        { rank: 2, wallet: '0xa98f...182e', totalStaked: '10,008,833', period: '360 Days', rewards: '250,221' },
        { rank: 3, wallet: '0x94d4...b0c6', totalStaked: '7,000,000', period: '180 Days', rewards: '105,000' },
        { rank: 4, wallet: '0x0819...3a24', totalStaked: '4,571,433', period: '360 Days', rewards: '114,286' },
        { rank: 5, wallet: '0xfdcc...2905', totalStaked: '8,509,693', period: '90 Days', rewards: '85,097' },
    ];

    const stakingFeatures = [
        {
            icon: <Security />,
            title: 'Non-Custodial Security',
            description: 'Your tokens remain in your control with chain-native smart contracts'
        },
        {
            icon: <TrendingUp />,
            title: 'Yield Generation',
            description: 'Earn share of yield from invested projects in the TokenReady ecosystem'
        },
        {
            icon: <Timeline />,
            title: 'Flexible Periods',
            description: 'Choose from 30 to 360 days with higher rewards for longer commitments'
        },
        {
            icon: <AccessTime />,
            title: 'Daily Rewards',
            description: 'Rewards are calculated daily and can be claimed at any time'
        }
    ];

    const handleStake = () => {
        if (!connected) {
            setConnected(true);
            return;
        }
        console.log('Staking:', { amount: stakeAmount, period: stakingPeriod });
        // Handle staking logic
    };

    const handleUnstake = () => {
        console.log('Unstaking');
        // Handle unstaking logic
    };

    const selectedPeriod = stakingPeriods.find(p => p.value === stakingPeriod);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Page Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                    variant="h1"
                    sx={{
                        mb: 2,
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    💎 Staking & Rewards
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                    Stake $BOB tokens to earn rewards from project yields and participate in the TokenReady ecosystem
                </Typography>
            </Box>

            {/* Key Stats */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Total Value Locked
                            </Typography>
                            <Typography variant="h4" color="primary.main" fontWeight={700}>
                                {stakingData.stakedUSD}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Staking APR
                            </Typography>
                            <Typography variant="h4" color="primary.main" fontWeight={700}>
                                {stakingData.estimatedAPR}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Total Stakers
                            </Typography>
                            <Typography variant="h4" color="primary.main" fontWeight={700}>
                                1,247
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                % BOB Staked
                            </Typography>
                            <Typography variant="h4" color="primary.main" fontWeight={700}>
                                {stakingData.percentStaked}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={57.09}
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Staking Interface */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            {/* Wallet Connection */}
                            {!connected ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <AccountBalanceWallet sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h5" gutterBottom>
                                        Connect Your Wallet
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                        Connect your wallet to start staking $BOB tokens and earn rewards
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<AccountBalanceWallet />}
                                        onClick={() => setConnected(true)}
                                    >
                                        Connect Wallet
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    {/* Tabs */}
                                    <Box sx={{ mb: 4 }}>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant={activeTab === 'stake' ? 'contained' : 'outlined'}
                                                onClick={() => setActiveTab('stake')}
                                            >
                                                Stake
                                            </Button>
                                            <Button
                                                variant={activeTab === 'unstake' ? 'contained' : 'outlined'}
                                                onClick={() => setActiveTab('unstake')}
                                            >
                                                Unstake
                                            </Button>
                                            <Button
                                                variant={activeTab === 'rewards' ? 'contained' : 'outlined'}
                                                onClick={() => setActiveTab('rewards')}
                                            >
                                                Rewards
                                            </Button>
                                        </Stack>
                                    </Box>

                                    {activeTab === 'stake' && (
                                        <>
                                            <Typography variant="h5" gutterBottom>
                                                Stake $BOB Tokens
                                            </Typography>

                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Amount to Stake
                                                </Typography>
                                                <TextField
                                                    fullWidth
                                                    value={stakeAmount}
                                                    onChange={(e) => setStakeAmount(e.target.value)}
                                                    placeholder="Enter amount"
                                                    type="number"
                                                    InputProps={{
                                                        endAdornment: (
                                                            <Button
                                                                size="small"
                                                                onClick={() => setStakeAmount(stakingData.maxAmount)}
                                                            >
                                                                Max
                                                            </Button>
                                                        )
                                                    }}
                                                />
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    Available Balance: {stakingData.maxAmount} $BOB
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Staking Period
                                                </Typography>
                                                <FormControl component="fieldset">
                                                    <RadioGroup
                                                        value={stakingPeriod}
                                                        onChange={(e) => setStakingPeriod(e.target.value)}
                                                    >
                                                        <Grid container spacing={2}>
                                                            {stakingPeriods.map((period) => (
                                                                <Grid size={{ xs: 12, sm: 6 }} key={period.value}>
                                                                    <Card
                                                                        sx={{
                                                                            cursor: 'pointer',
                                                                            border: stakingPeriod === period.value ?
                                                                                (theme) => `2px solid ${theme.palette.primary.main}` :
                                                                                'none'
                                                                        }}
                                                                        onClick={() => setStakingPeriod(period.value)}
                                                                    >
                                                                        <CardContent sx={{ p: 2 }}>
                                                                            <FormControlLabel
                                                                                value={period.value}
                                                                                control={<Radio />}
                                                                                label={
                                                                                    <Box>
                                                                                        <Typography variant="subtitle1" fontWeight={600}>
                                                                                            {period.label}
                                                                                        </Typography>
                                                                                        <Typography variant="body2" color="primary.main">
                                                                                            APR: {period.apr}
                                                                                        </Typography>
                                                                                        <Typography variant="body2" color="text.secondary">
                                                                                            Multiplier: {period.multiplier}x
                                                                                        </Typography>
                                                                                    </Box>
                                                                                }
                                                                                sx={{ m: 0 }}
                                                                            />
                                                                        </CardContent>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </RadioGroup>
                                                </FormControl>
                                            </Box>

                                            {selectedPeriod && stakeAmount && (
                                                <Alert severity="info" sx={{ mb: 3 }}>
                                                    <Typography variant="body2">
                                                        <strong>Estimated Rewards:</strong> {' '}
                                                        {(parseFloat(stakeAmount) * (parseFloat(selectedPeriod.apr) / 100) / 12).toFixed(2)} $BOB per month
                                                    </Typography>
                                                </Alert>
                                            )}

                                            <Button
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                onClick={handleStake}
                                                disabled={!stakeAmount}
                                                sx={{ py: 2 }}
                                            >
                                                Stake {stakeAmount || '0'} $BOB
                                            </Button>
                                        </>
                                    )}

                                    {activeTab === 'unstake' && (
                                        <Box>
                                            <Typography variant="h5" gutterBottom>
                                                Unstake $BOB Tokens
                                            </Typography>

                                            <Card sx={{ mb: 3, backgroundColor: (theme) => `${theme.palette.warning.main}15` }}>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        Your Staked Position
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        <Grid size={{ xs: 6 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Staked Amount
                                                            </Typography>
                                                            <Typography variant="h6" color="primary.main">
                                                                {stakingData.yourStaked.toLocaleString()} $BOB
                                                            </Typography>
                                                        </Grid>
                                                        <Grid size={{ xs: 6 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Time Remaining
                                                            </Typography>
                                                            <Typography variant="h6" color="warning.main">
                                                                {stakingData.timeToWithdraw}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>

                                            <Alert severity="warning" sx={{ mb: 3 }}>
                                                <Typography variant="body2">
                                                    ⚠️ Early unstaking may result in penalty fees. You can unstake without penalty after your staking period expires.
                                                </Typography>
                                            </Alert>

                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                size="large"
                                                fullWidth
                                                onClick={handleUnstake}
                                                sx={{ py: 2 }}
                                            >
                                                Unstake All Tokens
                                            </Button>
                                        </Box>
                                    )}

                                    {activeTab === 'rewards' && (
                                        <Box>
                                            <Typography variant="h5" gutterBottom>
                                                Claim Rewards
                                            </Typography>

                                            <Card sx={{ mb: 3, backgroundColor: (theme) => `${theme.palette.success.main}15` }}>
                                                <CardContent sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h3" color="primary.main" fontWeight={700}>
                                                        {stakingData.pendingRewards} $BOB
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Available Rewards
                                                    </Typography>
                                                </CardContent>
                                            </Card>

                                            <Button
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                disabled={stakingData.pendingRewards === 0}
                                                sx={{ py: 2 }}
                                            >
                                                Claim Rewards
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sidebar */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={3}>
                        {/* Leaderboard */}
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    🏆 Top Stakers
                                </Typography>

                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Rank</TableCell>
                                                <TableCell>Wallet</TableCell>
                                                <TableCell align="right">Staked</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {topStakers.slice(0, 5).map((staker) => (
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
                                                            {(parseInt(staker.totalStaked.replace(/,/g, '')) / 1000000).toFixed(1)}M
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Info /> Staking Benefits
                                </Typography>

                                <Stack spacing={2}>
                                    {stakingFeatures.map((feature, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{
                                                minWidth: 40,
                                                height: 40,
                                                borderRadius: 2,
                                                backgroundColor: (theme) => `${theme.palette.primary.main}20`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'primary.main'
                                            }}>
                                                {feature.icon}
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {feature.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    {feature.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}