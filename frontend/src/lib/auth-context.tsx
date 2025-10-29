// src/lib/auth-context.tsx
import { createContext, useContext, useEffect, useState } from "react"
import { AuthApi, type PublicUser } from "@/lib/api"

type AuthCtx = {
    user: PublicUser | null
    loading: boolean
    setUser: (u: PublicUser | null) => void
    refresh: () => Promise<void>
    logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<PublicUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            try {
                const { user } = await AuthApi.me()
                setUser(user ?? null)
            } catch (e) {

                setUser(null)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const refresh = async () => {
        try {
            const { user } = await AuthApi.me()
            setUser(user ?? null)
        } catch {
            setUser(null)
        }
    }

    const logout = async () => {
        try {
            await AuthApi.logout()   // your logout already avoids parsing 204
        } finally {
            setUser(null)
        }
    }
    return (
        <Ctx.Provider value={{ user, loading, setUser, refresh, logout }}>
            {children}
        </Ctx.Provider>
    )
}
export function useAuth() {
    const v = useContext(Ctx)
    if (!v) throw new Error("useAuth must be used inside <AuthProvider>")
    return v
}
