"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Check, Zap, Rocket, Crown, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function PricingPage() {
    const parallaxRef = useRef<HTMLDivElement>(null)
    const velocityRef = useRef({ x: 0, y: 0 })
    const positionRef = useRef({ x: 0, y: 0 })
    // @ts-ignore
    const animationRef = useRef<number>()
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!parallaxRef.current) return

            const { clientX, clientY } = e
            const { innerWidth, innerHeight } = window

            const xPercent = (clientX / innerWidth - 0.5) * 2
            const yPercent = (clientY / innerHeight - 0.5) * 2

            const targetX = -xPercent * 200
            const targetY = -yPercent * 200

            velocityRef.current.x += (targetX - positionRef.current.x) * 0.1
            velocityRef.current.y += (targetY - positionRef.current.y) * 0.1
        }

        const animate = () => {
            if (!parallaxRef.current) return

            positionRef.current.x += velocityRef.current.x * 0.1
            positionRef.current.y += velocityRef.current.y * 0.1

            velocityRef.current.x *= 0.95
            velocityRef.current.y *= 0.95

            parallaxRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`

            animationRef.current = requestAnimationFrame(animate)
        }

        window.addEventListener("mousemove", handleMouseMove)
        animationRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    const generateStars = (count: number) => {
        return [...Array(count)].map((_, i) => {
            const size = Math.random() < 0.7 ? "star-small" : Math.random() < 0.9 ? "star-medium" : "star-large"
            return (
                <div
                    key={i}
                    className={`star ${size}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 4}s`,
                    }}
                />
            )
        })
    }

    const plans = [
        {
            id: "explorer",
            name: "Explorer",
            icon: Zap,
            price: 29,
            period: "month",
            description: "Perfect for beginners starting their cybersecurity journey",
            color: "#4A668E",
            popular: false,
            features: [
                "Access to 20+ beginner courses",
                "Basic hands-on labs",
                "Community forum access",
                "Monthly live Q&A sessions",
                "Course completion certificates",
                "Mobile app access",
                "Email support",
            ],
        },
        {
            id: "cybernaut",
            name: "Cybernaut Pro",
            icon: Rocket,
            price: 79,
            period: "month",
            description: "For serious learners ready to advance their skills",
            color: "#E16237",
            popular: true,
            features: [
                "Everything in Explorer, plus:",
                "Access to 100+ advanced courses",
                "Premium hands-on labs & simulations",
                "1-on-1 mentorship sessions (2/month)",
                "Career guidance & resume reviews",
                "Industry certification prep",
                "Priority support (24/7)",
                "Exclusive webinars & workshops",
                "Job board access",
            ],
        },
        {
            id: "enterprise",
            name: "Enterprise Fleet",
            icon: Crown,
            price: 199,
            period: "month",
            description: "Ultimate package for professionals and teams",
            color: "#DBA64A",
            popular: false,
            features: [
                "Everything in Cybernaut Pro, plus:",
                "Unlimited course access (all content)",
                "Custom learning paths",
                "Weekly 1-on-1 mentorship",
                "Team collaboration tools (up to 5 users)",
                "White-label certificates",
                "API access for integrations",
                "Dedicated account manager",
                "Custom lab environments",
                "Early access to new content",
            ],
        },
    ]

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div className="min-h-screen bg-black circuit-pattern relative overflow-hidden">
            <div ref={parallaxRef} className="parallax-container absolute inset-0 overflow-hidden pointer-events-none">
                <div className="parallax-layer">{generateStars(200)}</div>
            </div>

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

            <header className="relative z-10 px-6 py-4">
                <nav className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C92337] to-[#E16237] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">Cybernauts</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-300 hover:text-[#DBA64A] transition-colors">
                            Home
                        </Link>
                        <Link href="#courses" className="text-gray-300 hover:text-[#DBA64A] transition-colors">
                            Courses
                        </Link>
                        <Link href="#pricing" className="text-[#DBA64A] font-semibold">
                            Pricing
                        </Link>
                        <Button
                            variant="outline"
                            className="border-[#4A668E] text-[#4A668E] hover:bg-[#4A668E] hover:text-white bg-transparent"
                        >
                            Sign In
                        </Button>
                    </div>
                </nav>
            </header>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-float mb-8">
                        <Badge className="bg-[#2F4B7A] text-[#DBA64A] border-[#4A668E] mb-6">Choose Your Mission Level</Badge>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
                        Subscription
                        <span className="bg-gradient-to-r from-[#C92337] via-[#E16237] to-[#DBA64A] bg-clip-text text-transparent">
              {" "}
                            Tiers{" "}
            </span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto text-pretty">
                        Select the perfect plan for your cybersecurity journey. All plans include lifetime access to purchased
                        content and our thriving community.
                    </p>
                </div>
            </section>

            <section className="relative z-10 px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm hover:bg-[#2F4B7A]/50 transition-all duration-300 ${
                                    selectedPlan === plan.id ? "ring-2 ring-offset-2 ring-offset-black" : ""
                                } ${plan.popular ? "md:scale-105 border-[#E16237]" : ""}`}
                                style={{
                                    borderColor: plan.popular ? plan.color : undefined,
                                    // ringColor: selectedPlan === plan.id ? plan.color : undefined,
                                }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge
                                            className="text-white border-0 px-4 py-1 animate-pulse-glow"
                                            style={{ backgroundColor: plan.color }}
                                        >
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}

                                <CardContent className="p-8">
                                    <div
                                        className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-glow"
                                        style={{ backgroundColor: plan.color }}
                                    >
                                        <plan.icon className="w-7 h-7 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white text-center mb-2">{plan.name}</h3>
                                    <p className="text-gray-300 text-center text-sm mb-6 min-h-[40px]">{plan.description}</p>

                                    <div className="text-center mb-6">
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-5xl font-bold text-white">${plan.price}</span>
                                            <span className="text-gray-400 ml-2">/{plan.period}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mb-6 text-white border-0"
                                        style={{
                                            backgroundColor: selectedPlan === plan.id ? plan.color : "transparent",
                                            borderColor: plan.color,
                                            borderWidth: selectedPlan === plan.id ? "0" : "1px",
                                        }}
                                        variant={selectedPlan === plan.id ? "default" : "outline"}
                                        onClick={() => setSelectedPlan(plan.id)}
                                    >
                                        {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                                        <ChevronRight className="ml-2 w-4 h-4" />
                                    </Button>

                                    <div className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-[#DBA64A] flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">All Plans Include</h2>
                        <p className="text-gray-300">Core features available across all subscription tiers</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            "Lifetime access to purchased content",
                            "Progress tracking & analytics",
                            "Downloadable resources",
                            "Community forum access",
                            "Mobile & desktop apps",
                            "Regular content updates",
                            "Secure cloud storage",
                            "Multi-device sync",
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-[#2F4B7A]/20 backdrop-blur-sm rounded-lg p-4 border border-[#4A668E]/30"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#4A668E] flex items-center justify-center flex-shrink-0">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-gray-200">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Can I switch plans anytime?",
                                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.",
                            },
                            {
                                q: "Is there a free trial?",
                                a: "We offer a 7-day free trial for the Cybernaut Pro plan. No credit card required to start.",
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards, PayPal, and cryptocurrency payments for annual subscriptions.",
                            },
                            {
                                q: "Do you offer student discounts?",
                                a: "Yes! Students get 40% off any plan with a valid .edu email address.",
                            },
                        ].map((faq, index) => (
                            <Card
                                key={index}
                                className="bg-[#2F4B7A]/20 border-[#4A668E]/30 backdrop-blur-sm hover:bg-[#2F4B7A]/30 transition-all"
                            >
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                                    <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-[#2F4B7A]/50 to-[#223150]/50 backdrop-blur-sm rounded-2xl p-12 border border-[#4A668E]/30">
                        <h2 className="text-4xl font-bold text-white mb-6">Ready to Launch Your Career?</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join over 10,000 professionals who've transformed their careers with Cybernauts
                        </p>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white px-8 py-4 text-lg"
                            disabled={!selectedPlan}
                        >
                            {selectedPlan ? "Continue to Checkout" : "Select a Plan Above"}
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                        {selectedPlan && (
                            <p className="text-gray-400 text-sm mt-4">
                                You've selected:{" "}
                                <span className="text-[#DBA64A] font-semibold">{plans.find((p) => p.id === selectedPlan)?.name}</span>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <footer className="relative z-10 px-6 py-12 border-t border-[#4A668E]/30">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C92337] to-[#E16237] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">Cybernauts</span>
                    </div>
                    <p className="text-gray-400">© 2025 Cybernauts. Navigating the digital frontier, one learner at a time.</p>
                </div>
            </footer>
        </div>
    )
}
