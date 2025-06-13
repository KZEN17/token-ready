// src/app/api/vca/route.ts - COMPLETE REWRITE
import { NextRequest, NextResponse } from 'next/server';
import { VCAApi } from '@/lib/vca/api';
import { VCAProtocol } from '@/lib/vca/protocol';
import { VCAActivity } from '@/lib/types';

/**
 * GET handler for VCA API routes
 * 
 * Supported actions:
 * - get: Get a VCA by address
 * - getByProjectId: Get a VCA by project ID
 * - activities: Get activities for a VCA
 * - validate: Validate a VCA address
 * - mapping: Get a mapping for a VCA
 * - list: List all VCAs (default)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const address = searchParams.get('address');
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Log the request parameters for debugging
    console.log(`[API] VCA GET request: action=${action}, address=${address}, projectId=${projectId}, limit=${limit}, offset=${offset}`);

    try {
        switch (action) {
            case 'get':
                if (!address) {
                    return NextResponse.json(
                        { error: 'Address parameter is required' },
                        { status: 400 }
                    );
                }

                // Validate address format first
                if (!VCAProtocol.isValidAddress(address)) {
                    return NextResponse.json(
                        { error: 'Invalid address format' },
                        { status: 400 }
                    );
                }

                const vca = await VCAApi.getVCA(address);
                if (!vca) {
                    return NextResponse.json(
                        { error: 'VCA not found' },
                        { status: 404 }
                    );
                }
                return NextResponse.json(vca);

            case 'getByProjectId':
                if (!projectId) {
                    return NextResponse.json(
                        { error: 'ProjectId parameter is required' },
                        { status: 400 }
                    );
                }

                console.log(`[API] Getting VCA by projectId=${projectId}`);

                try {
                    const vcaByProjectId = await VCAApi.getVCAByProjectId(projectId);

                    if (!vcaByProjectId) {
                        console.log(`[API] No VCA found for projectId=${projectId}`);
                        return NextResponse.json(
                            { error: 'VCA not found for this project ID' },
                            { status: 404 }
                        );
                    }

                    console.log(`[API] Found VCA for projectId=${projectId}:`, vcaByProjectId);
                    return NextResponse.json(vcaByProjectId);
                } catch (error) {
                    console.error(`[API] Error getting VCA by projectId=${projectId}:`, error);
                    return NextResponse.json(
                        { error: 'Failed to get VCA by project ID' },
                        { status: 500 }
                    );
                }

            case 'activities':
                if (!address) {
                    return NextResponse.json(
                        { error: 'Address parameter is required' },
                        { status: 400 }
                    );
                }

                // Validate address format
                if (!VCAProtocol.isValidAddress(address)) {
                    return NextResponse.json(
                        { error: 'Invalid address format' },
                        { status: 400 }
                    );
                }

                const activities = await VCAApi.getActivities(address, limit);
                return NextResponse.json(activities);

            case 'validate':
                if (!address) {
                    return NextResponse.json(
                        { error: 'Address parameter is required' },
                        { status: 400 }
                    );
                }
                const isValid = VCAProtocol.isValidAddress(address);
                return NextResponse.json({ isValid });

            case 'mapping':
                if (!address) {
                    return NextResponse.json(
                        { error: 'Address parameter is required' },
                        { status: 400 }
                    );
                }

                // Validate address format
                if (!VCAProtocol.isValidAddress(address)) {
                    return NextResponse.json(
                        { error: 'Invalid address format' },
                        { status: 400 }
                    );
                }

                const mapping = await VCAApi.getMapping(address);
                if (!mapping) {
                    return NextResponse.json(
                        { error: 'Mapping not found for this VCA' },
                        { status: 404 }
                    );
                }
                return NextResponse.json(mapping);

            case 'list':
            default:
                const vcas = await VCAApi.listVCAs(limit, offset);
                return NextResponse.json(vcas);
        }
    } catch (error: any) {
        console.error('[API] VCA GET error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process VCA request' },
            { status: 500 }
        );
    }
}

/**
 * POST handler for VCA API routes
 * 
 * Supported actions:
 * - create: Create a new VCA
 * - mapToContract: Map a VCA to a token contract
 * - addActivity: Add activity to a VCA
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, projectId, owner, address, tokenAddress, userId, activityType, details } = body;

        // Log the request parameters for debugging
        console.log(`[API] VCA POST request: action=${action}`, body);

        switch (action) {
            case 'create':
                if (!projectId || !projectId.trim()) {
                    return NextResponse.json(
                        { error: 'ProjectId parameter is required and cannot be empty' },
                        { status: 400 }
                    );
                }

                if (!owner || !owner.trim()) {
                    return NextResponse.json(
                        { error: 'Owner parameter is required and cannot be empty' },
                        { status: 400 }
                    );
                }

                try {
                    const newVca = await VCAApi.createVCA(projectId.trim(), owner.trim());
                    return NextResponse.json(newVca);
                } catch (err: any) {
                    console.error('[API] VCA creation failed:', err);
                    return NextResponse.json(
                        { error: err.message || 'VCA creation failed' },
                        { status: 500 }
                    );
                }

            case 'mapToContract':
                if (!address) {
                    return NextResponse.json(
                        { error: 'VCA address is required' },
                        { status: 400 }
                    );
                }

                if (!tokenAddress) {
                    return NextResponse.json(
                        { error: 'Token address is required' },
                        { status: 400 }
                    );
                }

                // Validate both addresses
                if (!VCAProtocol.isValidAddress(address)) {
                    return NextResponse.json(
                        { error: 'Invalid VCA address format' },
                        { status: 400 }
                    );
                }

                if (!VCAProtocol.isValidAddress(tokenAddress)) {
                    return NextResponse.json(
                        { error: 'Invalid token address format' },
                        { status: 400 }
                    );
                }

                try {
                    const mapping = await VCAApi.mapToContract(address, tokenAddress);
                    return NextResponse.json(mapping);
                } catch (err: any) {
                    console.error('[API] VCA mapping failed:', err);
                    return NextResponse.json(
                        { error: err.message || 'VCA mapping failed' },
                        { status: 500 }
                    );
                }

            case 'addActivity':
                if (!address) {
                    return NextResponse.json(
                        { error: 'VCA address is required' },
                        { status: 400 }
                    );
                }

                if (!userId) {
                    return NextResponse.json(
                        { error: 'User ID is required' },
                        { status: 400 }
                    );
                }

                if (!activityType || !['backing', 'review', 'share'].includes(activityType)) {
                    return NextResponse.json(
                        { error: 'Valid activity type is required (backing, review, or share)' },
                        { status: 400 }
                    );
                }

                // Validate address format
                if (!VCAProtocol.isValidAddress(address)) {
                    return NextResponse.json(
                        { error: 'Invalid VCA address format' },
                        { status: 400 }
                    );
                }

                const activity: VCAActivity = {
                    type: activityType as 'backing' | 'review' | 'share',
                    userId,
                    timestamp: new Date().toISOString(),
                    details: details || {}
                };

                try {
                    await VCAApi.addActivity(address, activity);
                    return NextResponse.json({ success: true });
                } catch (err: any) {
                    console.error('[API] Adding activity failed:', err);
                    return NextResponse.json(
                        { error: err.message || 'Failed to add activity' },
                        { status: 500 }
                    );
                }

            default:
                return NextResponse.json(
                    { error: 'Invalid action specified' },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        console.error('[API] VCA POST error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process VCA request' },
            { status: 500 }
        );
    }
}