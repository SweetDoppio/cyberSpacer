"use client"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useState } from "react"
import { ParallaxStarsbackground } from "@/components/ui/night_sky"
import { AuthApi } from "@/lib/api"
import { useNavigate } from "react-router-dom"

export  function AuthPage() {
    const { setUser } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState<string>("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (loading) return
        setError(null)
        setLoading(true)
        console.log("[AuthPage] submit", { isSignUp, email })

        try {
            if (isSignUp) {
                if (!age.trim()) { setError("Age is required"); return }
                const ageNum = parseInt(age, 10)
                if (!Number.isInteger(ageNum) || ageNum < 1) { setError("Please enter a valid age (1+)"); return }
                const { user } = await AuthApi.register(firstName.trim(), lastName.trim(), email.trim(), ageNum, password)
                setUser(user)
                navigate("/dashboard", { replace: true })
            } else {
                const { user } = await AuthApi.login(email.trim(), password)
                console.log("[AuthPage] login OK", user)
                setUser(user)
                navigate("/dashboard", { replace: true })
            }
        }catch (err: any) {
            const msg = String(err?.message || "")
            if (msg.includes("HTTP 401") || /invalid credentials/i.test(msg)) {
                setError("Email or password is incorrect")
            } else {
                setError(msg || "Login failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black circuit-pattern relative overflow-hidden flex items-center justify-center">
            <ParallaxStarsbackground
                starCount={200}
                glowCount={30}
                strength={200}
                smoothing={0.1}
                friction={0.95}
                className="z-0 pointer-events-none"
            />

            <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
                <Card className="bg-[#2F4B7A]/40 border-[#4A668E]/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
                            <div className={`relative hidden md:flex items-center justify-center transition-all duration-700 ${isSignUp ? "opacity-100" : "opacity-100"}`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#C92337] via-[#E16237] to-[#DBA64A]" />
                                <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C92337] to-[#E16237] flex items-center justify-center mb-6 animate-pulse-glow">
                                        <Shield className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        {isSignUp ? "Welcome Aboard!" : "Welcome Back, Cybernaut"}
                                    </h2>
                                    <p className="text-gray-200 text-lg leading-relaxed max-w-sm">
                                        {isSignUp
                                            ? "Begin your journey through the digital cosmos. Create your account and unlock expert-led cybersecurity training."
                                            : "Continue your mission to master the digital frontier. Your learning journey awaits."}
                                    </p>
                                </div>
                            </div>

                            {/* Right form */}
                            <div className="relative p-12 flex items-center">
                                <div className="max-w-md mx-auto w-full">
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        {isSignUp ? "Create Account" : "Sign In"}
                                    </h1>
                                    <p className="text-gray-400 mb-3">
                                        {isSignUp ? "Start your cybersecurity journey today" : "Access your learning dashboard"}
                                    </p>

                                    {error && (
                                        <div className="mb-4 text-sm text-red-300 bg-red-900/30 border border-red-700/50 rounded px-3 py-2">
                                            {error}
                                        </div>
                                    )}

                                    <form className="space-y-3" onSubmit={onSubmit} noValidate>
                                        {isSignUp && (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                            <Input
                                                                id="firstName"
                                                                value={firstName}
                                                                onChange={(e) => setFirstName(e.target.value)}
                                                                placeholder="Rina"
                                                                required
                                                                className="pl-10 bg-[#223150]/50 border-[#4A668E]/50 text-black placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                                                        <Input
                                                            id="lastName"
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            placeholder="Takoyaki"
                                                            required
                                                            className="bg-[#223150]/50 border-[#4A668E]/50 text-black placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="age" className="text-gray-300">Age</Label>
                                                    <Input
                                                        id="age"
                                                        type="number"
                                                        min={1}
                                                        value={age}
                                                        onChange={(e) => setAge(e.target.value)}
                                                        required
                                                        placeholder="32"
                                                        className="bg-[#223150]/50 border-[#4A668E]/50 text-black placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Email */}
                                        <div>
                                            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    required
                                                    className="pl-10 bg-[#223150]/50 border-[#4A668E]/50 text-black placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    required
                                                    className="pl-10 bg-[#223150]/50 border-[#4A668E]/50 text-black placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                />
                                            </div>
                                        </div>

                                        {/* Remember me (Sign In only) */}
                                        {!isSignUp && (
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" className="w-4 h-4 rounded border-[#4A668E] bg-[#223150]" />
                                                    <span className="text-sm text-gray-400">Remember me</span>
                                                </label>
                                                <a href="#" className="text-sm text-[#DBA64A] hover:text-[#E16237] transition-colors">
                                                    Forgot password?
                                                </a>
                                            </div>
                                        )}

                                        <Button type="submit" disabled={loading} onClick={() => console.log("submit button clicked")}
                                                className="w-full bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white py-6 text-lg">
                                            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </form>

                                    {/* Toggle fir form change */}
                                    <div className="mt-8 text-center">
                                        <p className="text-gray-400">
                                            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                                            <button onClick={() => setIsSignUp(v => !v)} className="text-[#DBA64A] hover:text-[#E16237] font-semibold">
                                                {isSignUp ? "Sign In" : "Sign Up"}
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
