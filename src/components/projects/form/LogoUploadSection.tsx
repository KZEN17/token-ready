// src/components/projects/form/LogoUploadSection.tsx
'use client';

import {
    Box,
    Typography,
    Button,
    Avatar,
    IconButton,
    Alert,
    CircularProgress,
    alpha,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useState } from 'react';

interface LogoUploadSectionProps {
    logoFile: File | null;
    logoPreview: string | null;
    uploadingLogo: boolean;
    onLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveLogo: () => void;
}

export default function LogoUploadSection({
    logoFile,
    logoPreview,
    uploadingLogo,
    onLogoChange,
    onRemoveLogo,
}: LogoUploadSectionProps) {
    return (
        <Box>
            <Typography variant="h6" sx={{
                color: 'primary.main',
                mb: 2,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                📷 Project Logo
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Avatar
                    src={logoPreview || undefined}
                    sx={{
                        width: 80,
                        height: 80,
                        background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        color: (theme) => theme.palette.primary.contrastText,
                        fontSize: '2rem',
                        fontWeight: 700,
                        border: (theme) => `3px solid ${theme.palette.background.paper}`,
                        boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
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
                        onChange={onLogoChange}
                        disabled={uploadingLogo}
                    />
                    <label htmlFor="logo-upload">
                        <Button
                            variant="outlined"
                            component="span"
                            disabled={uploadingLogo}
                            startIcon={uploadingLogo ? <CircularProgress size={16} /> : <PhotoCamera />}
                            sx={{
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            {uploadingLogo ? 'Processing...' : 'Choose Logo'}
                        </Button>
                    </label>
                    {logoFile && !uploadingLogo && (
                        <IconButton
                            sx={{
                                color: 'secondary.main',
                                ml: 1,
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                                    transform: 'scale(1.1)',
                                }
                            }}
                            onClick={onRemoveLogo}
                            disabled={uploadingLogo}
                        >
                            <Delete />
                        </IconButton>
                    )}
                </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Upload a logo for your project (optional)
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    • Supported formats: JPEG, PNG, GIF, WebP, SVG
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    • Minimum dimensions: 64x64px (for raster images)
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    • Square aspect ratio recommended
                </Typography>
            </Box>

            {logoFile && (
                <Alert
                    severity="success"
                    sx={{
                        backgroundColor: (theme) => alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                        border: (theme) => `1px solid ${theme.palette.success.main}`,
                        borderRadius: 2,
                    }}
                >
                    Logo ready: {logoFile.name} ({(logoFile.size / 1024).toFixed(1)} KB)
                </Alert>
            )}
        </Box>
    );
}
