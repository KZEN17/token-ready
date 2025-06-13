// src/components/projects/ProjectForm.tsx - Updated with Launch Platform section
'use client';

import {
    Box,
    Paper,
    Grid,
    Alert,
    Typography,
    Container,
    alpha,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { storage, databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '../../lib/appwrite';
import { ID } from 'appwrite';
import LogoUploadSection from './form/LogoUploadSection';
import TeamMembersSection from './form/TeamMembersSection';
import FormTextField from './form/FormTextField';
import FormSelect from './form/FormSelect';
import ProjectChecklist from './form/ProjectChecklist';
import SubmitButton from './form/SubmitButton';
import LaunchPlatformSection from './form/PlatformChainSelector';

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
    // NEW FIELDS - not in form data since they're handled separately
}

// Simplified logo validation function
const validateLogoFile = (file: File): Promise<{ isValid: boolean; error?: string }> => {
    return new Promise((resolve) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            resolve({
                isValid: false,
                error: 'Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)'
            });
            return;
        }

        if (file.type === 'image/svg+xml') {
            resolve({ isValid: true });
            return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
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
            URL.revokeObjectURL(objectUrl);
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

    // NEW STATE for launch platforms and blockchains
    const [selectedPlatform, setSelectedPlatform] = useState<string>();
    const [selectedChain, setSelectedChain] = useState<string>();
    const [platformError, setPlatformError] = useState<string>('');
    const [chainError, setChainError] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<ProjectFormData>();

    const pitchValue = watch('pitch', '');
    const descriptionValue = watch('description', '');

    // Update character counts when values change
    useState(() => {
        setPitchLength(pitchValue?.length || 0);
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

    // NEW HANDLERS for launch platform selection
    const handlePlatformChange = (platform: string, checked: boolean) => {
        if (checked) {
            setSelectedPlatform(platform);
        } else {
            setSelectedPlatform(undefined);
        }
        setPlatformError(''); // Clear error when user makes selection
    };

    const handleChainChange = (chain: string, checked: boolean) => {
        if (checked) {
            setSelectedChain(chain);
        } else {
            setSelectedChain(undefined);
        }
        setChainError(''); // Clear error when user makes selection
    };

    const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploadingLogo(true);

        try {
            const validation = await validateLogoFile(file);

            if (!validation.isValid) {
                setError(validation.error!);
                setUploadingLogo(false);
                event.target.value = '';
                return;
            }

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
            const response = await storage.createFile(bucketId, ID.unique(), logoFile);
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
        setPlatformError('');
        setChainError('');

        try {
            // Validate new required fields
            if (selectedPlatform) {
                setPlatformError('Please select at least one launch platform');
                setLoading(false);
                return;
            }

            if (selectedChain) {
                setChainError('Please select at least one blockchain network');
                setLoading(false);
                return;
            }

            if (data.pitch && data.pitch.length > 2000) {
                throw new Error('Pitch must be 2000 characters or less');
            }
            if (data.description && data.description.length > 25000) {
                throw new Error('Description must be 25000 characters or less');
            }

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
                status: 'pending' as const,
                launchDate: new Date(data.launchDate).toISOString(),
                teamMembers: validTeamMembers,
                whitepaper: data.whitepaper,
                requestTwitterSpace: data.requestTwitterSpace === 'true',
                logoUrl: logoUrl,

                // NEW FIELDS for launch platforms and chains
                platform: selectedPlatform, // Array of selected platforms
                chain: selectedChain, // Array of selected chains

                // Existing fields
                totalStaked: 0,
                believers: 0,
                reviews: 0,
                bobScore: 0,
                estimatedReturn: 0,
                simulatedInvestment: 0,
                upvotes: [] as string[],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
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
            setSelectedPlatform(''); // Reset platform selection
            setSelectedChain(''); // Reset chain selection

        } catch (error: any) {
            console.error('Error submitting project:', error);
            setError(error.message || 'Failed to submit project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Paper sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.05)})`,
                    border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                }}>
                    <Typography variant="h3" sx={{
                        color: 'primary.main',
                        mb: 3,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}>
                        🎉 Project Submitted Successfully!
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'text.secondary',
                        mb: 4,
                        lineHeight: 1.6,
                        fontSize: '1.1rem'
                    }}>
                        Your project has been submitted for community review. Our team will reach out within 24-48 hours with next steps.
                    </Typography>
                    <SubmitButton
                        loading={false}
                        disabled={false}
                        onClick={() => {
                            setSubmitted(false);
                            setError(null);
                            setTeamMembers(['']);
                            setSelectedPlatform('');
                            setSelectedChain('');
                        }}
                    />
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`,
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}>
                {error && (
                    <Alert severity="error" sx={{
                        mb: 3,
                        borderRadius: 2,
                        backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
                        color: 'error.main',
                        border: (theme) => `1px solid ${theme.palette.error.main}`,
                        '& .MuiAlert-icon': {
                            color: 'error.main',
                        }
                    }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        {/* Logo Upload Section */}
                        <Grid size={{ xs: 12 }}>
                            <LogoUploadSection
                                logoFile={logoFile}
                                logoPreview={logoPreview}
                                uploadingLogo={uploadingLogo}
                                onLogoChange={handleLogoChange}
                                onRemoveLogo={removeLogo}
                            />
                        </Grid>

                        {/* Project Name */}
                        <Grid size={{ xs: 12 }}>
                            <FormTextField
                                label="🚀 Project Name"
                                placeholder="e.g. VaderAI"
                                required
                                register={register('name', { required: 'Project name is required' })}
                                error={errors.name?.message}
                            />
                        </Grid>

                        {/* Ticker and Category Row */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                                label="💰 Token Ticker"
                                placeholder="VADER (without $)"
                                required
                                register={register('ticker', { required: 'Token ticker is required' })}
                                error={errors.ticker?.message}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormSelect
                                label="🏷️ Category"
                                value={watch('category') || ''}
                                options={categories}
                                required
                                register={register('category', { required: 'Category is required' })}
                                error={errors.category?.message}
                                onChange={(value) => setValue('category', value)}
                            />
                        </Grid>

                        {/* NEW: Launch Platform & Blockchain Selection */}
                        <Grid size={{ xs: 12 }}>
                            <Grid size={{ xs: 12 }}>
                                <LaunchPlatformSection
                                    selectedPlatform={selectedPlatform!}
                                    selectedChain={selectedChain!}
                                    onPlatformChange={(platform) => handlePlatformChange(platform, !selectedPlatform)}
                                    onChainChange={(chain) => handleChainChange(chain, !selectedChain)}
                                    platformError={platformError}
                                    chainError={chainError}
                                />
                            </Grid>
                        </Grid>

                        {/* Social Links Row */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                                label="🐦 Project Twitter Handle"
                                placeholder="yourproject (without @)"
                                required
                                register={register('twitter', { required: 'Twitter handle is required' })}
                                error={errors.twitter?.message}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                                label="🌐 Website URL"
                                placeholder="https://yourproject.xyz"
                                required
                                register={register('website', { required: 'Website URL is required' })}
                                error={errors.website?.message}
                            />
                        </Grid>

                        {/* GitHub */}
                        <Grid size={{ xs: 12 }}>
                            <FormTextField
                                label="💻 GitHub / Code Repository"
                                placeholder="https://github.com/project"
                                required
                                register={register('github', { required: 'GitHub repository is required' })}
                                error={errors.github?.message}
                            />
                        </Grid>

                        {/* Pitch */}
                        <Grid size={{ xs: 12 }}>
                            <FormTextField
                                label="💡 Brief Project Pitch"
                                placeholder="One-liner pitch and value prop..."
                                multiline
                                rows={4}
                                required
                                register={register('pitch', {
                                    required: 'Pitch is required',
                                    maxLength: { value: 2000, message: 'Pitch must be 2000 characters or less' }
                                })}
                                error={errors.pitch?.message}
                                characterCount={{
                                    current: pitchLength,
                                    max: 2000
                                }}
                                onChange={(e) => {
                                    setPitchLength(e.target.value.length);
                                }}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid size={{ xs: 12 }}>
                            <FormTextField
                                label="📋 Detailed Project Description"
                                placeholder="Detailed explanation of your project, technology, roadmap, and team..."
                                multiline
                                rows={8}
                                required
                                register={register('description', {
                                    required: 'Description is required',
                                    maxLength: { value: 25000, message: 'Description must be 25000 characters or less' }
                                })}
                                error={errors.description?.message}
                                characterCount={{
                                    current: descriptionLength,
                                    max: 25000
                                }}
                                onChange={(e) => {
                                    setDescriptionLength(e.target.value.length);
                                }}
                            />
                        </Grid>

                        {/* Team Members */}
                        <Grid size={{ xs: 12 }}>
                            <TeamMembersSection
                                teamMembers={teamMembers}
                                onAddMember={addTeamMember}
                                onRemoveMember={removeTeamMember}
                                onUpdateMember={updateTeamMember}
                            />
                        </Grid>

                        {/* Launch Date and Twitter Space */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                                label="📅 Planned Launch Date & Time"
                                type="datetime-local"
                                required
                                register={register('launchDate', { required: 'Launch date and time is required' })}
                                error={errors.launchDate?.message}
                                helperText="Select your preferred launch date and time (local timezone)"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormSelect
                                label="🎤 Request Twitter Space for Launch?"
                                value={watch('requestTwitterSpace') || ''}
                                options={[
                                    { value: 'true', label: 'Yes - Please Coordinate' },
                                    { value: 'false', label: 'No - We\'ll handle it' }
                                ]}
                                required
                                register={register('requestTwitterSpace', { required: 'Twitter Space preference is required' })}
                                error={errors.requestTwitterSpace?.message}
                                onChange={(value) => setValue('requestTwitterSpace', value)}
                            />
                        </Grid>

                        {/* Whitepaper */}
                        <Grid size={{ xs: 12 }}>
                            <FormTextField
                                label="📄 Whitepaper / Litepaper Link"
                                placeholder="https://docs.yourproject.xyz"
                                required
                                register={register('whitepaper', { required: 'Whitepaper link is required' })}
                                error={errors.whitepaper?.message}
                            />
                        </Grid>

                        {/* Checklist */}
                        <Grid size={{ xs: 12 }}>
                            <ProjectChecklist checklistItems={checklistItems} />
                        </Grid>

                        {/* Submit Button */}
                        <Grid size={{ xs: 12 }}>
                            <SubmitButton
                                loading={loading}
                                disabled={pitchLength > 2000 || descriptionLength > 25000}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

