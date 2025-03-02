import ImageKit from 'imagekit';

// Initialize ImageKit with your credentials
// These should be stored in environment variables in production
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'your_public_key',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'your_private_key',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/your_imagekit_id/'
});

export interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
  size: number;
  error?: string;
}

/**
 * Uploads an image to ImageKit and returns the URL
 */
export async function uploadImage(file: File | Blob, fileName: string): Promise<UploadResponse> {
  try {
    // Convert File/Blob to base64
    const base64 = await fileToBase64(file);
    
    // Upload to ImageKit
    const response = await imagekit.upload({
      file: base64,
      fileName: fileName,
      folder: '/course-images/'
    });
    
    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      size: response.size
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      url: '',
      fileId: '',
      name: '',
      size: 0,
      error: 'Failed to upload image'
    };
  }
}

/**
 * Converts a File or Blob to base64 string
 */
function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Optimizes an image URL with ImageKit transformations
 */
export function optimizeImage(url: string, width: number = 800, quality: number = 80): string {
  // If it's a local path (starts with /), return as is - these are served from the public directory
  if (url.startsWith('/')) {
    return url;
  }
  
  // If it's already an ImageKit URL, add transformations
  if (url.includes('ik.imagekit.io')) {
    return `${url}?tr=w-${width},q-${quality}`;
  }
  
  // If it's an external URL, proxy through ImageKit
  if (url.startsWith('http')) {
    // Check if ImageKit is properly configured
    if (imagekit.urlEndpoint && !imagekit.urlEndpoint.includes('your_imagekit_id')) {
      const encodedUrl = encodeURIComponent(url);
      return `${imagekit.urlEndpoint}tr:w-${width},q-${quality}/external/${encodedUrl}`;
    } else {
      // If ImageKit is not configured, return the original URL
      return url;
    }
  }
  
  // Return original URL if we can't optimize it
  return url;
} 