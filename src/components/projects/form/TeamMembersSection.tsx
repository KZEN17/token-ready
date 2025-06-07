// src/components/projects/form/TeamMembersSection.tsx
'use client';

import {
    Box,
    Typography,
    TextField,
    IconButton,
    alpha,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface TeamMembersSectionProps {
    teamMembers: string[];
    onAddMember: () => void;
    onRemoveMember: (index: number) => void;
    onUpdateMember: (index: number, value: string) => void;
}

export default function TeamMembersSection({
    teamMembers,
    onAddMember,
    onRemoveMember,
    onUpdateMember,
}: TeamMembersSectionProps) {
    return (
        <Box>
            <Box sx={{
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6" sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    👥 Team Members *
                </Typography>
                <IconButton
                    onClick={onAddMember}
                    sx={{
                        color: 'success.main',
                        backgroundColor: (theme) => alpha(theme.palette.success.main, 0.1),
                        border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                        '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.success.main, 0.2),
                            transform: 'scale(1.1)',
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
                        onChange={(e) => onUpdateMember(index, e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
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
                            },
                            '& .MuiOutlinedInput-input': { color: 'text.primary' },
                        }}
                    />
                    {teamMembers.length > 1 && (
                        <IconButton
                            onClick={() => onRemoveMember(index)}
                            sx={{
                                color: 'secondary.main',
                                backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                                border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                                '&:hover': {
                                    backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.2),
                                    transform: 'scale(1.1)',
                                }
                            }}
                        >
                            <Remove />
                        </IconButton>
                    )}
                </Box>
            ))}

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Add team members with their role and social links
            </Typography>
        </Box>
    );
}
