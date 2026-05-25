import axios from "axios";

const localApiBaseUrl = "http://localhost:5000/api";
const hostedApiBaseUrl =
  "https://construction-management-system-o5vj.onrender.com/api";

const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (isLocalHost ? localApiBaseUrl : hostedApiBaseUrl),
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const technicalMessage =
      error.response?.data?.message ||
      error.message ||
      "";

    const isConnectionError =
      technicalMessage.includes("getaddrinfo") ||
      technicalMessage.includes("EAI_AGAIN") ||
      technicalMessage.includes("ECONNREFUSED") ||
      technicalMessage.includes("ECONNRESET") ||
      technicalMessage.includes("timeout") ||
      technicalMessage.includes("pooler.supabase.com") ||
      technicalMessage.includes("supabase.com");

    if (isConnectionError) {
      const friendlyMessage =
        "Could not complete this request. Please try again.";

      error.isConnectionError = true;

      if (error.response?.data) {
        error.response.data.message = friendlyMessage;
      } else {
        error.message = friendlyMessage;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
