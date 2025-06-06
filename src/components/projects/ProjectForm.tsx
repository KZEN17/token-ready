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
    alpha,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PhotoCamera, Delete, Add, Remove } from '@mui/icons-material';
import { storage, databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '../../lib/appwrite';
import { ID } from 'appwrite';

interface ProjectFormData {
    name: string;
    ticker: string;
    twitter: string;
    website: string;
    github: string;
    pitch: string;
    description: string;
    launchDate: string;
    requestTwitterSpace: string;
    whitepaper: string;
    category: string;
}

// Simplified logo validation function - only file type and minimum size
const validateLogoFile = (file: File): Promise<{ isValid: boolean; error?: string }> => {
    return new Promise((resolve) => {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            resolve({
                isValid: false,
                error: 'Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)'
            });
            return;
        }

        // For SVG files, skip dimension check
        if (file.type === 'image/svg+xml') {
            resolve({ isValid: true });
            return;
        }

        // Only check minimum dimensions for raster images
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl); // Clean up memory

            const minWidth = 64;
            const minHeight = 64;

            if (img.width < minWidth || img.height < minHeight) {
                resolve({
                    isValid: false,
                    error: `Image dimensions too small. Minimum: ${minWidth}x${minHeight}px, Current: ${img.width}x${img.height}px`
                });
            } else {
                resolve({ isValid: true });
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl); // Clean up memory
            resolve({
                isValid: false,
                error: 'Invalid image file or corrupted image'
            });
        };

        img.src = objectUrl;
    });
};

