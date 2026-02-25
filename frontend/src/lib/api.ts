// API base URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Reads the CSRF token from the browser cookie.
 * Django sets a cookie named 'csrftoken' on session-authenticated requests.
 */
function getCSRFToken(): string {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : "";
}

/**
 * Ensures the CSRF cookie is set by calling the backend CSRF endpoint.
 * This is needed because Django won't set the cookie until a view
 * decorated with @ensure_csrf_cookie is accessed.
 */
let csrfReady = false;
async function ensureCSRFCookie(): Promise<void> {
    if (csrfReady && getCSRFToken()) return;
    try {
        await fetch(`${API_URL}/api/auth/csrf/`, {
            credentials: "include",
        });
        csrfReady = true;
    } catch {
        // Silently fail — the POST will fail with 403 and we handle that
    }
}

/**
 * Returns the full URL for a media/image path from the backend.
 * Handles both relative and absolute URLs.
 */
export function getMediaUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Methods that require CSRF protection
const UNSAFE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

interface ApiOptions extends Omit<RequestInit, "body"> {
    body?: Record<string, unknown> | FormData;
}

/**
 * Core fetch wrapper for all API calls.
 * - Automatically includes credentials (session cookie)
 * - Attaches CSRF token for unsafe methods
 * - Handles both JSON and FormData bodies
 */
export async function api<T = unknown>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const { body, headers: customHeaders, method = "GET", ...rest } = options;

    const headers: Record<string, string> = {
        ...(customHeaders as Record<string, string>),
    };

    // Ensure CSRF cookie is set before unsafe requests
    if (UNSAFE_METHODS.includes(method.toUpperCase())) {
        await ensureCSRFCookie();
        headers["X-CSRFToken"] = getCSRFToken();
    }

    let fetchBody: BodyInit | undefined;

    if (body instanceof FormData) {
        // Let the browser set the correct multipart Content-Type with boundary
        fetchBody = body;
    } else if (body) {
        headers["Content-Type"] = "application/json";
        fetchBody = JSON.stringify(body);
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: fetchBody,
        credentials: "include", // Always send session cookie
        ...rest,
    });

    // Handle 204 No Content (e.g., DELETE)
    if (res.status === 204) {
        return undefined as T;
    }

    // Handle errors
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(
            (errorData as Record<string, string>).error ||
            (errorData as Record<string, string>).detail ||
            `Request failed with status ${res.status}`
        );
        (error as ApiError).status = res.status;
        (error as ApiError).data = errorData;
        throw error;
    }

    return res.json();
}

export interface ApiError extends Error {
    status: number;
    data: Record<string, unknown>;
}

// =====================
// AUTH API
// =====================

export interface User {
    id: number;
    username: string;
}

export interface AuthResponse {
    message: string;
    user: User;
}

export async function registerUser(
    username: string,
    email: string,
    password: string
): Promise<AuthResponse> {
    return api<AuthResponse>("/api/auth/register/", {
        method: "POST",
        body: { username, email, password },
    });
}

export async function loginUser(
    username: string,
    password: string
): Promise<AuthResponse> {
    return api<AuthResponse>("/api/auth/login/", {
        method: "POST",
        body: { username, password },
    });
}

export async function logoutUser(): Promise<{ message: string }> {
    return api<{ message: string }>("/api/auth/logout/", {
        method: "POST",
    });
}

// =====================
// TWEETS API
// =====================

// Individual image attached to a tweet (from TweetImage model)
export interface TweetImage {
    id: number;
    image: string;          // URL or relative path to the image
    created_at: string;
}

export interface Tweet {
    id: number;
    user: string;
    text: string;
    images?: TweetImage[];  // NEW: array of attached images
    image?: string | null;  // LEGACY: single image field (kept for backward compat)
    created_at: string;
}

export async function getTweets(): Promise<Tweet[]> {
    return api<Tweet[]>("/api/tweets/");
}

export async function getTweet(id: number): Promise<Tweet> {
    return api<Tweet>(`/api/tweets/${id}/`);
}

export async function createTweet(formData: FormData): Promise<Tweet> {
    return api<Tweet>("/api/tweets/", {
        method: "POST",
        body: formData,
    });
}

export async function updateTweet(
    id: number,
    formData: FormData
): Promise<Tweet> {
    return api<Tweet>(`/api/tweets/${id}/`, {
        method: "PUT",
        body: formData,
    });
}

export async function deleteTweet(id: number): Promise<void> {
    return api<void>(`/api/tweets/${id}/`, {
        method: "DELETE",
    });
}

// =====================
// PROFILE API
// =====================

export interface Profile {
    id: number;
    username: string;
    email?: string;
    bio: string;
    avatar: string | null;
    created_at: string;
    updated_at?: string;
    tweets?: Tweet[];
    tweet_count?: number;
    follower_count?: number;    // NEW
    following_count?: number;   // NEW
    is_following?: boolean | null; // NEW (null for own profile)
}

export async function getMyProfile(): Promise<Profile> {
    return api<Profile>("/api/profile/me/");
}

export async function getPublicProfile(username: string): Promise<Profile> {
    return api<Profile>(`/api/profile/${username}/`);
}

export async function updateMyProfile(formData: FormData): Promise<Profile> {
    return api<Profile>("/api/profile/me/", {
        method: "PATCH",
        body: formData,
    });
}

/**
 * Toggles follow/unfollow for a user.
 */
export async function toggleFollow(username: string): Promise<{
    status: string;
    is_following: boolean;
    follower_count: number;
}> {
    return api(`/api/profile/${username}/follow/`, {
        method: "POST",
    });
}
