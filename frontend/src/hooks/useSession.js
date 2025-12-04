import { useEffect, useState } from 'react';
import sessionUtils from '../utils/sessionUtils';

/**
 * Custom hook для управления сессией
 * @returns {Object} Объект с информацией о сессии
 */
export const useSession = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const activeSession = sessionUtils.getActiveSession();
      setSession(activeSession);
      
      if (activeSession) {
        setRemainingTime(Math.floor(activeSession.remainingTime / 1000 / 60)); // в минутах
      } else {
        setRemainingTime(null);
      }
    };

    checkSession();
    setIsLoading(false);

    const handleActivity = () => {
      sessionUtils.updateSessionTimestamp();
      checkSession();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keypress', handleActivity);

    const interval = setInterval(() => {
      checkSession();
    }, 60000);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      clearInterval(interval);
    };
  }, []);

  const logout = () => {
    sessionUtils.clearSession();
    setSession(null);
    setRemainingTime(null);
  };

  return {
    isAuthenticated: session !== null,
    token: session?.token || null,
    email: session?.email || null,
    remainingTime,
    session,
    isLoading,
    logout,
  };
};

export default useSession;
