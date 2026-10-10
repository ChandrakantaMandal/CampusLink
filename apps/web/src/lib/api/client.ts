import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    const enriched = new Error(message) as Error & {
      status?: number;
      fieldErrors?: Record<string, string[]>;
    };

    enriched.status = error.response?.status;
    enriched.fieldErrors = error.response?.data?.errors?.fieldErrors;

    return Promise.reject(enriched);
  },
);
