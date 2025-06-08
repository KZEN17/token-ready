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
    CircularProgress,
    Chip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Star, CheckCircle, Warning } from '@mui/icons-material';
import { ReviewService } from '@/lib/reviewService';
import { useUser } from '@/hooks/useUser';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import AuthDialog from '@/components/auth/AuthDialog';

interface ProjectReviewFormProps {
    projectId: string;
    projectTicker: string;
    projectName: string;
    onReviewSubmitted?: (review: any) => void;
}

export default function ProjectReviewForm({
    projectId,
    projectTicker,
    projectName,
    onReviewSubmitted,
}: ProjectReviewFormProps) {
    const { user, authenticated, updateUserPoints } = useUser();
    const { requireAuth, showAuthDialog, hideAuthDialog, authMessage, login } = useAuthGuard();

    const [rating, setRating] = useState(8);
    const [comment, setComment] = useState('');
    const [investment, setInvestment] = useState(1500);
    const [loading, setLoading] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [checkingReview, setCheckingReview] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Check if user has already reviewed this project
    useEffect(() => {
        const checkExistingReview = async () => {
            if (!authenticated || !user) return;

            setCheckingReview(true);
            try {
                const hasReview = await ReviewService.hasUserReviewedProject(user.$id, projectId);
                setHasReviewed(hasReview);
            } catch (error) {
                console.error('Error checking existing review:', error);
            } finally {
                setCheckingReview(false);
            }
        };

        checkExistingReview();
    }, [authenticated, user, projectId]);

    const calculateEstimatedPoints = () => {
        // Use the same calculation logic as the service
        const ratingPoints = rating * 10;
        let investmentPoints = 0;
        if (investment >= 5000) investmentPoints = 50;
        else if (investment >= 2500) investmentPoints = 30;
        else if (investment >= 1000) investmentPoints = 20;
        else if (investment >= 500) investmentPoints = 10;
        else if (investment >= 100) investmentPoints = 5;

        const bonusPoints = (rating >= 8 && investment >= 1000) ? 20 : 0;
        return ratingPoints + investmentPoints + bonusPoints;
    };

    const handleSubmit = async () => {
        if (!authenticated || !user) {
            requireAuth(() => { }, 'submit reviews');
            return;
        }

        if (!comment.trim()) {
            setError('Please provide a review comment');
            return;
        }

        if (comment.length < 10) {
            setError('Review comment must be at least 10 characters long');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const reviewData = {
                projectId,
                userId: user.$id,
                rating,
                comment: comment.trim(),
                investment,
            };

            const newReview = await ReviewService.submitReview(reviewData);

            // Update user's believer points FIRST
            if (updateUserPoints) {
                try {
                    await updateUserPoints(0, newReview.believerPoints);
                } catch (pointsError) {
                    console.error('Error updating user points:', pointsError);
                    // Don't fail the review submission if points update fails
                }
            }

            setSuccess(true);
            setHasReviewed(true);
            setComment('');
            setRating(8);
            setInvestment(1500);

            // Notify parent component AFTER points are updated
            // Pass a flag to indicate points were already updated
            if (onReviewSubmitted) {
                onReviewSubmitted({ ...newReview, pointsAlreadyUpdated: true });
            }

            // Auto-hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (error: any) {
            console.error('Error submitting review:', error);
            setError(error.message || 'Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 8) return '#00ff88';
        if (rating >= 6) return '#ffa726';
        if (rating >= 4) return '#ff9800';
        return '#ff6b6b';
    };

    const getRatingLabel = (rating: number) => {
        if (rating >= 9) return 'Excellent';
        if (rating >= 8) return 'Very Good';
        if (rating >= 7) return 'Good';
        if (rating >= 6) return 'Decent';
        if (rating >= 5) return 'Average';
        if (rating >= 4) return 'Below Average';
        if (rating >= 3) return 'Poor';
        return 'Very Poor';
    };

    if (!authenticated) {
        return (
            <>
                <Card sx={{
                    background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                    border: '1px solid #333',
                    borderRadius: 3,
                }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                            color: '#000',
                            fontSize: '2rem',
                        }}>
                            🔐
                        </Box>
                        <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 'bold' }}>
                            Login to Review {projectName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
                            Share your thoughts and earn Believer Points by reviewing this project.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => requireAuth(() => { }, 'submit reviews')}
                            sx={{
                                background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                                color: '#000',
                                fontWeight: 'bold',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                    boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                                }
                            }}
                        >
                            Login to Review
                        </Button>
                    </CardContent>
                </Card>

                <AuthDialog
                    open={showAuthDialog}
                    onClose={hideAuthDialog}
                    onLogin={login}
                    message={authMessage}
                />
            </>
        );
    }

    if (checkingReview) {
        return (
            <Card sx={{
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #333',
                borderRadius: 3,
            }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <CircularProgress size={40} sx={{ color: '#00ff88', mb: 2 }} />
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        Checking review status...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (hasReviewed) {
        return (
            <Card sx={{
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #00ff88',
                borderRadius: 3,
            }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <CheckCircle sx={{ color: '#00ff88', fontSize: '3rem', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 'bold' }}>
                        Thank You for Your Review!
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                        You've already submitted a review for {projectName}. Your contribution helps the community make better decisions.
                    </Typography>
                    <Chip
                        label="Review Submitted"
                        sx={{
                            backgroundColor: alpha('#00ff88', 0.1),
                            color: '#00ff88',
                            border: '1px solid #00ff88',
                        }}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card sx={{
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #333',
                borderRadius: 3,
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ color: '#00ff88', mb: 3, fontWeight: 'bold' }}>
                        📊 Review {projectTicker}
                    </Typography>

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                backgroundColor: alpha('#00ff88', 0.1),
                                color: '#00ff88',
                                border: '1px solid #00ff88'
                            }}
                        >
                            Review submitted successfully! You earned {calculateEstimatedPoints()} Believer Points.
                        </Alert>
                    )}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                backgroundColor: alpha('#ff6b6b', 0.1),
                                color: '#ff6b6b',
                                border: '1px solid #ff6b6b'
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ color: 'white' }}>
                                Rate This Project (1-10)
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Star sx={{ color: getRatingColor(rating) }} />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: getRatingColor(rating),
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {rating} - {getRatingLabel(rating)}
                                </Typography>
                            </Box>
                        </Box>
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
                                color: getRatingColor(rating),
                                '& .MuiSlider-thumb': {
                                    backgroundColor: getRatingColor(rating),
                                    border: '2px solid #000',
                                    '&:hover': {
                                        boxShadow: `0 0 0 8px ${alpha(getRatingColor(rating), 0.16)}`,
                                    }
                                },
                                '& .MuiSlider-track': {
                                    backgroundColor: getRatingColor(rating),
                                    background: `linear-gradient(90deg, ${getRatingColor(rating)}, ${getRatingColor(rating)}dd)`,
                                },
                                '& .MuiSlider-rail': {
                                    backgroundColor: '#333',
                                },
                                '& .MuiSlider-mark': {
                                    backgroundColor: '#666',
                                },
                                '& .MuiSlider-valueLabel': {
                                    backgroundColor: getRatingColor(rating),
                                    color: '#000',
                                    fontWeight: 'bold',
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            Review Comment *
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Why do you believe in this project? Share your thoughts on the team, technology, market opportunity, or potential concerns..."
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value);
                                setError(null);
                            }}
                            error={!!error && error.includes('comment')}
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
                        <Typography variant="caption" sx={{ color: '#888', mt: 1, display: 'block' }}>
                            {comment.length}/500 characters (minimum 10 required)
                        </Typography>
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

                        {investment > 100000 && (
                            <Alert
                                severity="warning"
                                sx={{
                                    mt: 2,
                                    backgroundColor: alpha('#ffa726', 0.1),
                                    color: '#ffa726',
                                    border: '1px solid #ffa726'
                                }}
                                icon={<Warning />}
                            >
                                ⚠️ This project is considered oversubscribed after $100,000 total virtual pledges.
                            </Alert>
                        )}

                        <Box sx={{ mt: 2, p: 2, backgroundColor: alpha('#00ff88', 0.05), borderRadius: 2, border: '1px solid #00ff88' }}>
                            <Typography variant="body2" sx={{ color: '#00ff88', fontWeight: 'bold', mb: 1 }}>
                                💎 Estimated Believer Points: {calculateEstimatedPoints()}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#888' }}>
                                Points breakdown: Rating ({rating * 10}) + Investment tier + Performance bonus
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading || !comment.trim() || comment.length < 10}
                        sx={{
                            py: 2,
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #4dffb0, #00ff88)',
                                boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
                            },
                            '&:disabled': {
                                background: alpha('#666', 0.3),
                                color: alpha('#fff', 0.5),
                            }
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={20} sx={{ color: 'inherit' }} />
                                Submitting Review...
                            </Box>
                        ) : (
                            '📝 Submit Review & Investment'
                        )}
                    </Button>

                    <Typography variant="caption" sx={{ color: '#888', textAlign: 'center', display: 'block', mt: 2 }}>
                        Your review will be public and help other believers make informed decisions.
                    </Typography>
                </CardContent>
            </Card>

            <AuthDialog
                open={showAuthDialog}
                onClose={hideAuthDialog}
                onLogin={login}
                message={authMessage}
            />
        </>
    );
}