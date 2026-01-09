const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const apiFetch = async (endpoint, options = {}) => {
  const headers =
    options.body instanceof FormData
      ? options.headers || {}
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include", // important for cookies/JWT
  });

  // Optional but recommended
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error ||errorData.message || "API request failed");
  }

  return response.json();
};

export default apiFetch;
