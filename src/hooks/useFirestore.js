import { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { callDeleteEndpoint } from '../config/cloudinary';
import { getPublicId, getImageUrl } from '../utils/image';

// =============================================================================
// AUTH-AWARE QUERY EXECUTION
// Waits for Firebase Auth to initialize before running Firestore queries
// =============================================================================

/**
 * Returns a promise that resolves when auth state is determined
 * (either user is logged in or not). This prevents premature Firestore queries.
 * Uses a cached auth state to avoid creating multiple listeners.
 */
let authPromiseCache = null;

function waitForAuth() {
  // Return cached promise if one exists
  if (authPromiseCache) return authPromiseCache;

  if (!auth) {
    authPromiseCache = Promise.resolve(null);
    return authPromiseCache;
  }

  // Check if auth is already initialized
  // In Firebase, currentUser is null when not logged in, or User object when logged in.
  // 'undefined' means it hasn't been determined yet (before onAuthStateChanged fires)
  if (auth.currentUser !== null && auth.currentUser !== undefined) {
    authPromiseCache = Promise.resolve(auth.currentUser);
    return authPromiseCache;
  }

  // Auth is still loading - wait for onAuthStateChanged to fire
  authPromiseCache = new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      // Cache is now resolved, reset so next call creates fresh promise
      authPromiseCache = null;
      resolve(user);
    });

    // Safety timeout: if auth doesn't resolve within 8s, resolve with null
    setTimeout(() => {
      unsubscribe();
      authPromiseCache = null;
      resolve(auth.currentUser);
    }, 8000);
  });

  return authPromiseCache;
}

// =============================================================================
// HOOK: useCollection - Fetch collection data with auth-awareness
// =============================================================================

export const useCollection = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);

    try {
      // Wait for auth to initialize before querying
      await waitForAuth();

      if (!mountedRef.current) return;

      let q = query(collection(db, collectionName));

      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      if (options.where) {
        const { field, operator, value } = options.where;
        q = query(q, where(field, operator, value));
      }

      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (mountedRef.current) {
        setData(result);
        setError(null);
        setLoading(false);
      }
    } catch (err) {
      console.error(`Error fetching collection "${collectionName}":`, err.message);
      if (mountedRef.current) {
        setError(
          err.code === 'permission-denied'
            ? 'Permission denied. Please ensure you are logged in as an admin.'
            : err.code === 'failed-precondition'
            ? 'Failed to load data. Please try again.'
            : err.message || 'An unexpected error occurred while loading data.'
        );
        setLoading(false);
      }
    }
  }, [collectionName, options.orderBy, options.orderDirection, options.limit, options.where]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return { data, loading, error, retry };
};

// =============================================================================
// HOOK: useRealtimeCollection - Real-time collection updates with cleanup
// =============================================================================

