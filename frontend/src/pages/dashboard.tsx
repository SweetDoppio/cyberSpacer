"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ParallaxStarsbackground } from "@/components/ui/night_sky"
import { useAuth } from "@/lib/auth-context"
import { StatsApi, type UserStats, type LeaderboardEntry, LeaderboardApi } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import {ILoveSmellingFeet} from "@/components/ui/footer";



export function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [board, setBoard] = useState<LeaderboardEntry[]>([])
    const [stats, setStats] = useState<UserStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [myRank, setMyRank] = useState<number | null>(null)

    const displayName =
        user?.first_name ??
        (user as any)?.firstName ??
        user?.email?.split("@")[0] ??
        "Cybernaut"

    // Mock user data
    const userMock = {
        badges: [
            { name: "First Stepss", icon: "🚀", color: "#C92337" },
            { name: "Network Master", icon: "🌐", color: "#E16237" },
            { name: "Ethical Hacker", icon: "🔓", color: "#DBA64A" },
            { name: "Threat Hunter", icon: "🎯", color: "#4A668E" },
            { name: "Security Expert", icon: "🛡️", color: "#2F4B7A" },
            { name: "Streak Champion", icon: "🔥", color: "#C92337" },
        ],
    }


    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                if (!user) { navigate("/auth/login"); return }

                // Update streak + get stats
                const { stats } = await StatsApi.touch()
                if (!mounted) return
                setStats(stats)

                // Load leaderboard (top 10)
                const lb = await LeaderboardApi.list(5, 0)
                if (!mounted) return
                setBoard(lb.entries)
                setMyRank(lb.me.rank)
            } catch (e: any) {
                setError(e?.message || "Failed to load dashboard")
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [user, navigate])

    if (loading) {
        return (
            <div className="min-h-screen bg-black">
                <Header />
                <div className="p-8 text-white">Loading your dashboard…</div>
            </div>
        )
    }
    if (error) {
        return (
            <div className="min-h-screen bg-black">
                <Header />
                <div className="p-8 text-red-300">{error}</div>
            </div>
        )
    }
    if (!stats) return null

    const pct = Math.min(100, Math.round((stats.xp_in_level / Math.max(1, stats.xp_to_next)) * 100))

    return (
        <div className="min-h-screen bg-black circuit-pattern relative overflow-hidden">
            <ParallaxStarsbackground
                starCount={200}
                glowCount={30}
                strength={200}
                smoothing={0.1}
                friction={0.95}
                className="z-0"
            />

            <Header />

            {/* Main Content */}
            <main className="relative z-10 px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Welcome back, <span className="text-[#DBA64A]">{displayName}</span>!
                        </h1>
                        <p className="text-gray-300">Keep pushing your cybersecurity journey forward</p>
                    </div>

                    {/* XP Bar Section */}
                    <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Level {stats.current_level}</h2>
                                    <p className="text-gray-300 text-sm">Total XP: {stats.total_xp.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#DBA64A] font-semibold">
                                        {stats.xp_in_level.toLocaleString()} / {stats.xp_to_next.toLocaleString()} XP                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-[#223150] rounded-full h-4 overflow-hidden border border-[#4A668E]/50">
                                <div
                                    className="h-full bg-gradient-to-r from-[#C92337] to-[#E16237] transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    className="border-[#4A668E]/50 text-white"
                                    onClick={async () => {
                                        const { stats: s } = await StatsApi.earnXP(50)
                                        setStats(s)
                                    }}
                                >
                                    +50 XP
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-[#4A668E]/50 text-white"
                                    onClick={async () => {
                                        const { stats: s } = await StatsApi.earnXP(250)
                                        setStats(s)
                                    }}
                                >
                                    +250 XP
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    {/*<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">*/}
                    {/*    {stats.map((stat, index) => (*/}
                    {/*        <Card key={index} className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">*/}
                    {/*            <CardContent className="p-6">*/}
                    {/*                <div className="flex items-center justify-between mb-4">*/}
                    {/*                    <div*/}
                    {/*                        className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse-glow"*/}
                    {/*                        style={{ backgroundColor: stat.color }}*/}
                    {/*                    >*/}
                    {/*                        <stat.icon className="w-6 h-6 text-white" />*/}
                    {/*                    </div>*/}
                    {/*                    <p className="text-3xl font-bold text-white">{stat.value}</p>*/}
                    {/*                </div>*/}
                    {/*                <p className="text-gray-300 text-sm">{stat.label}</p>*/}
                    {/*            </CardContent>*/}
                    {/*        </Card>*/}
                    {/*    ))}*/}
                    {/*</div>*/}

                    {/* Login Streak & Badges Section */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
                        {/* Login Streak */}
                        <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm lg:col-span-1">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E16237] to-[#DBA64A] flex items-center justify-center animate-pulse-glow">
                                        <Flame className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-300 text-sm">Login Streak</p>
                                        <p className="text-4xl font-bold text-[#DBA64A]">{stats.days_logged_in}</p>
                                        <p className="text-gray-400 text-xs">days in a row</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Badges */}
                        <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm lg:col-span-2">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">Achievements</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {userMock.badges.map((badge, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center justify-center p-4 rounded-lg border border-[#4A668E]/50 hover:bg-[#2F4B7A]/50 transition-all"
                                            style={{ borderColor: badge.color + "40" }}
                                        >
                                            <div className="text-3xl mb-2">{badge.icon}</div>
                                            <p className="text-xs text-gray-300 text-center">{badge.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Leaderboard */}
                    <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-semibold text-white">Global Leaderboard</h3>
                                {myRank != null && <div className="text-[#DBA64A]">Your rank: <b>#{myRank}</b></div>}
                            </div>

                            <div className="space-y-3">
                                {board.map((entry) => (
                                    <div
                                        key={entry.user.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                                            entry.user.id === user?.id
                                                ? "bg-[#2F4B7A]/60 border-[#DBA64A]/50"
                                                : "bg-[#223150]/40 border-[#4A668E]/30 hover:bg-[#2F4B7A]/40"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                                 style={{ backgroundColor: entry.rank === 1 ? "#DBA64A" : entry.rank === 2 ? "#E16237" : entry.rank === 3 ? "#C92337" : "#4A668E" }}>
                                                {entry.rank}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">
                                                    {entry.user.first_name} {entry.user.last_name}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Level {entry.current_level} • {entry.total_xp.toLocaleString()} XP
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Flame className="w-4 h-4 text-[#E16237]" />
                                            {/* Optional: if you later return streak per user, show it here */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        <ILoveSmellingFeet/>
        </div>
    )
}
