"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/ui/header"
import { ParallaxStarsbackground } from "@/components/ui/night_sky"
import {  Flame, BookOpen, Milk } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { StatsApi, type UserStats, type LeaderboardEntry, LeaderboardApi,ItemsApi, type Items } from "@/lib/api"
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
    const [items, setItems] = useState<Items | null>(null)

    const displayName =
        user?.first_name ??
        (user as any)?.firstName ??
        user?.email?.split("@")[0] ??
        "Cybernaut"


    // mock badge data
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

    //Just havin g this for oxygen test. Remove later
    const handleOxygenIncrease = async () => {
        try {
            const it = await ItemsApi.gain(10) // +10%
            setItems(it)
        } catch (e: any) {
            setError(e?.message || "Failed to gain oxygen")
        }
    }

    const handleLoseCanister = async () => {
        try {
            const it = await ItemsApi.use()
            setItems(it)
        } catch (e: any) {
            setError(e?.message || "No canisters to use")
        }
    }


    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                if (!user) { navigate("/auth/login"); return }

                const [touchRes, lb, it] = await Promise.all([
                    StatsApi.touch(),
                    LeaderboardApi.list(5, 0),  // { entries, me }
                    ItemsApi.items(),              // items
                ])
                if (!mounted) return
                setStats(touchRes.stats)
                setBoard(lb.entries)
                setMyRank(lb.me.rank)
                setItems(it)
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

    const oxygenLevel   = items?.oxygen_level_amount ?? 0
    const canisters     = items?.oxygen_cannisters ?? 0
    const maxCanisters  = items?.max_cannisters ?? 4

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
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Welcome Section (unchanged) */}
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Welcome back, <span className="text-[#DBA64A]">{displayName}</span>!
                            </h1>
                            <p className="text-gray-300">Keep pushing your cybersecurity journey forward</p>
                        </div>

                        {/* Cannisters summary */}
                        <div className="flex items-center space-x-6">
                            <Button className="bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white font-semibold px-6 py-2 rounded-lg flex items-center space-x-2">
                                <BookOpen className="w-5 h-5" />
                                <span>Start Quiz</span>
                            </Button>
                            <div className="flex items-center space-x-3 bg-[#2F4B7A]/30 border border-[#4A668E]/50 rounded-lg px-4 py-3 backdrop-blur-sm">
                                <div className="flex space-x-2">
                                    {[...Array(maxCanisters)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-8 h-10 rounded-md flex items-center justify-center transition-all ${
                                                i < canisters
                                                    ? "bg-gradient-to-b from-[#4A668E] to-[#2F4B7A] border border-[#DBA64A]/60"
                                                    : "bg-gray-600/30 border border-gray-500/30"
                                            }`}
                                        >
                                            <Milk className={`w-5 h-5 ${i < canisters ? "text-white" : "text-gray-500"}`} />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-white font-semibold ml-2">
            {canisters}/{maxCanisters}
          </span>
                            </div>
                        </div>
                    </div>

                    {/* 80/20 layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* LEFT: 80% column */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* XP Bar */}
                            <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">Level {stats.current_level}</h2>
                                            <p className="text-gray-300 text-sm">Total XP: {stats.total_xp.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#DBA64A] font-semibold">
                                                {stats.xp_in_level.toLocaleString()} / {stats.xp_to_next.toLocaleString()} XP
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-[#223150] rounded-full h-4 overflow-hidden border border-[#4A668E]/50">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#C92337] to-[#E16237] transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Button
                                            variant="outline"
                                            className="border-[#4A668E]/50 text-white"
                                            onClick={async () => {
                                                const { stats: s } = await StatsApi.earnXP(50)
                                                setStats(s)
                                            }}
                                        >
                                            For testing, so remember to remove it..+50 XP
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Streak + Badges side-by-side */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Streak */}
                                <Card className="flex items-center justify-center bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">
                                    <CardContent className="p-3">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E16237] to-[#DBA64A] flex items-center justify-center animate-pulse-glow">
                                                <Flame className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-gray-300 text-2xl">Login Streak</p>
                                                <p className="text-4xl font-bold text-[#DBA64A]">{stats.days_logged_in}</p>
                                                <p className="text-gray-400 text-xs">days in a row</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Badges */}
                                <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">
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
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                                        style={{
                                                            backgroundColor:
                                                                entry.rank === 1 ? "#DBA64A" :
                                                                    entry.rank === 2 ? "#E16237" :
                                                                        entry.rank === 3 ? "#C92337" : "#4A668E"
                                                        }}
                                                    >
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
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT: 20% column (sticky O₂ bar) */}
                        <aside className="lg:col-span-1">
                            <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm sticky top-6">
                                <CardContent className="p-4 h-full flex flex-col">
                                    <h3 className="text-sm font-semibold text-white mb-4 text-center">O₂ Level</h3>
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <div className="h-64 w-8 bg-[#223150] rounded-full overflow-hidden border-2 border-[#4A668E]/50 flex flex-col-reverse">
                                            <div
                                                className="w-full bg-gradient-to-t from-[#EA4354] to-[#3B99F1] transition-all duration-300"
                                                style={{ height: `${oxygenLevel}%` }}
                                            />
                                        </div>
                                        <p className="text-white font-bold mt-4 text-lg">{oxygenLevel}%</p>
                                    </div>

                                    {/*TEST BUTTONS!!!  REMOVE LATER!!!!!!!!!*/}
                                    <div className="flex flex-col space-y-2 mt-4">
                                        <Button
                                            onClick={handleOxygenIncrease}
                                            className="bg-[#4A668E] hover:bg-[#DBA64A] text-white text-xs py-1"
                                            disabled={!items}
                                        >
                                            +10%
                                        </Button>
                                        <Button
                                            onClick={handleLoseCanister}
                                            className="bg-[#C92337] hover:bg-[#E16237] text-white text-xs py-1"
                                            disabled={!items || (items?.oxygen_cannisters ?? 0) === 0}
                                        >
                                            -Canister
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </main>

            <ILoveSmellingFeet/>
    </div>
    )
}
