import { createContext, useState } from "react";
import axiosInstance from "../components/hooks/axiosInstance";
import { useEffect } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  // refresh token function
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return Promise.reject("no refresh token");
    try {
      const res = await axiosInstance.post("/account/RefreshToken", {
        AccessToken: accessToken,
        RefreshToken: refreshToken,
      });
      if (res.data.Success && res.data.Token) {
        setAccessToken(res.data.Token);
        localStorage.setItem("accessToken", res.data.Token);
        return res.data.Token;
      } else {
        logOut();
        return Promise.reject("refresh failed");
      }
    } catch (err) {
      logOut();
      return Promise.reject("refresh failed");
    }
  };

  //  axios response interceptor for 401 errors
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshAccessToken();
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = (userData, token, refreshToken) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  const logOut = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const authInfo = {
    user,
    accessToken,
    logOut,
    login,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
