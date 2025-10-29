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

    // displays logged in first_namee
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

    //  variables for canisters and  02 levels
    const oxygenLevel   = items?.oxygen_level_amount ?? 0
    const canisters     = items?.oxygen_cannisters ?? 0
    const maxCanisters  = items?.max_cannisters ?? 4
    // will check to see if user has max cannisters, if state if true, then disable quiz button
    const isO2Maxed      = canisters >= maxCanisters
    // checker to see if streak has been reset or just started for new user
    const isStreakDayOne = (stats?.days_logged_in ?? 0) === 1

    const pct = Math.min(100, Math.round((stats.xp_in_level / Math.max(1, stats.xp_to_next)) * 100))

    // Makes sure no other way to quiz is accessible by accident
    const handleStartQuiz = () => {
        if (isO2Maxed) return
            navigate("/quiz")
    }
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
                    {/* Welcome Section */}
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Welcome back, <span className="text-[#DBA64A]">{displayName}</span>!
                            </h1>
                            <p className="text-gray-300">Keep pushing your cybersecurity journey forward</p>
                        </div>

                        {/* Canisters div  */}
                        <div className="flex items-center space-x-6">
                            <Button onClick={handleStartQuiz} disabled={isO2Maxed} title={isO2Maxed ? "You're at max canisters! " : undefined}
                                    className={`bg-gradient-to-r from-[#C92337] to-[#E16237] text-white font-semibold px-6 py-2 rounded-lg flex items-center space-x-2
                                        hover:from-[#E16237] hover:to-[#DBA64A]
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#C92337] disabled:hover:to-[#E16237]`}>
                                <BookOpen className="w-5 h-5" />
                                <span>Start Quiz</span>

                            </Button>
                            {/*div container for user_stat canister*/}
                            <div className="flex items-center space-x-3 bg-[#2F4B7A]/30 border border-[#F2F2F2] rounded-lg px-4 py-3 backdrop-blur-sm">
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
                                            {/* If I have time, get a proper oxygen container. But milk bottles are kinda funny also.*/}
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

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
                        <div className="lg:col-span-4 space-y-6">
                            {/* Xp Bar. Add picture later if I can */}
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

                                    {/*testing button div*/}
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
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isStreakDayOne ? "bg-[#FCFCFC]" : "border-3 border-solid border-amber-500"}` }>
                                                <Flame className={`w-8 h-8 ${isStreakDayOne ? "text-gray-600" : "text-[#FF9436]"}`} />
                                            </div>
                                            <div>
                                                <p className="text-gray-300 text-sm">Login Streak</p>
                                                <p className="text-4xl font-bold text-[#DBA64A]">{stats.days_logged_in}</p>
                                                <p className="text-gray-400 text-xs">days in a row</p>
                                                {/*Returns the p tag if true, otherwise its null, and does not render anything*/}
                                                {isStreakDayOne && (<p className="text-xs mt-1 text-[#DBA64A]"> Log back tomorrow to start your streak!!</p>)}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Badges. Rightnow its just hardcoded.  */}
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
                                                            // dds
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

                        {/* The oxygen meter bar. */}
                        <aside className="lg:col-span-1 lg:self-stretch">
                            <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm top-6 h-full">
                                <CardContent className="p-4 flex flex-col h-full">
                                    <h3 className="text-sm font-semibold text-white mb-4 text-center">O₂ Level</h3>
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <div className="h-full w-8 bg-[#223150] rounded-full overflow-hidden border-2 border-[#4A668E]/50 flex flex-col-reverse">
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
