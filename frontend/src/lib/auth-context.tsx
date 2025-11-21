// src/lib/auth-context.tsx
import { createContext, useContext, useEffect, useState } from "react"
import {
    AuthApi,
    type PublicUser,
    type UserStats,
    type Badge,
    type LoginResponse,
} from "@/lib/api"

type AuthCtx = {
    user: PublicUser | null
    stats: UserStats | null
    badges: Badge[]
    earnedBadges: Badge[]
    loading: boolean

    setUser: (u: PublicUser | null) => void
    setStats: (s: UserStats | null) => void
    refresh: () => Promise<void>
    logout: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    clearEarnedBadges: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<PublicUser | null>(null)
    const [stats, setStats] = useState<UserStats | null>(null)
    const [badges, setBadges] = useState<Badge[]>([])
    const [earnedBadges, setEarnedBadges] = useState<Badge[]>([])
    const [loading, setLoading] = useState(true)

    // On mount: just check "me" and set user.
    // (If you want stats/badges here too, we can later wire StatsApi + a /me that returns more.)
    useEffect(() => {
        ;(async () => {
            try {
                const { user } = await AuthApi.me()
                setUser(user ?? null)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const login = async (email: string, password: string) => {
        setLoading(true)
        try {
            const data: LoginResponse = await AuthApi.login(email, password)
            setUser(data.user)
            setStats(data.stats ?? null)
            setBadges(data.badges ?? [])
            setEarnedBadges(data.new_badges ?? [])
        } finally {
            setLoading(false)
        }
    }

    const refresh = async () => {
        try {
            const { user } = await AuthApi.me()
            setUser(user ?? null)
            // optional: fetch stats/badges here if you like
        } catch {
            setUser(null)
        }
    }

    const logout = async () => {
        try {
            await AuthApi.logout()
        } finally {
            setUser(null)
            setStats(null)
            setBadges([])
            setEarnedBadges([])
        }
    }

    const clearEarnedBadges = () => setEarnedBadges([])

    return (
        <Ctx.Provider
            value={{
                user,
                stats,
                badges,
                earnedBadges,
                loading,
                setUser,
                setStats,
                refresh,
                logout,
                login,
                clearEarnedBadges,
            }}
        >
            {children}
        </Ctx.Provider>
    )
}

export function useAuth() {
    const v = useContext(Ctx)
    if (!v) throw new Error("useAuth must be used inside <AuthProvider>")
    return v
}
