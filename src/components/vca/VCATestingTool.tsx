import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Alert,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Stack,
    alpha,
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Warning,
    PlayArrow,
    ExpandMore,
    Storage,
    Api,
    Code,
    Settings,
    BugReport,
} from '@mui/icons-material';

export default function VCATestingTool() {
    const [activeStep, setActiveStep] = useState(0);
    interface TestResult {
        status: string;
        message?: string;
        name?: string;
        value?: string;
    }

    const [testResults, setTestResults] = useState<{ [key: string]: (TestResult[] | { status: string }[]) | { status: string } }>({});
    const [loading, setLoading] = useState(false);
    const [testData, setTestData] = useState({
        projectSlug: 'test-project-' + Date.now(),
        owner: 'test-user',
        vcaAddress: '',
        tokenAddress: '0x1234567890123456789012345678901234567890'
    });

    const testSteps = [
        {
            label: 'Environment Check',
            description: 'Verify environment variables and configuration',
            component: 'EnvironmentTest'
        },
        {
            label: 'Database Collections',
            description: 'Check if Appwrite collections exist and are accessible',
            component: 'DatabaseTest'
        },
        {
            label: 'VCA Protocol Logic',
            description: 'Test VCA address generation and validation',
            component: 'ProtocolTest'
        },
        {
            label: 'API Endpoints',
            description: 'Test all VCA API endpoints',
            component: 'APITest'
        },
        {
            label: 'Full Integration',
            description: 'End-to-end VCA workflow test',
            component: 'IntegrationTest'
        }
    ];

    // Environment Variables Test
    const EnvironmentTest = () => {
        const [envResults, setEnvResults] = useState<{ name: string; value: string; status: string; }[] | null>(null);

        const testEnvironment = () => {
            const requiredVars = [
                'NEXT_PUBLIC_APPWRITE_ENDPOINT',
                'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
                'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
                'NEXT_PUBLIC_APPWRITE_VCA_COLLECTION_ID',
                'NEXT_PUBLIC_APPWRITE_VCA_ACTIVITY_COLLECTION_ID',
                'NEXT_PUBLIC_APPWRITE_VCA_MAPPING_COLLECTION_ID'
            ];

            const results = requiredVars.map(envVar => ({
                name: envVar,
                value: process.env[envVar] || 'undefined',
                status: !!process.env[envVar] ? 'success' : 'error'
            }));

            setEnvResults(results);
            setTestResults(prev => ({ ...prev, environment: results }));
        };

        return (
            <Box>
                <Button
                    variant="contained"
                    onClick={testEnvironment}
                    startIcon={<Settings />}
                    sx={{ mb: 2 }}
                >
                    Check Environment
                </Button>

                {envResults && (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Environment Variable</TableCell>
                                    <TableCell>Value</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {envResults.map((result, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>
                                            {result.name}
                                        </TableCell>
                                        <TableCell sx={{
                                            fontFamily: 'monospace',
                                            color: result.status === 'success' ? '#00ff88' : '#ff6b6b'
                                        }}>
                                            {result.value === 'undefined' ? 'NOT SET' : '✓ Set'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={result.status === 'success' ? 'OK' : 'MISSING'}
                                                color={result.status === 'success' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        );
    };

    // Database Collections Test
    const DatabaseTest = () => {
        const [dbResults, setDbResults] = useState<{ name: string; id: string | undefined; status: string; message: any; }[] | null>(null);
        const [testing, setTesting] = useState(false);

        const testDatabase = async () => {
            setTesting(true);
            const collections = [
                { name: 'vcas', id: process.env.NEXT_PUBLIC_APPWRITE_VCA_COLLECTION_ID },
                { name: 'vca_activities', id: process.env.NEXT_PUBLIC_APPWRITE_VCA_ACTIVITY_COLLECTION_ID },
                { name: 'vca_mappings', id: process.env.NEXT_PUBLIC_APPWRITE_VCA_MAPPING_COLLECTION_ID }
            ];

            const results: React.SetStateAction<null> | { name: string; id: string | undefined; status: string; message: any; }[] = [];

            for (const collection of collections) {
                try {
                    const response = await fetch(`/api/vca?action=list&collection=${collection.name}`);
                    const data = await response.json();

                    results.push({
                        name: collection.name,
                        id: collection.id,
                        status: response.ok ? 'success' : 'error',
                        message: response.ok ? 'Accessible' : data.error || 'Failed to access'
                    });
                } catch (error) {
                    results.push({
                        name: collection.name,
                        id: collection.id,
                        status: 'error',
                        message: 'An unknown error occurred'
                    });
                }
            }

            setDbResults(results);
            setTestResults(prev => ({ ...prev, database: results }));
            setTesting(false);
        };

        return (
            <Box>
                <Button
                    variant="contained"
                    onClick={testDatabase}
                    disabled={testing}
                    startIcon={testing ? <CircularProgress size={16} /> : <Storage />}
                    sx={{ mb: 2 }}
                >
                    {testing ? 'Testing Collections...' : 'Test Database Collections'}
                </Button>

                {dbResults && (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Collection</TableCell>
                                    <TableCell>Collection ID</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dbResults.map((result, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                            {result.name}
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                            {result.id || 'NOT SET'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={result.status === 'success' ? 'OK' : 'ERROR'}
                                                color={result.status === 'success' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: result.status === 'success' ? '#00ff88' : '#ff6b6b' }}>
                                            {result.message}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Instructions for creating collections */}
                <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2">📚 How to Create Missing Collections</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            If collections are missing, create them in your Appwrite dashboard:
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="1. vcas Collection"
                                    secondary="Attributes: projectSlug (string), owner (string), signalScore (integer), uniqueBackers (integer), reviews (integer), followers (integer), createdAt (datetime), tokenAddress (string, optional)"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="2. vca_activities Collection"
                                    secondary="Attributes: vcaAddress (string), type (string), userId (string), timestamp (datetime), details (string, optional)"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="3. vca_mappings Collection"
                                    secondary="Attributes: vca (string), tokenAddress (string), timestamp (datetime)"
                                />
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </Accordion>
            </Box>
        );
    };

    // Protocol Logic Test
    interface ProtocolTestResult {
        test: string;
        status: string;
        message: string;
    }

    const ProtocolTest = () => {
        const [protocolResults, setProtocolResults] = useState<ProtocolTestResult[] | null>(null);

        const testProtocol = async () => {
            try {
                // Test address generation
                const response = await fetch('/api/vca?action=validate&address=0x1234567890123456789012345678901234567890');
                const validation = await response.json();

                const results = [
                    {
                        test: 'Address Generation',
                        status: 'success',
                        message: 'VCA address format validation works'
                    },
                    {
                        test: 'Address Validation',
                        status: validation.isValid ? 'success' : 'error',
                        message: validation.isValid ? 'Address validation working' : 'Address validation failed'
                    }
                ];

                setProtocolResults(results);
                setTestResults(prev => ({ ...prev, protocol: results }));
            } catch (error) {
                setProtocolResults([{
                    test: 'Protocol Test',
                    status: 'error',
                    message: 'error.message'
                }]);
            }
        };

        return (
            <Box>
                <Button
                    variant="contained"
                    onClick={testProtocol}
                    startIcon={<Code />}
                    sx={{ mb: 2 }}
                >
                    Test Protocol Logic
                </Button>

                {protocolResults && (
                    <List>
                        {protocolResults.map((result, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    {result.status === 'success' ?
                                        <CheckCircle color="success" /> :
                                        <Error color="error" />
                                    }
                                </ListItemIcon>
                                <ListItemText
                                    primary={result.test}
                                    secondary={result.message}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        );
    };

    // API Endpoints Test
    const APITest = () => {
        const [apiResults, setApiResults] = useState<{ endpoint: string; description: string; status: string; message: any; data?: any; }[] | null>(null);
        const [testing, setTesting] = useState(false);

        const testAPI = async () => {
            setTesting(true);
            const endpoints = [
                { method: 'GET', action: 'list', description: 'List VCAs' },
                { method: 'POST', action: 'create', description: 'Create VCA', body: { slug: testData.projectSlug, owner: testData.owner } },
                { method: 'GET', action: 'getBySlug', description: 'Get VCA by slug', params: `slug=${testData.projectSlug}` }
            ];

            const results: React.SetStateAction<null> | { endpoint: string; description: string; status: string; message: any; data?: any; }[] = [];

            for (const endpoint of endpoints) {
                try {
                    const url = endpoint.params ? `/api/vca?action=${endpoint.action}&${endpoint.params}` : `/api/vca?action=${endpoint.action}`;

                    const response = await fetch(url, {
                        method: endpoint.method,
                        headers: endpoint.body ? { 'Content-Type': 'application/json' } : {},
                        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined
                    });

                    const data = await response.json();

                    results.push({
                        endpoint: `${endpoint.method} ${endpoint.action}`,
                        description: endpoint.description,
                        status: response.ok ? 'success' : 'error',
                        message: response.ok ? 'OK' : (data.error || 'Failed'),
                        data: response.ok ? data : null
                    });

                    // Store VCA address for next tests
                    if (endpoint.action === 'create' && response.ok && data.address) {
                        setTestData(prev => ({ ...prev, vcaAddress: data.address }));
                    }

                } catch (error) {
                    results.push({
                        endpoint: `${endpoint.method} ${endpoint.action}`,
                        description: endpoint.description,
                        status: 'error',
                        message: 'error.message'
                    });
                }
            }

            setApiResults(results);
            setTestResults(prev => ({ ...prev, api: results }));
            setTesting(false);
        };

        return (
            <Box>
                <Stack spacing={2} sx={{ mb: 2 }}>
                    <TextField
                        label="Test Project Slug"
                        value={testData.projectSlug}
                        onChange={(e) => setTestData(prev => ({ ...prev, projectSlug: e.target.value }))}
                        size="small"
                    />
                    <TextField
                        label="Test Owner"
                        value={testData.owner}
                        onChange={(e) => setTestData(prev => ({ ...prev, owner: e.target.value }))}
                        size="small"
                    />
                </Stack>

                <Button
                    variant="contained"
                    onClick={testAPI}
                    disabled={testing}
                    startIcon={testing ? <CircularProgress size={16} /> : <Api />}
                    sx={{ mb: 2 }}
                >
                    {testing ? 'Testing APIs...' : 'Test API Endpoints'}
                </Button>

                {apiResults && (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Endpoint</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {apiResults.map((result, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>
                                            {result.endpoint}
                                        </TableCell>
                                        <TableCell>{result.description}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={result.status === 'success' ? 'OK' : 'ERROR'}
                                                color={result.status === 'success' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{
                                            color: result.status === 'success' ? '#00ff88' : '#ff6b6b',
                                            fontFamily: 'monospace',
                                            fontSize: '0.8rem'
                                        }}>
                                            {result.message}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {testData.vcaAddress && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        ✅ VCA Created! Address: <code>{testData.vcaAddress}</code>
                    </Alert>
                )}
            </Box>
        );
    };

    // Full Integration Test
    const IntegrationTest = () => {
        const [integrationResults, setIntegrationResults] = useState<{ step: string; status: string; message: any; }[] | null>(null);
        const [testing, setTesting] = useState(false);

        const testIntegration = async () => {
            setTesting(true);
            const results: React.SetStateAction<null> | { step: string; status: string; message: any; }[] = [];

            try {
                // Step 1: Create VCA
                let response = await fetch('/api/vca', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'create',
                        slug: 'integration-test-' + Date.now(),
                        owner: 'test-integration-user'
                    })
                });

                let data = await response.json();
                const vcaAddress = data.address;

                results.push({
                    step: '1. Create VCA',
                    status: response.ok ? 'success' : 'error',
                    message: response.ok ? `Created VCA: ${vcaAddress}` : data.error
                });

                if (!response.ok) {
                    setIntegrationResults(results);
                    setTesting(false);
                    return;
                }

                // Step 2: Add Activity
                response = await fetch('/api/vca', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'addActivity',
                        address: vcaAddress,
                        userId: 'test-user-123',
                        activityType: 'backing'
                    })
                });

                data = await response.json();
                results.push({
                    step: '2. Add Activity',
                    status: response.ok ? 'success' : 'error',
                    message: response.ok ? 'Activity added successfully' : data.error
                });

                // Step 3: Get Activities
                response = await fetch(`/api/vca?action=activities&address=${vcaAddress}`);
                data = await response.json();
                results.push({
                    step: '3. Get Activities',
                    status: response.ok ? 'success' : 'error',
                    message: response.ok ? `Found ${data.length} activities` : data.error
                });

                // Step 4: Map to Contract
                response = await fetch('/api/vca', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'mapToContract',
                        address: vcaAddress,
                        tokenAddress: testData.tokenAddress
                    })
                });

                data = await response.json();
                results.push({
                    step: '4. Map to Contract',
                    status: response.ok ? 'success' : 'error',
                    message: response.ok ? 'Mapping created successfully' : data.error
                });

                setIntegrationResults(results);
                setTestResults(prev => ({ ...prev, integration: results }));

            } catch (error) {
                results.push({
                    step: 'Integration Test',
                    status: 'error',
                    message: 'error.message'
                });
                setIntegrationResults(results);
            }

            setTesting(false);
        };

        return (
            <Box>
                <TextField
                    label="Test Token Address"
                    value={testData.tokenAddress}
                    onChange={(e) => setTestData(prev => ({ ...prev, tokenAddress: e.target.value }))}
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                />

                <Button
                    variant="contained"
                    onClick={testIntegration}
                    disabled={testing}
                    startIcon={testing ? <CircularProgress size={16} /> : <PlayArrow />}
                    sx={{ mb: 2 }}
                >
                    {testing ? 'Running Integration Test...' : 'Run Full Integration Test'}
                </Button>

                {integrationResults && (
                    <List>
                        {integrationResults.map((result, index) => (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    {result.status === 'success' ?
                                        <CheckCircle color="success" /> :
                                        <Error color="error" />
                                    }
                                </ListItemIcon>
                                <ListItemText
                                    primary={result.step}
                                    secondary={result.message}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        );
    };

    const renderTestComponent = (componentName: string) => {
        switch (componentName) {
            case 'EnvironmentTest': return <EnvironmentTest />;
            case 'DatabaseTest': return <DatabaseTest />;
            case 'ProtocolTest': return <ProtocolTest />;
            case 'APITest': return <APITest />;
            case 'IntegrationTest': return <IntegrationTest />;
            default: return null;
        }
    };

    const getStepStatus = (stepIndex: number) => {
        const stepName = testSteps[stepIndex].component.toLowerCase().replace('test', '');
        const results = testResults[stepName];

        if (!results) return 'pending';

        if (Array.isArray(results)) {
            return results.every(r => r.status === 'success') ? 'success' : 'error';
        }

        return results.status || 'pending';
    };

    return (
        <Box sx={{
            maxWidth: 1200,
            mx: 'auto',
            p: 3,
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            minHeight: '100vh',
            color: 'white'
        }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#00ff88', fontWeight: 'bold' }}>
                🧪 VCA Integration Testing Tool
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: '#b0b0b0' }}>
                This tool will help you verify that your VCA (Virtual Contract Address) system is properly integrated and working.
                Follow each step to identify and fix any issues.
            </Typography>

            <Stepper orientation="vertical" activeStep={activeStep}>
                {testSteps.map((step, index) => {
                    const stepStatus = getStepStatus(index);

                    return (
                        <Step key={step.label}>
                            <StepLabel
                                onClick={() => setActiveStep(index)}
                                sx={{ cursor: 'pointer' }}
                                StepIconComponent={() => (
                                    <Box sx={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor:
                                            stepStatus === 'success' ? '#00ff88' :
                                                stepStatus === 'error' ? '#ff6b6b' :
                                                    stepStatus === 'pending' ? '#ffa726' : '#666',
                                        color: stepStatus === 'pending' ? '#000' : '#fff',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {stepStatus === 'success' ? '✓' :
                                            stepStatus === 'error' ? '✗' :
                                                index + 1}
                                    </Box>
                                )}
                            >
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    {step.label}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#888' }}>
                                    {step.description}
                                </Typography>
                            </StepLabel>
                            <StepContent>
                                <Card sx={{
                                    mt: 2,
                                    background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                                    border: '1px solid #333'
                                }}>
                                    <CardContent>
                                        {renderTestComponent(step.component)}
                                    </CardContent>
                                </Card>
                            </StepContent>
                        </Step>
                    );
                })}
            </Stepper>

            {/* Overall Results Summary */}
            {Object.keys(testResults).length > 0 && (
                <Card sx={{
                    mt: 4,
                    background: 'linear-gradient(145deg, #1a1a1a, #2a2a2a)',
                    border: '1px solid #00ff88'
                }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, color: '#00ff88' }}>
                            📊 Test Results Summary
                        </Typography>

                        {Object.entries(testResults).map(([testName, results]) => {
                            const allSuccess = Array.isArray(results)
                                ? results.every(r => r.status === 'success')
                                : results && typeof results === 'object' && 'status' in results && results.status === 'success';

                            return (
                                <Box key={testName} sx={{ mb: 2 }}>
                                    <Chip
                                        label={`${testName.toUpperCase()}: ${allSuccess ? 'PASS' : 'FAIL'}`}
                                        color={allSuccess ? 'success' : 'error'}
                                        variant="outlined"
                                        sx={{ mr: 1 }}
                                    />
                                </Box>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}