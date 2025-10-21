// src/lib/api.ts
export type PublicUser = { id: number; first_name: string; last_name: string; email: string }

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(path, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(init.headers || {}) },
        ...init,
    })

    const text = await res.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch (_) {}

    if (!res.ok) {
        console.error(`[API] ${init.method || "GET"} ${path} -> ${res.status}`, text.slice(0, 200))
        throw new Error(data?.error || `HTTP ${res.status}`)
    }
    return data as T
}

export const AuthApi = {
    login: (email: string, password: string) =>
        api<{ user: PublicUser }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    register: (first: string, last: string, email: string, age: number, password: string) =>
        api<{ user: PublicUser }>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ first_name: first, last_name: last, email, age, password }),
        }),

    me: () => api<{ user: PublicUser | null }>("/api/auth/me"),

    logout: async () => {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        })

        if (!res.ok && res.status !== 204) {
            const text = await res.text()
            throw new Error(text || `HTTP ${res.status}`)
        }
    },

}
