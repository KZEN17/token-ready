// src/components/admin/ProjectReviewAdmin.tsx
'use client';

import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    TextField,
    Alert,
    CircularProgress,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    alpha,
    Avatar,
} from '@mui/material';
import {
    CheckCircle,
    Cancel,
    Visibility,
    Schedule,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useUser } from '@/hooks/useUser';

interface PendingProject {
    $id: string;
    name: string;
    ticker: string;
    pitch: string;
    description: string;
    category: string;
    website: string;
    github: string;
    twitter: string;
    logoUrl?: string;
    createdBy: string;
    createdAt: string;
    adminReviewStatus: string;
    teamMembers: string[];
    platform: string;
    chain: string;
}

export default function ProjectReviewAdmin() {
    const { user, authenticated } = useUser();
    const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<PendingProject | null>(null);
    const [reviewDialog, setReviewDialog] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');

    useEffect(() => {
        loadPendingProjects();
    }, []);

    const loadPendingProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                [
                    Query.equal('adminReviewStatus', 'pending'),
                    Query.orderDesc('createdAt'),
                    Query.limit(50)
                ]
            );

            setPendingProjects(response.documents as unknown as PendingProject[]);
        } catch (err) {
            console.error('Failed to load pending projects:', err);
            setError('Failed to load pending projects');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewProject = (project: PendingProject, action: 'approve' | 'reject') => {
        setSelectedProject(project);
        setReviewDialog(true);
        setReviewNotes('');
    };

    const submitReview = async (action: 'approve' | 'reject') => {
        if (!selectedProject || !user) return;

        setProcessing(selectedProject.$id);
        try {
            const response = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    projectId: selectedProject.$id,
                    reviewNotes,
                    reviewedBy: user.$id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Review failed');
            }

            const result = await response.json();

            setReviewDialog(false);
            setSelectedProject(null);
            setReviewNotes('');

            // Refresh the list
            await loadPendingProjects();

            console.log(`Project ${action}ed successfully:`, result);
        } catch (err: any) {
            console.error(`Failed to ${action} project:`, err);
            setError(err.message || `Failed to ${action} project`);
        } finally {
            setProcessing(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={40} sx={{ color: '#00ff88' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 4, color: '#00ff88', fontWeight: 'bold' }}>
                📋 Project Review Queue ({pendingProjects.length})
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Card sx={{
                background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                border: '1px solid #333',
                borderRadius: 3,
            }}>
                <CardContent sx={{ p: 0 }}>
                    {pendingProjects.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Schedule sx={{ color: '#666', fontSize: '4rem', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                                No Pending Reviews
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888' }}>
                                All projects have been reviewed!
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: alpha('#00ff88', 0.1) }}>
                                        <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Project</TableCell>
                                        <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Category</TableCell>
                                        <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Platform</TableCell>
                                        <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Submitted</TableCell>
                                        <TableCell sx={{ color: '#00ff88', fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pendingProjects.map((project) => (
                                        <TableRow
                                            key={project.$id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: alpha('#00ff88', 0.05),
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        src={project.logoUrl || undefined}
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            backgroundColor: '#00ff88',
                                                            color: '#000',
                                                        }}
                                                    >
                                                        {project.name.charAt(0)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {project.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#00ff88' }}>
                                                            {project.ticker}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: '#888',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {project.pitch}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={project.category}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha('#ffa726', 0.2),
                                                        color: '#ffa726',
                                                        border: '1px solid #ffa726',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="column" spacing={0.5}>
                                                    <Chip
                                                        label={project.platform}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: alpha('#8b5cf6', 0.2),
                                                            color: '#8b5cf6',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                    <Chip
                                                        label={project.chain}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: alpha('#ff6b6b', 0.2),
                                                            color: '#ff6b6b',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: '#888' }}>
                                                    {formatDate(project.createdAt)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<Visibility />}
                                                        onClick={() => {
                                                            setSelectedProject(project);
                                                            setReviewDialog(true);
                                                        }}
                                                        sx={{
                                                            borderColor: '#00ff88',
                                                            color: '#00ff88',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    >
                                                        Review
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Review Dialog */}
            <Dialog
                open={reviewDialog}
                onClose={() => setReviewDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ color: '#00ff88' }}>
                    Review Project: {selectedProject?.name}
                </DialogTitle>
                <DialogContent>
                    {selectedProject && (
                        <Box sx={{ py: 2 }}>
                            {/* Header with Logo */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                                <Avatar
                                    src={selectedProject.logoUrl || undefined}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: '#00ff88',
                                        color: '#000',
                                        fontSize: '2rem',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {selectedProject.name.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" sx={{ color: '#00ff88', fontWeight: 'bold' }}>
                                        {selectedProject.name}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#4dffb0', mb: 1 }}>
                                        {selectedProject.ticker}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Chip label={selectedProject.category} size="small"
                                            sx={{ backgroundColor: alpha('#ffa726', 0.2), color: '#ffa726' }} />
                                        <Chip label={selectedProject.platform} size="small"
                                            sx={{ backgroundColor: alpha('#8b5cf6', 0.2), color: '#8b5cf6' }} />
                                        <Chip label={selectedProject.chain} size="small"
                                            sx={{ backgroundColor: alpha('#ff6b6b', 0.2), color: '#ff6b6b' }} />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Pitch */}
                            <Box sx={{ mb: 3, p: 2, backgroundColor: alpha('#00ff88', 0.05), borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: '#00ff88', fontWeight: 'bold', mb: 1 }}>
                                    💡 Project Pitch
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#b0b0b0', lineHeight: 1.6 }}>
                                    {selectedProject.pitch}
                                </Typography>
                            </Box>

                            {/* Description */}
                            <Box sx={{ mb: 3, p: 2, backgroundColor: alpha('#333', 0.3), borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: '#00ff88', fontWeight: 'bold', mb: 1 }}>
                                    📋 Detailed Description
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#888',
                                        lineHeight: 1.5,
                                        maxHeight: '150px',
                                        overflow: 'auto',
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {selectedProject.description}
                                </Typography>
                            </Box>

                            {/* Links */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ color: '#00ff88', fontWeight: 'bold', mb: 2 }}>
                                    🔗 Project Links
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#888', minWidth: '80px' }}>
                                            Website:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            component="a"
                                            href={selectedProject.website}
                                            target="_blank"
                                            sx={{ color: '#00ff88', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            {selectedProject.website}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#888', minWidth: '80px' }}>
                                            Twitter:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            component="a"
                                            href={`https://twitter.com/${selectedProject.twitter.replace('@', '')}`}
                                            target="_blank"
                                            sx={{ color: '#1DA1F2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            {selectedProject.twitter}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#888', minWidth: '80px' }}>
                                            GitHub:
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            component="a"
                                            href={selectedProject.github}
                                            target="_blank"
                                            sx={{ color: '#666', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            {selectedProject.github}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Team */}
                            {selectedProject.teamMembers && selectedProject.teamMembers.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" sx={{ color: '#00ff88', fontWeight: 'bold', mb: 2 }}>
                                        👥 Team Members ({selectedProject.teamMembers.length})
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {selectedProject.teamMembers.map((member, index) => {
                                            const parts = member.split(' - ');
                                            const name = parts[0] || member;
                                            const role = parts[1] || '';
                                            const social = parts[2] || '';

                                            return (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                                                    <Avatar sx={{
                                                        width: 32,
                                                        height: 32,
                                                        backgroundColor: '#00ff88',
                                                        color: '#000',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                                                            {name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#888' }}>
                                                            {role && `${role}${social ? ' • ' : ''}`}{social}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            )}

                            {/* Submission Info */}
                            <Box sx={{ mb: 3, p: 2, backgroundColor: alpha('#333', 0.2), borderRadius: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: '#00ff88', fontWeight: 'bold', mb: 1 }}>
                                    📊 Submission Details
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#888' }}>Submitted:</Typography>
                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                            {formatDate(selectedProject.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#888' }}>Creator ID:</Typography>
                                        <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace' }}>
                                            {selectedProject.createdBy.slice(-8)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Review Notes (optional)"
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Add any notes about your decision..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: alpha('#00ff88', 0.05),
                                        '& fieldset': { borderColor: '#333' },
                                        '&:hover fieldset': { borderColor: '#00ff88' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#888' },
                                    '& .MuiOutlinedInput-input': { color: 'white' },
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 2 }}>
                    <Button onClick={() => setReviewDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={processing === selectedProject?.$id ? <CircularProgress size={16} /> : <Cancel />}
                        onClick={() => submitReview('reject')}
                        disabled={processing === selectedProject?.$id}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={processing === selectedProject?.$id ? <CircularProgress size={16} /> : <CheckCircle />}
                        onClick={() => submitReview('approve')}
                        disabled={processing === selectedProject?.$id}
                        sx={{
                            background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                            color: '#000',
                            fontWeight: 'bold',
                        }}
                    >
                        Approve & Create VCA
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}