export const useRealtimeCollection = (collectionName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);
  const unsubscribeRef = useRef(null);

  const subscribe = useCallback(async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);

    // Clean up any existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    try {
      // Wait for auth to initialize first
      await waitForAuth();

      if (!mountedRef.current) return;

      let q = query(collection(db, collectionName));

      if (options.orderBy) {
        q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
      }

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      if (options.where) {
        const { field, operator, value } = options.where;
        q = query(q, where(field, operator, value));
      }

      unsubscribeRef.current = onSnapshot(
        q,
        (snapshot) => {
          if (!mountedRef.current) return;
          const result = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(result);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(`Error in realtime subscription "${collectionName}":`, err.message);
          if (mountedRef.current) {
            setError(
              err.code === 'permission-denied'
                ? 'Permission denied. Please ensure you are logged in as an admin.'
                : err.code === 'failed-precondition'
                ? 'Failed to load data. Please try again.'
                : err.message || 'Connection error. Retrying...'
            );
            setLoading(false);
          }
        }
      );
    } catch (err) {
      console.error(`Error setting up realtime subscription "${collectionName}":`, err.message);
      if (mountedRef.current) {
        setError(
          err.code === 'permission-denied'
            ? 'Permission denied. Please ensure you are logged in as an admin.'
            : err.message || 'Failed to connect to real-time updates.'
        );
        setLoading(false);
      }
    }
  }, [collectionName, options.orderBy, options.orderDirection, options.limit, options.where]);

  useEffect(() => {
    mountedRef.current = true;
    subscribe();

    return () => {
      mountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [subscribe, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return { data, loading, error, retry };
};

// =============================================================================
// HOOK: useDocument - Fetch a single document with auth-awareness
// =============================================================================

export const useDocument = (collectionName, documentId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);

  const fetchDocument = useCallback(async () => {
    if (!documentId) {
      if (mountedRef.current) {
        setLoading(false);
        setData(null);
      }
      return;
    }

    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);

    try {
      await waitForAuth();

      if (!mountedRef.current) return;

      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);

      if (mountedRef.current) {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setData(null);
        }
        setError(null);
        setLoading(false);
      }
    } catch (err) {
      console.error(`Error fetching document "${collectionName}/${documentId}":`, err.message);
      if (mountedRef.current) {
        setError(
          err.code === 'permission-denied'
            ? 'Permission denied. Please ensure you are logged in as an admin.'
            : err.message || 'Failed to load document.'
        );
        setLoading(false);
      }
    }
  }, [collectionName, documentId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchDocument();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchDocument, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return { data, loading, error, retry };
};

// =============================================================================
// FUNCTION: addDocument - Add a document to a collection
// =============================================================================

export const addDocument = async (collectionName, data) => {
  try {
    // Ensure auth is ready
    await waitForAuth();

    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: data.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error(`Error adding document to "${collectionName}":`, error.message);
    return {
      success: false,
      error: error.code === 'permission-denied'
        ? 'Permission denied. Please ensure you are logged in as an admin.'
        : error.message || 'Failed to add document.'
    };
  }
};

// =============================================================================
// FUNCTION: updateDocument - Update a document
// =============================================================================

export const updateDocument = async (collectionName, documentId, data) => {
  try {
    await waitForAuth();

    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error(`Error updating document "${collectionName}/${documentId}":`, error.message);
    return {
      success: false,
      error: error.code === 'permission-denied'
        ? 'Permission denied. Please ensure you are logged in as an admin.'
        : error.message || 'Failed to update document.'
    };
  }
};

// =============================================================================
// FUNCTION: deleteDocument - Delete a document
// =============================================================================

export const deleteDocument = async (collectionName, documentId) => {
  try {
    await waitForAuth();

    await deleteDoc(doc(db, collectionName, documentId));
    return { success: true };
  } catch (error) {
    console.error(`Error deleting document "${collectionName}/${documentId}":`, error.message);
    return {
      success: false,
      error: error.code === 'permission-denied'
        ? 'Permission denied. Please ensure you are logged in as an admin.'
        : error.message || 'Failed to delete document.'
    };
  }
};

// =============================================================================
// FUNCTION: deleteDocumentWithAsset - Delete document and remove Cloudinary asset
// =============================================================================

export const deleteDocumentWithAsset = async (collectionName, documentId, assetField = null) => {
  try {
    await waitForAuth();

    const docRef = doc(db, collectionName, documentId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return { success: false, error: 'Document not found' };

    const data = snap.data();
    // Determine asset value: explicit field -> image/src/images[0] heuristics
    let asset = null;
    if (assetField && data[assetField]) asset = data[assetField];
    else if (data.image) asset = data.image;
    else if (data.src) asset = data.src;
    else if (Array.isArray(data.images) && data.images.length > 0) asset = data.images[0];
    else if (data.logo) asset = data.logo;
    else if (data.favicon) asset = data.favicon;

    // If asset found, try to delete Cloudinary resource
    if (asset && import.meta.env.VITE_CLOUDINARY_DELETE_URL) {
      try {
        const publicId = getPublicId(asset) || null;
        const url = getImageUrl(asset) || null;
        const payload = publicId ? { public_id: publicId } : (url ? { url } : null);
        if (payload) await callDeleteEndpoint(payload);
      } catch (err) {
        console.warn('Failed to delete Cloudinary asset:', err);
      }
    }

    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting document with asset "${collectionName}/${documentId}":`, error.message);
    return {
      success: false,
      error: error.code === 'permission-denied'
        ? 'Permission denied. Please ensure you are logged in.'
        : error.message || 'Failed to delete.'
    };
  }
};

// =============================================================================
// FUNCTION: getDocuments - Get documents with custom query
// =============================================================================

export const getDocuments = async (collectionName, options = {}) => {
  try {
    await waitForAuth();

    let q = query(collection(db, collectionName));

    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
    }

    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    if (options.where) {
      const conditions = Array.isArray(options.where) ? options.where : [options.where];
      conditions.forEach(({ field, operator, value }) => {
        q = query(q, where(field, operator, value));
      });
    }

    const querySnapshot = await getDocs(q);
    return {
      success: true,
      data: querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };
  } catch (error) {
    console.error(`Error getting documents from "${collectionName}":`, error.message);
    return {
      success: false,
      error: error.code === 'permission-denied'
        ? 'Permission denied. Please ensure you are logged in as an admin.'
        : error.message || 'Failed to fetch documents.',
      data: []
    };
  }
};

// =============================================================================
// FUNCTION: getDocument - Get a single document
// =============================================================================

export const getDocument = async (collectionName, documentId) => {
  try {
    await waitForAuth();

    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Document not found', data: null };
  } catch (error) {
    console.error(`Error getting document "${collectionName}/${documentId}":`, error.message);
    return {
      success: false,
      error: error.code === 'permission-denied'
        ? 'Permission denied.'
        : error.message || 'Failed to fetch document.',
      data: null
    };
  }
};

export default {
  useCollection,
  useRealtimeCollection,
  useDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  deleteDocumentWithAsset,
  getDocuments,
  getDocument
};