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

//hook for scanner
export type HttpsResult = {
    url: string;
    is_https: boolean;
    redirects_to_https: boolean;
    security_issues: string[];
};

export type XssResult = {
    url: string;
    form_count: number;
    vulnerable_forms: { action: string; method: string }[];
};

export type SqliResult = {
    url: string;
    param_count: number;
    vulnerable_params: { name: string; payload: string }[];
};

export type ScanResult = {
    url: string;
    checks: {
        https?: HttpsResult;
        xss?: XssResult;
        sqli?: SqliResult;
    };
    errors: string[];
    duration_ms: number;
};

export type ScanCheck = "https" | "xss" | "sqli";

export const ScannerApi = {
    scan: (url: string, checks?: ScanCheck[]) =>
        api<ScanResult>("/api/scan", {
            method: "POST",
            body: JSON.stringify({ url, checks }),
        }),
};

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

//For QUIZ shite

export type QuizOption = { id: string; text: string }
export type QuizQuestionClient = { id: string; text: string; options: QuizOption[] }
export type QuizStartResp = {
    attempt_id: string
    quiz: { slug: string; title: string; questions: QuizQuestionClient[] }
}

export type AnswerResult = {
    correct: boolean
    correct_option_id: string
    your_answer_id: string
    explanation?: string | null
}

export const QuizApi = {
    start: (slug: string, limit = 10) =>
        api<QuizStartResp>("/api/quiz/start", {
            method: "POST",
            body: JSON.stringify({ slug, limit }),
        }),
    answer: (attemptId: string, questionId: string, answer: string) =>
        api<AnswerResult>("/api/quiz/answer", {
            method: "POST",
            body: JSON.stringify({ attempt_id: attemptId, question_id: questionId, answer }),
        }),
    submit: (attempt_id: string, answers: Record<string, string>) =>
        api<{ ok: true; score_pct: number; earned: number; stats?: UserStats }>("/api/quiz/submit", {
            method: "POST",
            body: JSON.stringify({ attempt_id, answers }),
        }),
}