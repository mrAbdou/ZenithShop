import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function validateImage(file) {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG, PNG, and WEBP images are allowed');
    }

    if (file.size > MAX_SIZE) {
        throw new Error('Image size must be less than 5MB');
    }
}
// Upload product image to Supabase storage
export async function uploadProductImage(file, productId) {
    validateImage(file);

    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${productId}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type
        });

    if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

    return publicUrl;

}

// Upload profile image to Supabase storage
export async function uploadProfileImage(file, userId) {
    validateImage(file);

    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || 'image/jpeg'
        });

    if (error) {
        throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    return publicUrl;
}

// Delete product images from Supabase storage
export async function deleteProductImages(imageUrls) {
    if (!imageUrls || imageUrls.length === 0) {
        return;
    }

    try {
        // Determine if we have access to the service role key (Server-side)
        // If so, create a dynamic admin client to bypass RLS policies
        const isServer = typeof window === 'undefined';
        let storageClient = supabase;

        if (isServer && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const { createClient } = await import('@supabase/supabase-js');
            storageClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false,
                },
            });
        }

        // Extract file paths relative to the bucket
        const filePaths = imageUrls.map(url => {
            // Check if it's a full Supabase URL
            if (url.includes('/storage/v1/object/public/products/')) {
                return url.split('/storage/v1/object/public/products/')[1];
            }
            // Fallback for simple filenames or other structures
            const parts = url.split('/');
            return parts[parts.length - 1];
        });

        if (filePaths.length === 0) return;

        // Perform batch deletion
        const { error } = await storageClient.storage
            .from('products')
            .remove(filePaths);

        if (error) {
            console.error('Supabase storage delete error:', error);
        }
    } catch (error) {
        console.error('Error in deleteProductImages:', error);
    }
}
