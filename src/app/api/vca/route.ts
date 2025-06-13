// src/app/api/vca/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { VCAApi } from '@/lib/vca/api';
import { VCAProtocol } from '@/lib/vca/protocol';
import { VCAActivity } from '@/lib/types';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const address = searchParams.get('address');
    const slug = searchParams.get('slug');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Log the request parameters for debugging
    console.log(`VCA API GET request: action=${action}, address=${address}, slug=${slug}, limit=${limit}, offset=${offset}`);

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

            case 'getBySlug':
                if (!slug) {
                    return NextResponse.json(
                        { error: 'Slug parameter is required' },
                        { status: 400 }
                    );
                }

                console.log(`API Route: Getting VCA by slug=${slug}`);

                try {
                    const vcaBySlug = await VCAApi.getVCABySlug(slug);

                    // IMPORTANT: This is the key fix - handle null result properly
                    if (!vcaBySlug) {
                        console.log(`API Route: No VCA found for slug=${slug}`);
                        return NextResponse.json(
                            { error: 'VCA not found for this slug' },
                            { status: 404 }
                        );
                    }

                    console.log(`API Route: Found VCA for slug=${slug}:`, vcaBySlug);
                    return NextResponse.json(vcaBySlug);
                } catch (error) {
                    console.error(`API Route: Error getting VCA by slug=${slug}:`, error);
                    return NextResponse.json(
                        { error: 'Failed to get VCA by slug' },
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
        console.error('VCA API GET error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process VCA request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, slug, owner, address, tokenAddress, userId, activityType, details } = body;

        // Log the request parameters for debugging
        console.log(`VCA API POST request: action=${action}`, body);

        switch (action) {
            case 'create':
                if (!slug || !slug.trim()) {
                    return NextResponse.json(
                        { error: 'Slug parameter is required and cannot be empty' },
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
                    const newVca = await VCAApi.createVCA(slug.trim(), owner.trim());
                    return NextResponse.json(newVca);
                } catch (err: any) {
                    console.error('VCA creation failed:', err);
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
                    console.error('VCA mapping failed:', err);
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
                    console.error('Adding activity failed:', err);
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
        console.error('VCA API POST error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process VCA request' },
            { status: 500 }
        );
    }
}