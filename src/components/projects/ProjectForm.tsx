'use client';

import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Paper,
    Grid,
    FormControlLabel,
    Checkbox,
    Alert,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProjectFormData {
    name: string;
    ticker: string;
    twitter: string;
    website: string;
    github: string;
    description: string;
    launchDate: string;
    requestTwitterSpace: boolean;
    teamMembers: string;
    whitepaper: string;
    category: string;
}

export default function ProjectForm() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectFormData>();

    const categories = [
        'AI & Tools',
        'DeFi',
        'GameFi',
        'Meme & Culture',
        'Social & Media',
        'Infrastructure',
        'NFT & Metaverse',
    ];

    const checklistItems = [
        'Idea validated with Web3-native advisors',
        'Clear Product-Founder Fit explained',
        'Professional branding, site, tagline, assets ready',
        'Twitter, Telegram, and Discord presence',
        'MVP or Demo Live with GitHub or Figma links',
        'Video intro & launch tweet prepped',
        'Notable investors or influencers backing listed',
        'Tokenomics, utility docs, and whitepaper shared',
        'Twitter Space + launch date confirmed',
        'Dexscreener, icon, site, and contract filled',
    ];

    const onSubmit = async (data: ProjectFormData) => {
        setLoading(true);
        try {
            // Here you would submit to Appwrite
            console.log('Submitting project:', data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSubmitted(true);
            reset();
        } catch (error) {
            console.error('Error submitting project:', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" gutterBottom>
                    🎉 Project Submitted Successfully!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Your project has been submitted for community review. Our team will reach out within 24-48 hours.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setSubmitted(false)}
                >
                    Submit Another Project
                </Button>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }} >
                        <TextField
                            fullWidth
                            label="Project Name"
                            placeholder="e.g. VaderAI"
                            {...register('name', { required: 'Project name is required' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}  >
                        <TextField
                            fullWidth
                            label="Token Ticker"
                            placeholder="$VADER"
                            {...register('ticker', { required: 'Token ticker is required' })}
                            error={!!errors.ticker}
                            helperText={errors.ticker?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}  >
                        <FormControl fullWidth error={!!errors.category}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                {...register('category', { required: 'Category is required' })}
                                defaultValue=""
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} >
                        <TextField
                            fullWidth
                            label="Project Twitter Handle"
                            placeholder="@yourproject"
                            {...register('twitter', { required: 'Twitter handle is required' })}
                            error={!!errors.twitter}
                            helperText={errors.twitter?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} >
                        <TextField
                            fullWidth
                            label="Website URL"
                            placeholder="https://yourproject.xyz"
                            {...register('website', { required: 'Website URL is required' })}
                            error={!!errors.website}
                            helperText={errors.website?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }} >
                        <TextField
                            fullWidth
                            label="GitHub / Code Repo (optional)"
                            placeholder="https://github.com/project"
                            {...register('github')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }} >
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Brief Project Description"
                            placeholder="One-liner pitch and value prop..."
                            {...register('description', { required: 'Description is required' })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Planned Launch Date"
                            InputLabelProps={{ shrink: true }}
                            {...register('launchDate')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}  >
                        <FormControl fullWidth>
                            <InputLabel>Request Twitter Space for Launch?</InputLabel>
                            <Select
                                label="Request Twitter Space for Launch?"
                                defaultValue=""
                                {...register('requestTwitterSpace')}
                            >
                                <MenuItem value="true">Yes - Please Coordinate</MenuItem>
                                <MenuItem value="false">No - We&apos;ll handle it</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12 }} >
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Team Members (Name / Role / Link)"
                            placeholder="e.g. Jane Doe - Dev - https://twitter.com/janedoe"
                            {...register('teamMembers')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }} >
                        <TextField
                            fullWidth
                            label="Whitepaper / Litepaper Link"
                            placeholder="https://docs.yourproject.xyz"
                            {...register('whitepaper')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }} >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            ✅ Aixbc Extended Checklist
                        </Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Complete these items to improve your project&apos;s review score and visibility
                        </Alert>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {checklistItems.map((item, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={<Checkbox />}
                                    label={item}
                                    sx={{ color: 'text.secondary' }}
                                />
                            ))}
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }} >
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            sx={{
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                            }}
                        >
                            {loading ? 'Submitting for Curation...' : '🚀 Final Submit'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}