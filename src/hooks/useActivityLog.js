import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

// Create an activity log entry for admin actions
export const logActivity = async ({ action, resource, resourceId, description, user }) => {
  try {
    await addDoc(collection(db, 'activityLogs'), {
      action, // 'create', 'update', 'delete', 'publish', 'unpublish', 'login', etc.
      resource, // 'project', 'service', 'blog', 'testimonial', etc.
      resourceId: resourceId || null,
      description,
      user: user?.email || user?.name || 'Unknown',
      userId: user?.uid || null,
      timestamp: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to log activity:', error);
    return { success: false, error: error.message };
  }
};

// Create a notification for admin dashboard
export const createNotification = async ({ type, title, message }) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      type, // 'quote', 'inquiry', 'project', 'testimonial', 'system'
      title: title || '',
      message,
      read: false,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to create notification:', error);
    return { success: false, error: error.message };
  }
};

// Delete image from Cloudinary by URL
export const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return { success: true };
  
  try {
    // Extract public_id from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) return { success: true };
    
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExtension.replace(/\.[^.]+$/, ''); // Remove extension
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
    
    if (!cloudName || !apiKey) {
      console.warn('Cloudinary not fully configured - image deletion skipped');
      return { success: true };
    }

    // Note: For secure deletion, use Cloudinary's server-side upload API with destroy
    // This client-side approach requires the unsigned deletion feature enabled
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_id: publicId,
          api_key: apiKey,
          timestamp: Math.floor(Date.now() / 1000),
        }),
      }
    );
    
    const result = await response.json();
    if (result.result === 'ok') {
      return { success: true };
    }
    return { success: false, error: 'Failed to delete from Cloudinary' };
  } catch (error) {
    console.warn('Cloudinary deletion failed (non-critical):', error.message);
    return { success: true }; // Non-critical failure
  }
};

// Export data as JSON
export const exportCollectionData = async (collectionName, fileName) => {
  try {
    const { getDocs, query, collection, orderBy } = await import('firebase/firestore');
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString?.() || doc.data().updatedAt,
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || collectionName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true, count: data.length };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, error: error.message };
  }
};

// Export all collections as a backup
export const exportAllData = async () => {
  const collections = [
    'projects', 'services', 'teamMembers', 'blogPosts', 'testimonials',
    'gallery', 'inquiries', 'quotes', 'heroSlides', 'websiteSettings',
    'seoSettings', 'notifications', 'users', 'FAQs'
  ];
  
  const backup = {};
  for (const name of collections) {
    try {
      const { getDocs, query, collection } = await import('firebase/firestore');
      const q = query(collection(db, name));
      const snapshot = await getDocs(q);
      backup[name] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (e) {
      backup[name] = [];
    }
  }
  
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `be-construction-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  return { success: true };
};