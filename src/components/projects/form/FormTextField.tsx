// src/components/projects/form/FormTextField.tsx
'use client';

import {
    TextField,
    Box,
    Typography,
    alpha,
} from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormTextFieldProps {
    label: string;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    required?: boolean;
    type?: string;
    error?: string;
    register?: UseFormRegisterReturn;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    characterCount?: {
        current: number;
        max: number;
    };
    helperText?: string;
    InputLabelProps?: any;
}

export default function FormTextField({
    label,
    placeholder,
    multiline = false,
    rows = 1,
    required = false,
    type = 'text',
    error,
    register,
    value,
    onChange,
    characterCount,
    helperText,
    InputLabelProps,
}: FormTextFieldProps) {
    const hasCharacterCount = characterCount !== undefined;
    const isOverLimit = hasCharacterCount && characterCount.current > characterCount.max;
    const isNearLimit = hasCharacterCount && characterCount.current > characterCount.max * 0.8;

    return (
        <Box>
            {hasCharacterCount && (
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography component="label" sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                    }}>
                        {label}
                        {required && <span style={{ color: '#ff6b6b' }}>*</span>}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: isOverLimit ? 'error.main' : isNearLimit ? 'warning.main' : 'text.secondary',
                            fontWeight: 'bold'
                        }}
                    >
                        {characterCount.current}/{characterCount.max}
                    </Typography>
                </Box>
            )}

            <TextField
                fullWidth
                label={!hasCharacterCount ? label + (required ? ' *' : '') : undefined}
                placeholder={placeholder}
                multiline={multiline}
                rows={rows}
                type={type}
                value={value}
                onChange={onChange}
                error={!!error || isOverLimit}
                helperText={error || (isOverLimit ? 'Text is too long' : helperText)}
                InputLabelProps={InputLabelProps}
                {...register}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                        '& fieldset': {
                            borderColor: isOverLimit ? 'error.main' : (theme) => alpha(theme.palette.text.secondary, 0.3)
                        },
                        '&:hover fieldset': {
                            borderColor: isOverLimit ? 'error.main' : 'primary.main'
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: isOverLimit ? 'error.main' : 'primary.main',
                            boxShadow: (theme) => `0 0 0 2px ${alpha(
                                isOverLimit ? theme.palette.error.main : theme.palette.primary.main,
                                0.2
                            )}`,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'primary.main',
                        fontWeight: 600,
                    },
                    '& .MuiOutlinedInput-input': { color: 'text.primary' },
                }}
            />
        </Box>
    );
}