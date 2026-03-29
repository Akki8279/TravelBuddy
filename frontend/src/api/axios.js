import axios from "axios";

// ✅ Use environment variable (IMPORTANT for deployment)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://travelbuddy-backend-l8bu.onrender.com/api/v1",
});

// ✅ Attach token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle global errors (VERY IMPORTANT)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Auto logout if token expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
