const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Helper to get auth token from localStorage
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("ideon_access_token");
  }
  return null;
};

// Generic fetch wrapper to handle auth and errors
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred.";
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorDetail;
    } catch {
      // If response is not JSON, ignore
    }
    
    if (typeof errorDetail !== "string") {
      errorDetail = JSON.stringify(errorDetail);
    }
    
    throw new Error(errorDetail);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  auth: {
    signup: (data: any) => fetchApi("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    login: (data: any) => fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  },
  users: {
    me: () => fetchApi("/users/me"),
    updateMe: (data: any) => fetchApi("/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    stats: () => fetchApi("/users/me/stats"),
  },
  startups: {
    create: (data: any) => fetchApi("/startups", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    list: () => fetchApi("/startups"),
    get: (id: string) => fetchApi(`/startups/${id}`),
    update: (id: string, data: any) => fetchApi(`/startups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchApi(`/startups/${id}`, {
      method: "DELETE",
    }),
  },
  analysis: {
    start: (startupId: string, data: any) => fetchApi(`/startups/${startupId}/analysis`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    getLatest: (startupId: string) => fetchApi(`/startups/${startupId}/analysis`),
    getSpecific: (startupId: string, runId: string) => fetchApi(`/startups/${startupId}/analysis/${runId}`),
  }
};
