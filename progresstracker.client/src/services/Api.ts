export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export async function apiFetch(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  return response;
}
