import { useCallback } from 'react';
import sessionUtils from '../utils/sessionUtils';

/**
 * Custom hook для API запросов с автоматическим управлением токеном сессии
 * @returns {Object} 
 */
export const useSessionApi = () => {
  const getAuthHeaders = useCallback(() => {
    const session = sessionUtils.getActiveSession();
    if (session) {
      return {
        Authorization: `Bearer ${session.token}`,
      };
    }
    return {};
  }, []);

  const withSessionUpdate = useCallback((apiCall) => {
    return async (...args) => {
      try {
        const result = await apiCall(...args);
        sessionUtils.updateSessionTimestamp();
        return result;
      } catch (error) {
        if (error.response?.status === 401) {
          sessionUtils.clearSession();
        }
        throw error;
      }
    };
  }, []);

  return {
    getAuthHeaders,
    withSessionUpdate,
  };
};

export default useSessionApi;