export default function ProjectForm() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [pitchLength, setPitchLength] = useState(0);
    const [descriptionLength, setDescriptionLength] = useState(0);
    const [teamMembers, setTeamMembers] = useState<string[]>(['']);

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ProjectFormData>();

    // Watch pitch and description fields for character counting
    const pitchValue = watch('pitch', '');
    const descriptionValue = watch('description', '');

    // Update character counts when fields change
    useState(() => {
        setPitchLength(pitchValue?.length || 0);
    });

    useState(() => {
        setDescriptionLength(descriptionValue?.length || 0);
    });

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

    // Simplified handleLogoChange function
    const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploadingLogo(true);

        try {
            // Validate file
            const validation = await validateLogoFile(file);

            if (!validation.isValid) {
                setError(validation.error!);
                setUploadingLogo(false);
                // Clear the input
                event.target.value = '';
                return;
            }

            // If validation passes, set the file and preview
            setLogoFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
                setUploadingLogo(false);
            };
            reader.onerror = () => {
                setError('Failed to read the image file');
                setUploadingLogo(false);
            };
            reader.readAsDataURL(file);

        } catch (error) {
            setError('Failed to validate the image file');
            setUploadingLogo(false);
            event.target.value = '';
        }
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
    };

    const addTeamMember = () => {
        setTeamMembers(prev => [...prev, '']);
    };

    const removeTeamMember = (index: number) => {
        if (teamMembers.length > 1) {
            setTeamMembers(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateTeamMember = (index: number, value: string) => {
        setTeamMembers(prev => prev.map((member, i) => i === index ? value : member));
    };

    const uploadLogo = async (): Promise<string | null> => {
        if (!logoFile) return null;

        try {
            setUploadingLogo(true);

            const bucketId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'project-logos';
            const response = await storage.createFile(
                bucketId,
                ID.unique(),
                logoFile
            );

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
            // Validate character limits
            if (data.pitch && data.pitch.length > 2000) {
                throw new Error('Pitch must be 2000 characters or less');
            }
            if (data.description && data.description.length > 25000) {
                throw new Error('Description must be 25000 characters or less');
            }

            // Validate team members
            const validTeamMembers = teamMembers.filter(member => member.trim() !== '');
            if (validTeamMembers.length === 0) {
                throw new Error('At least one team member is required');
            }

            let logoUrl = null;

            if (logoFile) {
                logoUrl = await uploadLogo();
            }

            const projectData = {
                name: data.name,
                ticker: data.ticker.startsWith('$') ? data.ticker : `$${data.ticker}`,
                pitch: data.pitch,
                description: data.description,
                website: data.website,
                github: data.github,
                twitter: data.twitter.startsWith('@') ? data.twitter : `@${data.twitter}`,
                category: data.category,
                status: 'pending',
                launchDate: new Date(data.launchDate).toISOString(),
                teamMembers: validTeamMembers, // Send as array
                whitepaper: data.whitepaper,
                requestTwitterSpace: data.requestTwitterSpace === 'true',
                logoUrl: logoUrl,
                totalStaked: 0,
                believers: 0,
                reviews: 0,
                bobScore: 0,
                estimatedReturn: 0,
                simulatedInvestment: 0,
                upvotes: [],
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
            setTeamMembers(['']);
            setPitchLength(0);
            setDescriptionLength(0);

        } catch (error: any) {
            console.error('Error submitting project:', error);
            setError(error.message || 'Failed to submit project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4
            }}>
                <Paper sx={{
                    p: 6,
                    textAlign: 'center',
                    maxWidth: 600,
                    background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)',
                    border: '1px solid #333',
                    borderRadius: 3,
                    color: 'white'
                }}>
                    <Typography variant="h4" sx={{ color: '#FFD700', mb: 3, fontWeight: 'bold' }}>
                        🎉 Project Submitted Successfully!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#B0B0B0', mb: 4, lineHeight: 1.6 }}>
                        Your project has been submitted for community review. Our team will reach out within 24-48 hours with next steps.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            setSubmitted(false);
                            setError(null);
                            setTeamMembers(['']);
                        }}
                        sx={{
                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            color: '#000',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                            }
                        }}
                    >
                        Submit Another Project
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            py: 4
        }}>
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
                <Paper sx={{
                    p: 4,
                    border: '1px solid #333',
                    borderRadius: 3,
                    color: 'white'
                }}>
                    {error && (
                        <Alert severity="error" sx={{
                            mb: 3,
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            color: '#F44336',
                            border: '1px solid #F44336'
                        }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            {/* Logo Upload Section - Simplified Validation */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" sx={{ color: '#FFD700', mb: 2, fontWeight: 'bold' }}>
                                    Project Logo
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar
                                        src={logoPreview || undefined}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                            color: '#000',
                                            fontSize: '2rem',
                                            fontWeight: 700,
                                            border: '2px solid #333'
                                        }}
                                    >
                                        {!logoPreview && '📷'}
                                    </Avatar>
                                    <Box>
                                        <input
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                                            style={{ display: 'none' }}
                                            id="logo-upload"
                                            type="file"
                                            onChange={handleLogoChange}
                                            disabled={uploadingLogo}
                                        />
                                        <label htmlFor="logo-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                disabled={uploadingLogo}
                                                startIcon={uploadingLogo ? <CircularProgress size={16} /> : <PhotoCamera />}
                                                sx={{
                                                    borderColor: '#FFD700',
                                                    color: '#FFD700',
                                                    '&:hover': {
                                                        backgroundColor: alpha('#FFD700', 0.1),
                                                        borderColor: '#FFD700'
                                                    }
                                                }}
                                            >
                                                {uploadingLogo ? 'Processing...' : 'Choose Logo'}
                                            </Button>
                                        </label>
                                        {logoFile && !uploadingLogo && (
                                            <IconButton
                                                sx={{ color: '#F44336', ml: 1 }}
                                                onClick={removeLogo}
                                                disabled={uploadingLogo}
                                            >
                                                <Delete />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                                        Upload a logo for your project (optional)
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                        • Supported formats: JPEG, PNG, GIF, WebP, SVG
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                        • Minimum dimensions: 64x64px (for raster images)
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                        • Square aspect ratio recommended
                                    </Typography>
                                </Box>
                                {logoFile && (
                                    <Alert severity="success" sx={{
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                        color: '#4CAF50',
                                        border: '1px solid #4CAF50'
                                    }}>
                                        Logo ready: {logoFile.name} ({(logoFile.size / 1024).toFixed(1)} KB)
                                    </Alert>
                                )}
                            </Grid>

                            {/* Project Name */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Project Name *"
                                    placeholder="e.g. VaderAI"
                                    {...register('name', { required: 'Project name is required' })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#FFD700' },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            {/* Ticker and Category Row */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Token Ticker *"
                                    placeholder="VADER (without $)"
                                    {...register('ticker', { required: 'Token ticker is required' })}
                                    error={!!errors.ticker}
                                    helperText={errors.ticker?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#FFD700' },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth error={!!errors.category}>
                                    <InputLabel sx={{ color: '#FFD700' }}>Category *</InputLabel>
                                    <Select
                                        label="Category *"
                                        {...register('category', { required: 'Category is required' })}
                                        defaultValue=""
                                        sx={{
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                            color: 'white',
                                        }}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Social Links Row */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Project Twitter Handle *"
                                    placeholder="yourproject (without @)"
                                    {...register('twitter', { required: 'Twitter handle is required' })}
                                    error={!!errors.twitter}
                                    helperText={errors.twitter?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#FFD700' },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Website URL *"
                                    placeholder="https://yourproject.xyz"
                                    {...register('website', { required: 'Website URL is required' })}
                                    error={!!errors.website}
                                    helperText={errors.website?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#FFD700' },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            {/* GitHub */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="GitHub / Code Repository *"
                                    placeholder="https://github.com/project"
                                    {...register('github', { required: 'GitHub repository is required' })}
                                    error={!!errors.github}
                                    helperText={errors.github?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#FFD700' },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            {/* Pitch */}
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography component="label" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                        Brief Project Pitch *
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: pitchLength > 2000 ? '#F44336' : pitchLength > 1800 ? '#FF9800' : '#888',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {pitchLength}/2000
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="One-liner pitch and value prop..."
                                    {...register('pitch', {
                                        required: 'Pitch is required',
                                        maxLength: { value: 2000, message: 'Pitch must be 2000 characters or less' }
                                    })}
                                    error={!!errors.pitch || pitchLength > 2000}
                                    helperText={errors.pitch?.message || (pitchLength > 2000 ? 'Pitch is too long' : '')}
                                    onChange={(e) => {
                                        setPitchLength(e.target.value.length);
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: pitchLength > 2000 ? '#F44336' : '#333' },
                                            '&:hover fieldset': { borderColor: pitchLength > 2000 ? '#F44336' : '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: pitchLength > 2000 ? '#F44336' : '#FFD700' },
                                        },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            {/* Description */}
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography component="label" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                        Detailed Project Description *
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: descriptionLength > 25000 ? '#F44336' : descriptionLength > 22000 ? '#FF9800' : '#888',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {descriptionLength}/25000
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={8}
                                    placeholder="Detailed explanation of your project, technology, roadmap, and team..."
                                    {...register('description', {
                                        required: 'Description is required',
                                        maxLength: { value: 25000, message: 'Description must be 25000 characters or less' }
                                    })}
                                    error={!!errors.description || descriptionLength > 25000}
                                    helperText={errors.description?.message || (descriptionLength > 25000 ? 'Description is too long' : '')}
                                    onChange={(e) => {
                                        setDescriptionLength(e.target.value.length);
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: descriptionLength > 25000 ? '#F44336' : '#333' },
                                            '&:hover fieldset': { borderColor: descriptionLength > 25000 ? '#F44336' : '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: descriptionLength > 25000 ? '#F44336' : '#FFD700' },
                                        },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            {/* Team Members */}
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                                        Team Members *
                                    </Typography>
                                    <IconButton
                                        onClick={addTeamMember}
                                        sx={{
                                            color: '#00E676',
                                            backgroundColor: alpha('#00E676', 0.1),
                                            '&:hover': {
                                                backgroundColor: alpha('#00E676', 0.2),
                                            }
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                </Box>
                                {teamMembers.map((member, index) => (
                                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Jane Doe - CEO - https://twitter.com/janedoe"
                                            value={member}
                                            onChange={(e) => updateTeamMember(index, e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                                    '& fieldset': { borderColor: '#333' },
                                                    '&:hover fieldset': { borderColor: '#FFD700' },
                                                    '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                                },
                                                '& .MuiOutlinedInput-input': { color: 'white' },
                                            }}
                                        />
                                        {teamMembers.length > 1 && (
                                            <IconButton
                                                onClick={() => removeTeamMember(index)}
                                                sx={{
                                                    color: '#F44336',
                                                    backgroundColor: alpha('#F44336', 0.1),
                                                    '&:hover': {
                                                        backgroundColor: alpha('#F44336', 0.2),
                                                    }
                                                }}
                                            >
                                                <Remove />
                                            </IconButton>
                                        )}
                                    </Box>
                                ))}
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    Add team members with their role and social links
                                </Typography>
                            </Grid>

                            {/* Launch Date and Twitter Space */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Planned Launch Date *"
                                    InputLabelProps={{ shrink: true }}
                                    {...register('launchDate', { required: 'Launch date is required' })}
                                    error={!!errors.launchDate}
                                    helperText={errors.launchDate?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#FFD700' },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth error={!!errors.requestTwitterSpace}>
                                    <InputLabel sx={{ color: '#FFD700' }}>Request Twitter Space for Launch? *</InputLabel>
                                    <Select
                                        label="Request Twitter Space for Launch? *"
                                        defaultValue=""
                                        {...register('requestTwitterSpace', { required: 'Twitter Space preference is required' })}
                                        sx={{
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                            color: 'white',
                                        }}
                                    >
                                        <MenuItem value="true">Yes - Please Coordinate</MenuItem>
                                        <MenuItem value="false">No - We'll handle it</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Whitepaper */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Whitepaper / Litepaper Link *"
                                    placeholder="https://docs.yourproject.xyz"
                                    {...register('whitepaper', { required: 'Whitepaper link is required' })}
                                    error={!!errors.whitepaper}
                                    helperText={errors.whitepaper?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255, 215, 0, 0.05)',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: '#FFD700' },
                                            '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#FFD700' },
                                        '& .MuiOutlinedInput-input': { color: 'white' },
                                    }}
                                />
                            </Grid>

                            {/* Checklist */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#FFD700', fontWeight: 'bold' }}>
                                    ✅ Project Readiness Checklist
                                </Typography>
                                <Alert severity="info" sx={{
                                    mb: 2,
                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                    color: '#2196F3',
                                    border: '1px solid #2196F3'
                                }}>
                                    Complete these items to improve your project's review score and visibility
                                </Alert>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {checklistItems.map((item, index) => (
                                        <FormControlLabel
                                            key={index}
                                            control={<Checkbox sx={{ color: '#FFD700' }} />}
                                            label={item}
                                            sx={{ color: '#B0B0B0' }}
                                        />
                                    ))}
                                </Box>
                            </Grid>

                            {/* Submit Button */}
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading || pitchLength > 2000 || descriptionLength > 25000}
                                    sx={{
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                                        color: '#000',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #FFA500, #FF8C00)',
                                        },
                                        '&:disabled': {
                                            background: '#555',
                                            color: '#888',
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={20} sx={{ color: '#FFD700' }} />
                                            Submitting for Curation...
                                        </Box>
                                    ) : (
                                        '🚀 Submit Project'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}