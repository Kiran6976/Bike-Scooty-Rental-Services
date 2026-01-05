const API_BASE_URL = process.env.REACT_APP_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const headers =
    options.body instanceof FormData
      ? options.headers || {}
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        };

  const response = await apiFetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

export default apiFetch;