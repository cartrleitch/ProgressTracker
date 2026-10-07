export async function register(email: string, password: string) {
  const r = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error("Registration failed");
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