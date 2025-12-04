export const sessionUtils = {
  saveSession: (token, email, user = null, rememberMe = false) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    localStorage.setItem("sessionTimestamp", Date.now().toString());
    
    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("sessionDuration", (30 * 24 * 60 * 60 * 1000).toString()); // 30 дней
    } else {
      localStorage.setItem("rememberMe", "false");
      localStorage.setItem("sessionDuration", (24 * 60 * 60 * 1000).toString()); // 24 часа
    }
  },
  getActiveSession: () => {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const sessionTimestamp = localStorage.getItem("sessionTimestamp");
    const sessionDuration = parseInt(localStorage.getItem("sessionDuration")) || 24 * 60 * 60 * 1000;

    if (!token || !email || !sessionTimestamp) {
      return null;
    }

    const elapsedTime = Date.now() - parseInt(sessionTimestamp);

    if (elapsedTime > sessionDuration) {
      sessionUtils.clearSession();
      return null;
    }

    return {
      token,
      email,
      isValid: true,
      remainingTime: sessionDuration - elapsedTime,
    };
  },

  updateSessionTimestamp: () => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      localStorage.setItem("sessionTimestamp", Date.now().toString());
    }
  },

  isAuthenticated: () => {
    const session = sessionUtils.getActiveSession();
    return session !== null;
  },

  getToken: () => {
    const session = sessionUtils.getActiveSession();
    return session ? session.token : null;
  },

  getEmail: () => {
    const session = sessionUtils.getActiveSession();
    return session ? session.email : null;
  },

  clearSession: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("sessionTimestamp");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("sessionDuration");
    localStorage.removeItem("user");
  },

  getRemainingTime: () => {
    const session = sessionUtils.getActiveSession();
    if (!session) return 0;
    return Math.floor(session.remainingTime / 1000 / 60);
  },
};

export default sessionUtils;
