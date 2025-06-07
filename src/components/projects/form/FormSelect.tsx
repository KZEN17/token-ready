// src/components/projects/form/FormSelect.tsx
'use client';

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    alpha,
} from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormSelectProps {
    label: string;
    value: string;
    options: Array<{ value: string; label: string }> | string[];
    required?: boolean;
    error?: string;
    register?: UseFormRegisterReturn;
    onChange?: (value: string) => void;
}

export default function FormSelect({
    label,
    value,
    options,
    required = false,
    error,
    register,
    onChange,
}: FormSelectProps) {
    const normalizedOptions = Array.isArray(options) && typeof options[0] === 'string'
        ? (options as string[]).map(opt => ({ value: opt, label: opt }))
        : options as Array<{ value: string; label: string }>;

    return (
        <FormControl fullWidth error={!!error}>
            <InputLabel sx={{
                color: 'primary.main',
                fontWeight: 600,
            }}>
                {label}{required ? ' *' : ''}
            </InputLabel>
            <Select
                label={label + (required ? ' *' : '')}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                {...register}
                sx={{
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    '& fieldset': {
                        borderColor: (theme) => alpha(theme.palette.text.secondary, 0.3)
                    },
                    '&:hover fieldset': {
                        borderColor: 'primary.main'
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                    color: 'text.primary',
                }}
            >
                {normalizedOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
