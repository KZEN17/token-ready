// src/app/admin/page.tsx - Updated with VCA Testing
'use client';

import ShareVerificationAdmin from '@/components/admin/ShareVerificationAdmin';
import SimpleVCATest from '@/components/vca/SimpleTest';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            color: 'white',
            py: 4
        }}>
            <Container maxWidth="xl">
                <Typography
                    variant="h2"
                    sx={{
                        mb: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #00ff88, #4dffb0)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 900
                    }}
                >
                    🛠️ TokenReady Admin Panel
                </Typography>

                {/* Add Tabs for different admin sections */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                color: '#888',
                                fontWeight: 'bold',
                                '&.Mui-selected': {
                                    color: '#00ff88',
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#00ff88',
                            }
                        }}
                    >
                        <Tab label="Share Verification" />
                        <Tab label="VCA Testing" />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                {activeTab === 0 && <ShareVerificationAdmin />}
                {activeTab === 1 && <SimpleVCATest />}
            </Container>
        </Box>
    );
}