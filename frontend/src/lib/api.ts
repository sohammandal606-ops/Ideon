import { supabase } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_PREFIX = "/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const baseUrl = API_URL.replace(/\/+$/, "");
  const versionedBaseUrl = baseUrl.endsWith(API_PREFIX)
    ? baseUrl
    : `${baseUrl}${API_PREFIX}`;
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(`${versionedBaseUrl}${normalizedEndpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || `API error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
}
