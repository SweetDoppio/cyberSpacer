"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useRef, useState } from "react"

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const parallaxRef = useRef<HTMLDivElement>(null)
    return (
        <div className="min-h-screen bg-black circuit-pattern relative overflow-hidden flex items-center justify-center">
            {/* Parallax stars background */}
            <div ref={parallaxRef} className="parallax-container absolute inset-0 overflow-hidden pointer-events-none">
                {/*<div className="parallax-layer">{generateStars(200)}</div>*/}
            </div>

            {/* Glowing nodes/ stars*/}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full animate-glow"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            backgroundColor: i % 4 === 0 ? "#C92337" : i % 4 === 1 ? "#E16237" : i % 4 === 2 ? "#DBA64A" : "#4A668E",
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 px-6 py-4">
                <nav className="max-w-7xl mx-auto flex items-center justify-between relative">
                    <a href="/" className="flex items-center space-x-2 ">
                        <span className=" relative text-2xl font-bold text-white right-12">Cybernauts</span>
                    </a>
                </nav>
            </header>

            {/* Main auth container */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
                <Card className="bg-[#2F4B7A]/40 border-[#4A668E]/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative min-h-[600px]">
                            {/* Picture section - slides horizontally */}
                            <div
                                className="absolute z-10 inset-y-0 w-1/2 transition-transform duration-1500 ease-in-out overflow-hidden"
                                style={{
                                    transform: isSignUp ? "translateX(100%)" : "translateX(0)",
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#C92337] via-[#E16237] to-[#DBA64A] rounded-md" />
                                <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C92337] to-[#E16237] flex items-center justify-center mb-6 animate-pulse-glow">
                                        <Shield className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4 transition-all duration-700">
                                        {isSignUp ? "Welcome Aboard!" : "Welcome Back, Cybernaut"}
                                    </h2>
                                    <p className="text-gray-300 text-lg leading-relaxed max-w-sm transition-all duration-700">
                                        {isSignUp
                                            ? "Begin your journey through the digital cosmos. Create your account and unlock expert-led cybersecurity training."
                                            : "Continue your mission to master the digital frontier. Your learning journey awaits."}
                                    </p>
                                    <div className="mt-8 flex items-center gap-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 rounded-full animate-pulse"
                                                style={{
                                                    backgroundColor: i === 0 ? "#C92337" : i === 1 ? "#E16237" : "#DBA64A",
                                                    animationDelay: `${i * 0.2}s`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form section - slides horizontally in opposite direction */}
                            <div
                                className="absolute inset-y-0 w-1/2 transition-transform duration-1000 ease-in-out "
                                style={{
                                    transform: isSignUp ? "translateX(0)" : "translateX(100%)",
                                }}
                            >
                                <div className="relative p-12 h-full flex items-center -z-10 ">
                                    <div className="max-w-md mx-auto w-full">
                                        <h1 className="text-3xl font-bold text-white mb-2 transition-all duration-500">
                                            {isSignUp ? "Create Account" : "Sign In"}
                                        </h1>
                                        <p className="text-gray-400 mb-8 transition-all duration-500">
                                            {isSignUp ? "Start your cybersecurity journey today" : "Access your learning dashboard"}
                                        </p>

                                        <form className="space-y-2">
                                            {/* Full Name field with smooth transitions */}
                                            <div
                                                className={`space-y-0.5 transition-all duration-500 overflow-hidden ${
                                                    isSignUp ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <Label htmlFor="name" className="text-gray-300">
                                                    Full Name
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        placeholder="I fucking love dogs"
                                                        className="pl-10 bg-[#223150]/50 border-[#4A668E]/50 text-white placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email field */}
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-gray-300">
                                                    Email Address
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        className="pl-10 bg-[#223150]/50 border-[#4A668E]/50 text-white placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Password field */}
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-gray-300">
                                                    Password
                                                </Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="pl-10 bg-[#223150]/50 border-[#4A668E]/50 text-white placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Confirm Password field with smooth transitions */}
                                            <div
                                                className={`space-y-2 transition-all duration-500 overflow-hidden ${
                                                    isSignUp ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <Label htmlFor="confirm-password" className="text-gray-300">
                                                    Confirm Password
                                                </Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="pl-10 bg-[#223150]/50 border-[#4A668E]/50 text-white placeholder:text-gray-500 focus:border-[#DBA64A]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Remember me checkbox with smooth transitions */}
                                            <div
                                                className={`flex items-center justify-between transition-all duration-500 overflow-hidden ${
                                                    !isSignUp ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" className="w-4 h-4 rounded border-[#4A668E] bg-[#223150]" />
                                                    <span className="text-sm text-gray-400">Remember me</span>
                                                </label>
                                                <a href="#" className="text-sm text-[#DBA64A] hover:text-[#E16237] transition-colors">
                                                    Forgot password?
                                                </a>
                                            </div>

                                            {/* Submit button */}
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white py-6 text-lg transition-all duration-300"
                                            >
                                                {isSignUp ? "Create Account" : "Sign In"}
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </form>

                                        {/* Toggle button */}
                                        <div className="mt-8 text-center">
                                            <p className="text-gray-400">
                                                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                                                <button
                                                    onClick={() => setIsSignUp(!isSignUp)}
                                                    className="text-[#DBA64A] hover:text-[#E16237] font-semibold transition-colors"
                                                >
                                                    {isSignUp ? "Sign In" : "Sign Up"}
                                                </button>
                                            </p>
                                        </div>

                                        {/* Terms of Service and Privacy Policy with smooth transitions */}
                                        <p
                                            className={`mt-6 text-xs text-gray-500 text-center leading-relaxed transition-all duration-500 overflow-hidden ${
                                                isSignUp ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            By creating an account, you agree to our Terms of Service and Privacy Policy
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
