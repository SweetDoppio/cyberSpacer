"use client"
import {ParallaxStarsbackground} from "@/components/ui/night_sky"
import {ILoveSmellingFeet} from "@/components/ui/footer";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {  Check, Zap, Rocket, Crown, ChevronRight } from "lucide-react"
import {useState } from "react"
import {Header} from "@/components/ui/header"

export default function PricingPage() {

    // @ts-ignore
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    const plans = [
        {
            id: "explorer",
            name: "Explorer",
            icon: Zap,
            price: 5,
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
            price: 9,
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
            price: 19,
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
            <ParallaxStarsbackground
                starCount={200}
                glowCount={30}
                strength={200}
                smoothing={0.1}
                friction={0.95}
                className="z-0"
            />

            <Header className=""/>
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-float mb-8 flex items-center justify-center flex-col">
                        <img src={"src/assets/img/cybernautLogo.png"} alt={"Cybernaut Logo or something"}/>

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
                                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll refund the difference.",
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
                                a: "Yes! Students get 1% off any plan with a valid .edu email address.",
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
            < ILoveSmellingFeet className="mt-20" brand="Cybernauts" />
        </div>
    )
}
