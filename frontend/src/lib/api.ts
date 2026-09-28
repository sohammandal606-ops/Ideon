import { supabase } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_PREFIX = "/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  let session;
  try {
    const result = await supabase.auth.getSession();
    if (result.error) {
      throw new Error(`Unable to read your sign-in session: ${result.error.message}`);
    }
    session = result.data.session;
  } catch (error) {
    if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
      throw new Error(
        "Could not reach Supabase Auth to check your sign-in session. Check your connection, then sign in again.",
      );
    }
    throw error;
  }

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

  const requestUrl = `${versionedBaseUrl}${normalizedEndpoint}`;
  let response: Response;
  try {
    response = await fetch(requestUrl, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
      throw new Error(
        `Could not reach the API at ${new URL(requestUrl).origin}. The service may be unavailable, or the browser may be blocking the request (CORS).`,
      );
    }
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || `API error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  return response.json();
}
