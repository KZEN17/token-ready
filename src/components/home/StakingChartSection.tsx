'use client';

import {
    Box,
    Typography,
    Card,
    CardContent,
    Container,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StakingChartSection() {
    // Mock data for prediction chart
    const chartData = [
        { month: 'Jan', value: 36490000, predicted: false },
        { month: 'Feb', value: 38200000, predicted: false },
        { month: 'Mar', value: 35800000, predicted: false },
        { month: 'Apr', value: 39500000, predicted: false },
        { month: 'May', value: 41200000, predicted: false },
        { month: 'Jun', value: 36490000, predicted: false }, // Current
        { month: 'Jul', value: 42000000, predicted: true },
        { month: 'Aug', value: 45500000, predicted: true },
        { month: 'Sep', value: 48200000, predicted: true },
        { month: 'Oct', value: 52000000, predicted: true },
        { month: 'Nov', value: 55800000, predicted: true },
        { month: 'Dec', value: 58500000, predicted: true },
    ];

    const formatValue = (value: number) => {
        return `$${(value / 1000000).toFixed(1)}M`;
    };

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="xl">
                <Typography
                    variant="h2"
                    sx={{
                        textAlign: 'center',
                        mb: 6,
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    📈 Market Cap Prediction
                </Typography>

                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        tickFormatter={formatValue}
                                        stroke="#94a3b8"
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatValue(value), 'Market Cap']}
                                        labelFormatter={(label: any) => `Month: ${label}`}
                                        contentStyle={{
                                            backgroundColor: '#1a1a2e',
                                            border: '1px solid #475569',
                                            borderRadius: '8px',
                                            color: '#ffffff'
                                        }}
                                    />
                                    {/* Historical data line */}
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                                        data={chartData.filter(item => !item.predicted)}
                                    />
                                    {/* Predicted data line */}
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        strokeDasharray="5 5"
                                        dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
                                        data={chartData.filter(item => item.predicted)}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 20, height: 3, backgroundColor: 'primary.main' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Historical Data
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                    width: 20,
                                    height: 3,
                                    backgroundColor: 'primary.main',
                                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 4px)'
                                }} />
                                <Typography variant="body2" color="text.secondary">
                                    Predicted Growth
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}