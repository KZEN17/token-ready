import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const PROJECTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID || '';
export const REVIEWS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || '';
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '';
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'project-logos';

export const VCA_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_COLLECTION_ID || 'vcas';
export const VCA_ACTIVITY_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_ACTIVITY_COLLECTION_ID || 'vca_activities';
export const VCA_MAPPING_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_VCA_MAPPING_COLLECTION_ID || 'vca_mappings';
export default client;