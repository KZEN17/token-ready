'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';

interface LogoProps {
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    width?: number;
    height?: number;
    clickable?: boolean;
    showText?: boolean;
    variant?: 'image' | 'text' | 'both';
}

const sizeConfig = {
    small: { width: 120, height: 20, fontSize: '1rem' },
    medium: { width: 200, height: 33, fontSize: '1.5rem' },
    large: { width: 300, height: 50, fontSize: '1.75rem' },
    xlarge: { width: 400, height: 67, fontSize: '2rem' },
};

export default function Logo({
    size = 'large',
    width,
    height,
    clickable = true,
    showText = false,
    variant = 'image'
}: LogoProps) {
    const config = sizeConfig[size];
    const finalWidth = width || config.width;
    const finalHeight = height || config.height;

    const LogoContent = () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {(variant === 'image' || variant === 'both') && (
                <Image
                    src="/logo.svg"
                    alt="TokenReady Logo"
                    width={finalWidth}
                    height={finalHeight}
                    priority
                    style={{
                        width: 'auto',
                        height: finalHeight,
                        maxWidth: finalWidth,
                    }}
                />
            )}

            {(variant === 'text' || variant === 'both' || showText) && (
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        fontWeight: 800,
                        fontSize: config.fontSize,
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px',
                        lineHeight: 1,
                    }}
                >
                    TokenReady
                </Typography>
            )}
        </Box>
    );

    if (!clickable) {
        return <LogoContent />;
    }

    return (
        <Link
            href="/"
            style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
            }}
        >
            <LogoContent />
        </Link>
    );
}