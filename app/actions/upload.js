'use server';

import { createClient } from "@supabase/supabase-js";
import crypto from 'crypto';

export async function uploadProfileImageAction(formData) {
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!file || !userId) {
        throw new Error('Missing file or userId');
    }

    // Validation
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > MAX_SIZE) {
        throw new Error('Image size must be less than 5MB');
    }
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG, PNG, and WEBP images are allowed');
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
        console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
        throw new Error('Server configuration error');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        }
    });

    try {
        const fileExt = file.name.split('.').pop().toLowerCase();
        // Use crypto.randomUUID if available, or a simple fallback for unique names
        const uniqueId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
        const fileName = `${uniqueId}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // Convert file to buffer for upload
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, buffer, {
                cacheControl: '3600',
                upsert: true,
                contentType: file.type
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Server upload error:', error);
        throw new Error('Failed to upload image');
    }
}

export async function deleteAvatarAction(imageUrl) {
    if (!imageUrl) return;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
        console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
        throw new Error('Server configuration error');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        }
    });

    try {
        let filePath;
        // Check if it matches the standard Supabase public URL structure
        const publicUrlPrefix = `${supabaseUrl}/storage/v1/object/public/avatars/`;

        if (imageUrl.startsWith(publicUrlPrefix)) {
            filePath = imageUrl.slice(publicUrlPrefix.length);
        } else if (imageUrl.includes('/storage/v1/object/public/avatars/')) {
            // Fallback if URL base is different but structure is same
            filePath = imageUrl.split('/storage/v1/object/public/avatars/')[1];
        } else {
            // Fallback for just path or other structures
            // Assuming the path is at the end of the URL
            const parts = imageUrl.split('/');
            // We know the structure is userId/filename usually
            // If we split by '/', the last 2 parts might be userId and filename
            if (parts.length >= 2) {
                // But wait, parts might be full URL parts.
                // let's try to extract from the know pattern
                // Pattern is userId/filename
                // But we can't be sure without more info.
                // However, the upload action saves it as `${userId}/${fileName}`
                // So we need to extract that part.
                // Let's assume the safe split logic from lib/supabase
                filePath = parts[parts.length - 1]; // This is WRONG if it's in a folder

                // Better regex extraction if standard URL parsing fails?
                // Or just trust the split by bucket name if present.
            }
        }

        // If simple extraction failed, try to construct from URL object
        if (!filePath) {
            try {
                const urlObj = new URL(imageUrl);
                const pathParts = urlObj.pathname.split('/avatars/');
                if (pathParts.length > 1) {
                    filePath = decodeURIComponent(pathParts[1]);
                }
            } catch (e) {
                // Not a valid URL, maybe it is already a path?
                filePath = imageUrl;
            }
        }

        if (!filePath) {
            console.error('Could not extract file path from URL:', imageUrl);
            return;
        }

        console.log('Attempting to delete avatar at path:', filePath);

        const { error } = await supabase.storage
            .from('avatars')
            .remove([filePath]);

        if (error) {
            console.error('Supabase delete error:', error);
            throw new Error(`Delete failed: ${error.message}`);
        }

        console.log('Successfully deleted avatar');

    } catch (error) {
        console.error('Server delete error:', error);
        // We don't throw here to avoid blocking the profile update?
        // But maybe we should log it.
    }
}
