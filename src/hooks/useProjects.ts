import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, PROJECTS_COLLECTION_ID } from '../lib/appwrite';
import { Project } from '../lib/types';
import { Query } from 'appwrite';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                [Query.orderDesc('createdAt')]
            );
            setProjects(response.documents as unknown as Project[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (projectData: Omit<Project, '$id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                'unique()',
                {
                    ...projectData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            );
            await fetchProjects(); // Refresh the list
            return response;
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to create project');
        }
    };

    const updateProject = async (projectId: string, updates: Partial<Project>) => {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                projectId,
                {
                    ...updates,
                    updatedAt: new Date().toISOString(),
                }
            );
            await fetchProjects(); // Refresh the list
            return response;
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Failed to update project');
        }
    };

    const getProjectById = async (projectId: string): Promise<Project | null> => {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                PROJECTS_COLLECTION_ID,
                projectId
            );
            return response as unknown as Project;
        } catch (err) {
            console.error('Failed to get project:', err);
            return null;
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        getProjectById,
    };
};