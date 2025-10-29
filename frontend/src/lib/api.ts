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

//hook for handling authentication
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

export type UserStats = {
    days_logged_in: number
    last_login_date: string | null
    current_level: number
    total_xp: number
    xp_in_level: number
    xp_to_next: number
    quizzes_completed: number
    modules_completed: number
}

// hook for handling user stats
export const StatsApi = {
    touch: () => api<{ stats: UserStats }>("/api/user_dashboard/stats/touch", { method: "POST" }),
    get: () => api<{ stats: UserStats }>("/api/user_dashboard/stats"),

    earnXP: (amount: number) =>
        api<{ stats: UserStats }>("/api/user_dashboard/stats/earn_xp", {
            method: "POST",
            body: JSON.stringify({ amount }),
        }),
}

//defines type for the leaderboards
export type LeaderboardEntry = {
    rank: number
    user: { id: number; first_name: string; last_name: string }
    total_xp: number
    current_level: number
}

export type LeaderboardResponse = {
    entries: LeaderboardEntry[]
    limit: number
    offset: number
    total: number
    me: { rank: number; total_xp: number; current_level: number }
}

//hook for leaderboards, also sets the display limit to 5.
export const LeaderboardApi= {
    list: (limit = 5, offset = 0) =>
        api<LeaderboardResponse>(`/api/user_dashboard/leaderboard?limit=${limit}&offset=${offset}`),
}

//for user_items
export type Items = {
    user_id: number
    oxygen_level_amount: number
    oxygen_cannisters: number
    cap: number
    max_cannisters: number
}


export const ItemsApi = {
    items: () => api<Items>("/api/user_items/items"),
    gain: (amount: number) =>
        api<Items>("/api/user_items/items/gain-oxygen", {
            method: "POST",
            body: JSON.stringify({ amount }),
        }),
    use: () =>
        api<Items>("/api/user_items/items/use-cannister", {
            method: "POST",
        }),
}
