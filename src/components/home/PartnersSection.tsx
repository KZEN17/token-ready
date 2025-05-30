'use client';

import {
    Box,
    Typography,
    Grid,
    Card,
    Container,
    Avatar,
} from '@mui/material';

export default function PartnersSection() {
    // Mock partner data - you can replace with actual logos
    const partners = [
        { name: 'Binance Labs', category: 'Accelerator' },
        { name: 'Coinbase Ventures', category: 'VC' },
        { name: 'a16z crypto', category: 'VC' },
        { name: 'Paradigm', category: 'VC' },
        { name: 'Sequoia Capital', category: 'VC' },
        { name: 'Multicoin Capital', category: 'VC' },
        { name: 'Pantera Capital', category: 'VC' },
        { name: 'Framework Ventures', category: 'VC' },
        { name: 'Delphi Digital', category: 'Research' },
        { name: 'Messari', category: 'Research' },
        { name: 'The Block', category: 'Media' },
        { name: 'CoinDesk', category: 'Media' }
    ];

    const getPartnerColor = (category: string) => {
        switch (category) {
            case 'VC': return '#00ff88';
            case 'Accelerator': return '#ff6b6b';
            case 'Research': return '#ffa726';
            case 'Media': return '#ab47bc';
            default: return '#26c6da';
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography
                variant="h2"
                sx={{
                    textAlign: 'center',
                    mb: 6,
                    background: 'linear-gradient(135deg, #ffffff 0%, #00ff88 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                🤝 Our Partners
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'center', mb: 8, maxWidth: '600px', mx: 'auto' }}
            >
                We work with the best in the industry to provide our community with access to top-tier projects and investment opportunities.
            </Typography>

            <Grid container spacing={3}>
                {partners.map((partner, index) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={index}>
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(0, 255, 136, 0.1)',
                                transition: 'all 0.3s ease',
                                height: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 2,
                                '&:hover': {
                                    border: `1px solid ${getPartnerColor(partner.category)}`,
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 8px 32px ${getPartnerColor(partner.category)}20`,
                                },
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundColor: getPartnerColor(partner.category),
                                    color: 'black',
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    mb: 1,
                                }}
                            >
                                {partner.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600} sx={{ textAlign: 'center', mb: 0.5 }}>
                                {partner.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                                {partner.category}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Partner Categories */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Partner Categories
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                    {['VC', 'Accelerator', 'Research', 'Media'].map((category) => (
                        <Box
                            key={category}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${getPartnerColor(category)}`,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: getPartnerColor(category),
                                }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                {category}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}