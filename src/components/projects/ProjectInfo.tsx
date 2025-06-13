'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
} from '@mui/material';

interface Project {
    name: string;
    description: string;
    teamMembers?: string[];
    launchDate?: string;
    createdAt: string;
}

interface ProjectInfoProps {
    project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
    return (
        <Card sx={{
            background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: '#00ff88', mb: 3, fontWeight: 'bold' }}>
                    About {project.name}
                </Typography>
                <Typography variant="body1" sx={{
                    mb: 4,
                    lineHeight: 1.7,
                    color: '#b0b0b0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}>
                    {project.description}
                </Typography>

                {/* Team Members Section */}
                {project.teamMembers && project.teamMembers.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, fontWeight: 'bold' }}>
                            👥 Team ({project.teamMembers.length} members)
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {project.teamMembers.map((member, index) => {
                                // Parse team member string (format: "Name - Role - Social")
                                const parts = member.split(' - ');
                                const name = parts[0] || member;
                                const role = parts[1] || '';
                                const social = parts[2] || '';

                                return (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{
                                            backgroundColor: '#00ff88',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            width: 48,
                                            height: 48,
                                        }}>
                                            {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                {name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                                {role && `${role} • `}{social}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                )}

                {project.launchDate && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ color: '#00ff88', mb: 1 }}>
                            📅 Launch Date
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
                            {new Date(project.launchDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        Project submitted on {new Date(project.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}