'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Container,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Chip,
    LinearProgress,
} from '@mui/material';
import { useState } from 'react';
import {
    AccountBalanceWallet,
    TrendingUp,
    CalculateOutlined as Calculator,
    AccessTime,
} from '@mui/icons-material';

export default function StakingInfoSection() {
    const [stakeAmount, setStakeAmount] = useState('0.0');
    const [stakingPeriod, setStakingPeriod] = useState('90');

    // Mock staking data from the images
    const stakingData = {
        marketCap: '$36,490,000',
        marketCapChange: '-$3,572,371 (-9.79%)',
        percentStaked: '57.09%',
        stakedUSD: '$20,832,988',
        bobScore: '634,286',
        stakedTokens: '147,932',
        timeToWithdraw: '355 Days',
        maxAmount: 'N/A',
    };

    const stakingPeriods = [
        { value: '30', label: '30 Days', multiplier: 1.0 },
        { value: '90', label: '90 Days', multiplier: 1.2 },
        { value: '180', label: '180 Days', multiplier: 1.5 },
        { value: '360', label: '360 Days', multiplier: 2.0 },
    ];

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography
                variant="h2"
                sx={{
                    textAlign: 'center',
                    mb: 6,
                    background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                💎 Staking Overview
            </Typography>

            <Grid container spacing={4}>
                {/* Left side - Staking Stats */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Grid container spacing={3}>
                        {/* Market Cap */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        $BOB Market Cap
                                    </Typography>
                                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                                        {stakingData.marketCap}
                                    </Typography>
                                    <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                                        {stakingData.marketCapChange}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Percentage Staked */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        % of $BOB Staked
                                    </Typography>
                                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                                        {stakingData.percentStaked}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={57.09}
                                        sx={{ mt: 2, height: 8, borderRadius: 4 }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Staked in USD */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Staked $BOB in USD
                                    </Typography>
                                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                                        {stakingData.stakedUSD}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* BOB Score */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        $BOB Score
                                    </Typography>
                                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                                        {stakingData.bobScore}
                                    </Typography>
                                    <Button
                                        size="small"
                                        startIcon={<Calculator />}
                                        sx={{ mt: 1 }}
                                    >
                                        Score Calculator
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Additional Stats */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Staked $BOB
                                    </Typography>
                                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                                        {stakingData.stakedTokens}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Time to Withdraw */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Time to Withdraw
                                    </Typography>
                                    <Typography variant="h4" color="secondary.main" fontWeight={700}>
                                        {stakingData.timeToWithdraw}
                                    </Typography>
                                    <AccessTime color="secondary" sx={{ mt: 1 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Right side - Staking Form */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Chip label="STAKE" color="primary" />
                                <Chip label="WITHDRAW" variant="outlined" />
                            </Box>

                            <Typography variant="h6" gutterBottom>
                                Amount
                            </Typography>
                            <TextField
                                fullWidth
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                placeholder="0.0"
                                sx={{ mb: 2 }}
                                InputProps={{
                                    endAdornment: <Button size="small">Max</Button>
                                }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Balance: {stakingData.maxAmount}
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                                Staking Period
                            </Typography>
                            <FormControl component="fieldset" sx={{ mb: 3 }}>
                                <RadioGroup
                                    value={stakingPeriod}
                                    onChange={(e) => setStakingPeriod(e.target.value)}
                                    sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}
                                >
                                    {stakingPeriods.map((period) => (
                                        <FormControlLabel
                                            key={period.value}
                                            value={period.value}
                                            control={<Radio size="small" />}
                                            label={period.label}
                                            sx={{
                                                m: 0,
                                                '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<AccountBalanceWallet />}
                                sx={{ mb: 2 }}
                            >
                                Enter Amount
                            </Button>

                            <Typography variant="body2" color="warning.main" sx={{ textAlign: 'center' }}>
                                ⚠️ If you want to stake more $BOB, this is possible but it will extend your original staking commitment duration as the initial staking commitment date will be replaced by today!
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}