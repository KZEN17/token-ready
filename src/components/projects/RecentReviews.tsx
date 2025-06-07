'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    alpha,
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface Review {
    user: string;
    rating: number;
    comment: string;
    bobPoints: number;
}

interface RecentReviewsProps {
    reviews?: Review[];
}

export default function RecentReviews({ reviews }: RecentReviewsProps) {
    const recentReviews = reviews || [
        { user: '@alpha_bob', rating: 9, comment: 'Team is KYC\'d & docs ready. Worth watching.', bobPoints: 187 },
        { user: '@earlydgen', rating: 7, comment: 'Strong concept but needs more development.', bobPoints: 161 },
        { user: '@honestbagger', rating: 8, comment: 'Solid project with good fundamentals.', bobPoints: 140 },
        { user: '@checkmate', rating: 9, comment: 'Best tokenomics I\'ve seen in this category.', bobPoints: 126 },
    ];

    return (
        <Card sx={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: '#00ff88', mb: 3, fontWeight: 'bold' }}>
                    📋 Latest Reviews
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentReviews.map((review, index) => (
                        <Box key={index}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                    {review.user}
                                </Typography>
                                <Chip
                                    label={`${review.bobPoints} BOB Points`}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha('#00ff88', 0.1),
                                        color: '#00ff88',
                                        border: '1px solid #00ff88',
                                        fontSize: '0.7rem'
                                    }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1, fontStyle: 'italic' }}>
                                "{review.comment}"
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Star fontSize="small" sx={{ color: '#ffa726' }} />
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    Rating: {review.rating}/10
                                </Typography>
                            </Box>
                            {index < recentReviews.length - 1 && <Divider sx={{ mt: 2, borderColor: '#333' }} />}
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}