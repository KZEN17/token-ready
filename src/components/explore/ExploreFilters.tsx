'use client';

import {
    Box,
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    Typography,
    alpha,
} from '@mui/material';
import { Search } from '@mui/icons-material';

interface ExploreFiltersProps {
    searchTerm: string;
    selectedCategory: string;
    sortBy: string;
    resultCount: number;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSortChange: (value: string) => void;
}

const categories = [
    'All Categories',
    'AI & Tools',
    'DeFi',
    'GameFi',
    'Meme & Culture',
    'Social & Media',
    'Infrastructure',
    'NFT & Metaverse',
];

const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'verified', label: 'Verified Projects' }, // Add this
    { value: 'pending', label: 'Under Review' }, // Add this
    { value: 'bobScore', label: 'Highest BOB Score' },
    { value: 'believers', label: 'Most Believers' },
    { value: 'totalStaked', label: 'Most Staked' },
    { value: 'name', label: 'Alphabetical' },
];

export default function ExploreFilters({
    searchTerm,
    selectedCategory,
    sortBy,
    resultCount,
    onSearchChange,
    onCategoryChange,
    onSortChange,
}: ExploreFiltersProps) {
    return (
        <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                        fullWidth
                        placeholder="Search projects, tickers, descriptions..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: alpha('#00ff88', 0.05),
                                border: '1px solid #333',
                                borderRadius: 2,
                                '&:hover': {
                                    borderColor: '#00ff88',
                                },
                                '&.Mui-focused': {
                                    borderColor: '#00ff88',
                                    boxShadow: `0 0 0 2px ${alpha('#00ff88', 0.2)}`,
                                }
                            },
                            '& .MuiOutlinedInput-input': {
                                color: 'white',
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#00ff88' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            displayEmpty
                            sx={{
                                backgroundColor: alpha('#00ff88', 0.05),
                                border: '1px solid #333',
                                borderRadius: 2,
                                color: 'white',
                                '&:hover': {
                                    borderColor: '#00ff88',
                                },
                                '&.Mui-focused': {
                                    borderColor: '#00ff88',
                                }
                            }}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category === 'All Categories' ? '' : category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth>
                        <Select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            sx={{
                                backgroundColor: alpha('#00ff88', 0.05),
                                border: '1px solid #333',
                                borderRadius: 2,
                                color: 'white',
                                '&:hover': {
                                    borderColor: '#00ff88',
                                }
                            }}
                        >
                            {sortOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#00ff88',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            mt: 1.5
                        }}
                    >
                        {resultCount} found
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}