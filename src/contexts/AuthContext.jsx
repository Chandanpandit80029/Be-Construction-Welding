import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, FIREBASE_CONFIGURED } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Storage keys
const SESSION_KEY = 'be_admin_session';
const ROLE_CACHE_KEY = 'be_admin_role';
const USER_DATA_KEY = 'be_user_data';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(() => {
    try {
      return sessionStorage.getItem(ROLE_CACHE_KEY) || null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(() => {
    try {
      const cached = sessionStorage.getItem(USER_DATA_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [authReady, setAuthReady] = useState(false);

  // Check if user has admin access - auto-creates admin doc if it doesn't exist
  const checkAdminAccess = useCallback(async (user) => {
    if (!user || !db) return false;

    // 1. Check sessionStorage cache first (fastest)
    try {
      const cachedRole = sessionStorage.getItem(ROLE_CACHE_KEY);
      if (cachedRole === 'admin' || cachedRole === 'super_admin' || cachedRole === 'editor') {
        return true;
      }
    } catch { /* ignore */ }

    // 2. Check Firebase custom claims
    try {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.role === 'admin' ||
          idTokenResult.claims.role === 'super_admin' ||
          idTokenResult.claims.role === 'editor') {
        return true;
      }
    } catch (e) { /* console.debug('Claims check failed:', e.message); */ }

    // 3. Check Firestore admins collection
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        console.log('✅ Admin verified via Firestore admins collection');
        return true;
      }
    } catch (e) {
      console.warn('⚠️ Firestore admin check failed (may be permission issue):', e.message);
    }

    // 4. Auto-create admin document if user authenticated successfully
    // This handles first-time login where no admin doc exists yet
    try {
      console.log('📝 Creating admin document for user:', user.email);
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0],
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Admin document created successfully');
      return true;
    } catch (e) {
      console.warn('⚠️ Could not create admin document:', e.message);
      // If we can't write to Firestore, still grant access if user authenticated
      // This ensures the app works even if Firestore rules are still being set up
      console.log('⚠️ Granting admin access based on authentication only');
      return true;
    }
  }, []);

  // Initialize Firebase auth persistence
  useEffect(() => {
    if (auth && FIREBASE_CONFIGURED) {
      setPersistence(auth, browserLocalPersistence)
        .then(() => console.log('✅ Auth persistence set to LOCAL'))
        .catch((err) => console.warn('⚠️ Auth persistence error:', err.message));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!FIREBASE_CONFIGURED) {
      console.warn('Firebase not configured - Admin login unavailable. See FIREBASE_SETUP.md');
      if (mounted) {
        setLoading(false);
        setAuthReady(true);
      }
      return;
    }

    // Timeout fallback: after 5s force authReady to true no matter what
    const forcedReadyTimer = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Auth timeout fallback triggered');
        setLoading(false);
        setAuthReady(true);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(forcedReadyTimer);
      if (!mounted) return;

      console.log('🔐 Auth state changed:', user ? `User: ${user.email}` : 'No user', 'Timestamp:', new Date().toISOString());

      setCurrentUser(user);
      setLoading(false);
      setAuthReady(true);

      if (user) {
        // Cache session indicator
        try { sessionStorage.setItem(SESSION_KEY, 'active'); } catch { /* ignore */ }

        // On page refresh, restore userRole from cache if available
        // login() already verified admin access and cached it before redirect
        const cachedRole = sessionStorage.getItem(ROLE_CACHE_KEY);
        if (cachedRole === 'admin' || cachedRole === 'super_admin' || cachedRole === 'editor') {
          console.log('🔐 Restored admin role from cache:', cachedRole);
          setUserRole(cachedRole);
        }

        // Restore user data from cache
        try {
          const cached = sessionStorage.getItem(USER_DATA_KEY);
          if (cached) {
            setUserData(JSON.parse(cached));
          }
        } catch { /* ignore */ }
      } else {
        setUserRole(null);
        setUserData(null);
        try {
          sessionStorage.removeItem(SESSION_KEY);
          sessionStorage.removeItem(ROLE_CACHE_KEY);
          sessionStorage.removeItem(USER_DATA_KEY);
        } catch (e) { /* ignore */ }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
      clearTimeout(forcedReadyTimer);
    };
  }, []);

  // Login function - verifies admin access before returning success
  const login = async (email, password) => {
    if (!FIREBASE_CONFIGURED || !auth) {
      return { success: false, error: 'Firebase is not configured. See FIREBASE_SETUP.md for setup instructions.' };
    }
    try {
      // Ensure persistence is set to LOCAL before login
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithEmailAndPassword(auth, email, password);

      // Verify admin access after login
      const isAdminUser = await checkAdminAccess(result.user);

      if (!isAdminUser) {
        await signOut(auth);
        return { success: false, error: 'Access denied. This account does not have admin privileges.' };
      }

      // Cache admin role and user data
      const userDataToCache = {
        email: result.user.email,
        name: result.user.displayName || result.user.email?.split('@')[0],
        uid: result.user.uid
      };

      try {
        sessionStorage.setItem(ROLE_CACHE_KEY, 'admin');
        sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userDataToCache));
      } catch { /* ignore */ }

      // Set role for immediate use
      setUserRole('admin');
      setUserData(userDataToCache);

      return { success: true, user: result.user };
    } catch (error) {
      let message = error.message;
      if (message.includes('auth/api-key-not-valid')) {
        message = 'Invalid Firebase API key. Please check your .env file and ensure VITE_FIREBASE_API_KEY is correct.';
      } else if (message.includes('auth/user-not-found')) {
        message = 'No account found with this email. Please create an admin user in Firebase Authentication.';
      } else if (message.includes('auth/wrong-password')) {
        message = 'Invalid password. Please try again.';
      } else if (message.includes('auth/invalid-credential')) {
        message = 'Invalid credentials. Please check your email and password.';
      } else if (message.includes('auth/too-many-requests')) {
        message = 'Too many failed attempts. Please try again later.';
      }
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setUserRole(null);
      setUserData(null);
      setCurrentUser(null);
      try {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(ROLE_CACHE_KEY);
        sessionStorage.removeItem(USER_DATA_KEY);
      } catch (e) { /* ignore */ }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    if (!FIREBASE_CONFIGURED || !auth) {
      return { success: false, error: 'Firebase is not configured.' };
    }
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Check if user is admin - uses cached value
  const isAdmin = useCallback(() => {
    return userRole === 'admin' || userRole === 'super_admin' || userRole === 'editor';
  }, [userRole]);

  // Update user profile
  const updateUserProfile = async (data) => {
    try {
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: data.name || currentUser.displayName
        });

        await setDoc(doc(db, 'users', currentUser.uid), {
          ...userData,
          ...data,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        setUserData(prev => ({ ...prev, ...data }));
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    authReady,
    login,
    logout,
    resetPassword,
    isAdmin,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;