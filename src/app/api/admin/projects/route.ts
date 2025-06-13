// src/app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '@/lib/appwrite';
import { VCAApi } from '@/lib/vca/api';
import { Query } from 'appwrite';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const status = searchParams.get('status') || 'pending';

    try {
        switch (action) {
            case 'list':
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    PROJECTS_COLLECTION_ID,
                    [
                        Query.equal('adminReviewStatus', status),
                        Query.orderDesc('createdAt'),
                        Query.limit(50)
                    ]
                );
                return NextResponse.json(response.documents);

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        console.error('Admin projects GET error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, projectId, reviewNotes, reviewedBy } = body;

        if (!projectId || !reviewedBy) {
            return NextResponse.json(
                { error: 'Project ID and reviewer ID are required' },
                { status: 400 }
            );
        }

        // Get the project first
        const project = await databases.getDocument(
            DATABASE_ID,
            PROJECTS_COLLECTION_ID,
            projectId
        );

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const now = new Date().toISOString();

        switch (action) {
            case 'approve':
                console.log(`Approving project: ${project.name} (${projectId})`);

                try {
                    // 1. Create VCA for the project
                    console.log(`Creating VCA for project: ${project.name}`);
                    const vca = await VCAApi.createVCA(projectId, project.createdBy);
                    console.log(`VCA created successfully:`, vca);

                    // 2. Update project status
                    const updateData = {
                        status: 'live',
                        adminReviewStatus: 'approved',
                        reviewedBy,
                        reviewedAt: now,
                        reviewNotes: reviewNotes || '',
                        vcaAddress: vca.address
                    };

                    console.log(`Updating project with:`, updateData);

                    const updatedProject = await databases.updateDocument(
                        DATABASE_ID,
                        PROJECTS_COLLECTION_ID,
                        projectId,
                        updateData
                    );

                    console.log(`Project approved and updated successfully`);

                    return NextResponse.json({
                        success: true,
                        project: updatedProject,
                        vca: vca,
                        message: 'Project approved and VCA created successfully'
                    });

                } catch (vcaError) {
                    console.error('Error creating VCA during approval:', vcaError);

                    // Still approve the project but without VCA
                    const fallbackUpdateData = {
                        status: 'live',
                        adminReviewStatus: 'approved',
                        reviewedBy,
                        reviewedAt: now,
                        reviewNotes: (reviewNotes || '') + '\n[VCA creation failed]'
                    };

                    const updatedProject = await databases.updateDocument(
                        DATABASE_ID,
                        PROJECTS_COLLECTION_ID,
                        projectId,
                        fallbackUpdateData
                    );

                    return NextResponse.json({
                        success: true,
                        project: updatedProject,
                        vcaError: true,
                        message: 'Project approved but VCA creation failed'
                    });
                }

            case 'reject':
                console.log(`Rejecting project: ${project.name} (${projectId})`);

                const rejectedProject = await databases.updateDocument(
                    DATABASE_ID,
                    PROJECTS_COLLECTION_ID,
                    projectId,
                    {
                        status: 'rejected',
                        adminReviewStatus: 'rejected',
                        reviewedBy,
                        reviewedAt: now,
                        reviewNotes: reviewNotes || ''
                    }
                );

                return NextResponse.json({
                    success: true,
                    project: rejectedProject,
                    message: 'Project rejected successfully'
                });

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Use "approve" or "reject"' },
                    { status: 400 }
                );
        }

    } catch (error: any) {
        console.error('Admin projects POST error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process review' },
            { status: 500 }
        );
    }
}