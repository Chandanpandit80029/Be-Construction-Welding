import { useState, useCallback, useRef } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * useToast - Simple toast notification hook
 * 
 * Returns:
 * - toast: { message, type, visible }
 * - showToast: (message, type) => void  (type: 'success' | 'error')
 * - ToastComponent: renders the toast UI
 */
export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type, visible: true });
    timerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  const ToastComponent = useCallback(() => {
    if (!toast.visible) return null;

    const isSuccess = toast.type === 'success';
    return (
      <div className={`admin-toast ${isSuccess ? 'admin-toast-success' : 'admin-toast-error'}`}>
        {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />}
        <span>{toast.message}</span>
      </div>
    );
  }, [toast]);

  return { toast, showToast, ToastComponent };
};

export default useToast;