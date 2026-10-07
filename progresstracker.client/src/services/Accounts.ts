export type User = { email: string; isEmailConfirmed: boolean };

async function readError(r: Response, fallback: string) {
  try {
    const data = await r.json();
    if (data?.errors)
      return Object.values<string[]>(data.errors).flat().join(" ");
    if (data?.detail) return data.detail as string;
  } catch {
    /* ignore */
  }
  return fallback;
}

export async function register(email: string, password: string) {
  const r = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error(await readError(r, "Registration failed"));
}

export async function login(email: string, password: string) {
  const r = await fetch("/api/auth/login?useCookies=true", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error("Invalid credentials");
}

export const logout = () => fetch("/api/auth/logout", { method: "POST" });

export async function getCurrentUser() {
  const r = await fetch("/api/auth/manage/info");
  return r.ok ? await r.json() : null;
}
