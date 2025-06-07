// src/components/projects/form/ProjectChecklist.tsx
'use client';

import {
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
    Alert,
    alpha,
} from '@mui/material';

interface ProjectChecklistProps {
    checklistItems: string[];
}

export default function ProjectChecklist({ checklistItems }: ProjectChecklistProps) {
    return (
        <Box>
            <Typography variant="h6" sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                ✅ Project Readiness Checklist
            </Typography>

            <Alert
                severity="info"
                sx={{
                    mb: 2,
                    backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1),
                    color: 'info.main',
                    border: (theme) => `1px solid ${theme.palette.info.main}`,
                    borderRadius: 2,
                }}
            >
                Complete these items to improve your project's review score and visibility
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {checklistItems.map((item, index) => (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                sx={{
                                    color: 'primary.main',
                                    '&.Mui-checked': {
                                        color: 'primary.main',
                                    }
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {item}
                            </Typography>
                        }
                        sx={{
                            '&:hover': {
                                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                                borderRadius: 1,
                            }
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}