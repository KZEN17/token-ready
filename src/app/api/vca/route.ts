// src/app/api/vca/route.ts
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

    try {
        switch (action) {
            case 'get':
                if (!address) {
                    return NextResponse.json(
                        { error: 'Address parameter is required' },
                        { status: 400 }
                    );
                }
                const vca = await VCAApi.getVCA(address);
                return NextResponse.json(vca);

            case 'getBySlug':
                if (!slug) {
                    return NextResponse.json(
                        { error: 'Slug parameter is required' },
                        { status: 400 }
                    );
                }
                const vcaBySlug = await VCAApi.getVCABySlug(slug);
                return NextResponse.json(vcaBySlug);

            case 'activities':
                if (!address) {
                    return NextResponse.json(
                        { error: 'Address parameter is required' },
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
                const mapping = await VCAApi.getMapping(address);
                return NextResponse.json(mapping);

            case 'list':
            default:
                const vcas = await VCAApi.listVCAs(limit, offset);
                return NextResponse.json(vcas);
        }
    } catch (error) {
        console.error('VCA API error:', error);
        return NextResponse.json(
            { error: 'Failed to process VCA request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, slug, owner, address, tokenAddress, userId, activityType } = body;

        switch (action) {
            case 'create':
                if (!slug || !owner) {
                    return NextResponse.json(
                        { error: 'Slug and owner parameters are required' },
                        { status: 400 }
                    );
                }
                const newVca = await VCAApi.createVCA(slug, owner);
                return NextResponse.json(newVca);

            case 'mapToContract':
                if (!address || !tokenAddress) {
                    return NextResponse.json(
                        { error: 'VCA address and token address are required' },
                        { status: 400 }
                    );
                }
                const mapping = await VCAApi.mapToContract(address, tokenAddress);
                return NextResponse.json(mapping);

            case 'addActivity':
                if (!address || !userId || !activityType) {
                    return NextResponse.json(
                        { error: 'VCA address, user ID, and activity type are required' },
                        { status: 400 }
                    );
                }

                const activity: VCAActivity = {
                    type: activityType as 'backing' | 'review' | 'share',
                    userId,
                    timestamp: new Date().toISOString(),
                    details: body.details || {}
                };

                await VCAApi.addActivity(address, activity);
                return NextResponse.json({ success: true });

            default:
                return NextResponse.json(
                    { error: 'Invalid action specified' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('VCA API error:', error);
        return NextResponse.json(
            { error: 'Failed to process VCA request' },
            { status: 500 }
        );
    }
}