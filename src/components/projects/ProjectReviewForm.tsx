'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    Slider,
    Alert,
    Button,
    alpha,
} from '@mui/material';
import { useState } from 'react';

interface ProjectReviewFormProps {
    projectTicker: string;
    onSubmitReview: (data: { rating: number; review: string; investment: number }) => void;
}

export default function ProjectReviewForm({
    projectTicker,
    onSubmitReview,
}: ProjectReviewFormProps) {
    const [rating, setRating] = useState(8);
    const [review, setReview] = useState('');
    const [investment, setInvestment] = useState(1500);

    const handleSubmit = () => {
        onSubmitReview({ rating, review, investment });
        setRating(8);
        setReview('');
        setInvestment(1500);
    };

    return (
        <Card sx={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: '#00ff88', mb: 3, fontWeight: 'bold' }}>
                    📊 Project Review — {projectTicker}
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Rate This Project (1-10)
                    </Typography>
                    <Slider
                        value={rating}
                        onChange={(_, newValue) => setRating(newValue as number)}
                        min={1}
                        max={10}
                        step={1}
                        marks
                        valueLabelDisplay="on"
                        sx={{
                            mb: 2,
                            color: '#00ff88',
                            '& .MuiSlider-thumb': {
                                backgroundColor: '#00ff88',
                                border: '2px solid #000',
                                '&:hover': {
                                    boxShadow: '0 0 0 8px rgba(0, 255, 136, 0.16)',
                                }
                            },
                            '& .MuiSlider-track': {
                                backgroundColor: '#00ff88',
                                background: 'linear-gradient(90deg, #00ff88, #4dffb0)',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: '#333',
                            },
                            '& .MuiSlider-mark': {
                                backgroundColor: '#666',
                            },
                            '& .MuiSlider-valueLabel': {
                                backgroundColor: '#00ff88',
                                color: '#000',
                                fontWeight: 'bold',
                            }
                        }}
                    />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Short Review
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Why do you believe in this project?"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: alpha('#00ff88', 0.05),
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#00ff88' },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#00ff88',
                                    boxShadow: `0 0 0 2px ${alpha('#00ff88', 0.2)}`,
                                },
                            },
                            '& .MuiOutlinedInput-input': { color: 'white' },
                        }}
                    />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                        Simulate Investment (in $BOB Points)
                    </Typography>
                    <TextField
                        fullWidth
                        type="number"
                        placeholder="e.g. 1500"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: alpha('#00ff88', 0.05),
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#00ff88' },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#00ff88',
                                    boxShadow: `0 0 0 2px ${alpha('#00ff88', 0.2)}`,
                                },
                            },
                            '& .MuiOutlinedInput-input': { color: 'white' },
                        }}
                    />
                    <Alert
                        severity="warning"
                        sx={{
                            mt: 2,
                            backgroundColor: alpha('#ffa726', 0.1),
                            color: '#ffa726',
                            border: '1px solid #ffa726'
                        }}
                    >
                        ⚠️ This project is considered oversubscribed after $100,000 total virtual pledges.
                    </Alert>
                </Box>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{
                        py: 2,
                        background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                            boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                        }
                    }}
                >
                    📝 Submit Review & Simulated Investment
                </Button>
            </CardContent>
        </Card>
    );
}