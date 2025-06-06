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
    CircularProgress,
    Avatar,
    IconButton,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { storage, databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '../../lib/appwrite';
import { ID } from 'appwrite';

interface ProjectFormData {
    name: string;
    ticker: string;
    twitter: string;
    website: string;
    github: string;
    description: string;
    launchDate: string;
    requestTwitterSpace: string; // This will be a string from the form
    teamMembers: string;
    whitepaper: string;
    category: string;
}

export default function ProjectForm() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);

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

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image file size must be less than 5MB');
                return;
            }

            setLogoFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
    };

    const uploadLogo = async (): Promise<string | null> => {
        if (!logoFile) return null;

        try {
            setUploadingLogo(true);

            // Upload to Appwrite Storage - using the bucket ID from environment
            const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'project-logos';
            const response = await storage.createFile(
                bucketId,
                ID.unique(),
                logoFile
            );

            // Get the file URL
            const fileUrl = storage.getFileView(bucketId, response.$id);
            return fileUrl.toString();
        } catch (error) {
            console.error('Logo upload failed:', error);
            throw new Error('Failed to upload logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    const onSubmit = async (data: ProjectFormData) => {
        setLoading(true);
        setError(null);

        try {
            let logoUrl = null;

            // Upload logo if provided
            if (logoFile) {
                logoUrl = await uploadLogo();
            }

            // Create project document in Appwrite
            const projectData = {
                name: data.name,
                ticker: data.ticker.startsWith('$') ? data.ticker : `$${data.ticker}`,
                description: data.description,
                website: data.website,
                github: data.github || null,
                twitter: data.twitter.startsWith('@') ? data.twitter : `@${data.twitter}`,
                category: data.category,
                status: 'pending', // Default status for new submissions
                launchDate: data.launchDate ? new Date(data.launchDate).toISOString() : null,
                teamMembers: data.teamMembers ? data.teamMembers.split('\n').filter(member => member.trim() !== '') : [],
                whitepaper: data.whitepaper || null,
                requestTwitterSpace: data.requestTwitterSpace === 'true',
                logoUrl: logoUrl,
                totalStaked: 0,
                believers: 0,
                reviews: 0,
                bobScore: 0,
                estimatedReturn: 0,
                simulatedInvestment: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const response = await databases.createDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                ID.unique(),
                projectData
            );

            console.log('Project created successfully:', response);
            setSubmitted(true);
            reset();
            setLogoFile(null);
            setLogoPreview(null);

        } catch (error: any) {
            console.error('Error submitting project:', error);
            setError(error.message || 'Failed to submit project. Please try again.');
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
                    onClick={() => {
                        setSubmitted(false);
                        setError(null);
                    }}
                >
                    Submit Another Project
                </Button>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    {/* Logo Upload Section */}
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" gutterBottom>
                            Project Logo
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar
                                src={logoPreview || undefined}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: 'primary.main',
                                    color: 'black',
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                }}
                            >
                                {!logoPreview && '📷'}
                            </Avatar>
                            <Box>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="logo-upload"
                                    type="file"
                                    onChange={handleLogoChange}
                                    disabled={uploadingLogo}
                                />
                                <label htmlFor="logo-upload">
                                    <IconButton
                                        color="primary"
                                        component="span"
                                        disabled={uploadingLogo}
                                    >
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                {logoFile && (
                                    <IconButton
                                        color="error"
                                        onClick={removeLogo}
                                        disabled={uploadingLogo}
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                                {uploadingLogo && <CircularProgress size={24} />}
                            </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Upload a logo for your project (optional). Max file size: 5MB
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Project Name"
                            placeholder="e.g. VaderAI"
                            {...register('name', { required: 'Project name is required' })}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Token Ticker"
                            placeholder="VADER (without $)"
                            {...register('ticker', { required: 'Token ticker is required' })}
                            error={!!errors.ticker}
                            helperText={errors.ticker?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
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

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Project Twitter Handle"
                            placeholder="yourproject (without @)"
                            {...register('twitter', { required: 'Twitter handle is required' })}
                            error={!!errors.twitter}
                            helperText={errors.twitter?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Website URL"
                            placeholder="https://yourproject.xyz"
                            {...register('website', { required: 'Website URL is required' })}
                            error={!!errors.website}
                            helperText={errors.website?.message}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="GitHub / Code Repo (optional)"
                            placeholder="https://github.com/project"
                            {...register('github')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
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
                            label="Planned Launch Date (optional)"
                            InputLabelProps={{ shrink: true }}
                            {...register('launchDate')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel>Request Twitter Space for Launch?</InputLabel>
                            <Select
                                label="Request Twitter Space for Launch?"
                                defaultValue=""
                                {...register('requestTwitterSpace')}
                            >
                                <MenuItem value="true">Yes - Please Coordinate</MenuItem>
                                <MenuItem value="false">No - We'll handle it</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Team Members (optional)"
                            placeholder="Enter one team member per line:&#10;Jane Doe - CEO - https://twitter.com/janedoe&#10;John Smith - CTO - https://linkedin.com/in/johnsmith"
                            {...register('teamMembers')}
                            helperText="Enter each team member on a new line with their role and social links"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Whitepaper / Litepaper Link (optional)"
                            placeholder="https://docs.yourproject.xyz"
                            {...register('whitepaper')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            ✅ Project Readiness Checklist
                        </Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Complete these items to improve your project's review score and visibility
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

                    <Grid size={{ xs: 12 }}>
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
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} />
                                    Submitting for Curation...
                                </Box>
                            ) : (
                                '🚀 Submit Project'
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}