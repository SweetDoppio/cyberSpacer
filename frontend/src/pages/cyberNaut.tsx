"use client"

import {ParallaxStarsbackground} from "@/components/ui/night_sky"
import {Header} from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Users, Target, ChevronRight, Star, Code, Brain } from "lucide-react"
import {ILoveSmellingFeet} from "@/components/ui/footer";
// import { useEffect, useRef } from "react"

export default function CybernautsLanding() {
    return (
        <div className="min-h-screen bg-black circuit-pattern relative overflow-hidden ">
            <ParallaxStarsbackground
                starCount={200}
                glowCount={30}
                strength={200}
                smoothing={0.1}
                friction={0.95}
                className="z-0"
            />

            <Header />

            {/* To logo section*/}
            <section className="relative z-10 px-6 py-20">
                <div className="max-w-7xl mx-auto text-center animation-wrapper">
                    <div className="animate-float mb-8 flex justify-center">
                        <img src={"src/assets/img/cybernautLogo.png"} alt={"YUGE rocket logo"} className="mb-6"/>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 text-balance">
                        Master the
                        <span className="bg-gradient-to-r from-[#C92337] via-[#E16237] to-[#DBA64A] bg-clip-text text-transparent">
              {" "}
                            Digital{" "}
            </span>
                        Frontier
                    </h1>

                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto text-pretty">
                        Navigate the vast expanse of cybersecurity with expert-led training.Experience learning like never before with our innovative, gamified approach!.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="text-black px-8 py-4 text-lg animate-pulse-glow bg-amber-500"
                        >
                            Start Your Mission
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-[#4A668E] text-[#4A668E] hover:bg-[#4A668E]  hover:text-black px-8 py-4 text-lg bg-transparent"
                        >
                            Explore Courses
                        </Button>
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Why Choose Cybernauts?</h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Embark on a learning odyssey designed by industry veterans and space-age technology
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Expert-Led Training",
                                description: "Learn from certified cybersecurity professionals with real-world experience",
                                color: "#C92337",
                            },
                            {
                                icon: Zap,
                                title: "Hands-On Labs",
                                description: "Practice in simulated environments that mirror actual cyber threats",
                                color: "#E16237",
                            },
                            {
                                icon: Users,
                                title: "Community Support",
                                description: "Join a galaxy of learners and mentors on the same mission",
                                color: "#DBA64A",
                            },
                            {
                                icon: Target,
                                title: "Career Focused",
                                description: "Structured pathways to land your dream cybersecurity role",
                                color: "#4A668E",
                            },
                        ].map((feature, index) => (
                            <Card
                                key={index}
                                className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm hover:bg-[#2F4B7A]/50 transition-all duration-300"
                            >
                                <CardContent className="p-6 text-center">
                                    <div
                                        className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-glow"
                                        style={{ backgroundColor: feature.color }}
                                    >
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-300">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Popular Learning Paths</h2>
                        <p className="text-gray-300 text-lg">Choose your cybersecurity specialization</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "CyberSecurity Fundamentals",
                                level: "Void Cadet",
                                duration: "8 weeks",
                                students: "2.4k",
                                rating: 4.9,
                                color: "#C92337",
                            },
                            {
                                title: "Intermediate Stuff",
                                level: "Starborn Lieutenant",
                                duration: "12 weeks",
                                students: "1.8k",
                                rating: 4.8,
                                color: "#E16237",
                            },
                            {
                                title: "Advanced Crap ",
                                level: "Admiral of the Stars",
                                duration: "16 weeks",
                                students: "956",
                                rating: 4.9,
                                color: "#DBA64A",
                            },
                        ].map((course, index) => (
                            <Card
                                key={index}
                                className="bg-[#2F4B7A]/40 border-[#4A668E]/50 backdrop-blur-sm hover:bg-[#2F4B7A]/60 transition-all duration-300 group"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge className="text-white border-0" style={{ backgroundColor: course.color }}>
                                            {course.level}
                                        </Badge>
                                        <div className="flex items-center text-[#DBA64A]">
                                            <Star className="w-4 h-4 fill-current mr-1" />
                                            <span className="text-sm">{course.rating}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#DBA64A] transition-colors">
                                        {course.title}
                                    </h3>

                                    <div className="flex items-center justify-between text-gray-300 text-sm mb-4">
                                        <span>{course.duration}</span>
                                        <span>{course.students} students</span>
                                    </div>

                                    <Button className="w-full bg-transparent border border-[#4A668E] text-[#4A668E] hover:bg-[#4A668E] hover:text-white">
                                        Explore Course
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Meet the Creators</h2>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            The minds behind Cybernauts!
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Andrew Lee",
                                role: "Security Architect",
                                expertise: "Penetration Testing",
                                experience: "Almost 2 days",
                                icon: Shield,
                                color: "#C92337",
                                bio: "Andrew has trained over 500 security professionals worldwide in his dreams!",
                            },
                            {
                                name: "Abigail Rawlins",
                                role: "Platform Engineer",
                                expertise: "Network Security & Infrastructure",
                                experience: "32+ years",
                                icon: Code,
                                color: "#E16237",
                                bio: "Fought off 3 Wildebeests during her time at Africa",
                            },
                            {
                                name: "Connor Henderson",
                                role: "AI Security Researcher",
                                expertise: "Machine Learning",
                                experience: "6+ years",
                                icon: Brain,
                                color: "#DBA64A",
                                bio: "Slept for 8 hours straight while having both eyelids down.",
                            },
                        ].map((creator, index) => (
                            <Card
                                key={index}
                                className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm hover:bg-[#2F4B7A]/50 transition-all duration-300 group"
                            >
                                <CardContent className="p-6 text-center">
                                    <div
                                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-glow"
                                        style={{ backgroundColor: creator.color }}
                                    >
                                        <creator.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-1">{creator.name}</h3>
                                    <p className="text-[#DBA64A] font-medium mb-2">{creator.role}</p>

                                    <div className="mb-4">
                                        <Badge className="bg-[#223150] text-[#4A668E] border-[#4A668E]/50 mb-2">{creator.expertise}</Badge>
                                        <p className="text-sm text-gray-400">{creator.experience} experience</p>
                                    </div>

                                    <p className="text-gray-300 text-sm leading-relaxed">{creator.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-[#2F4B7A]/50 to-[#223150]/50 backdrop-blur-sm rounded-2xl p-12 border border-[#4A668E]/30">
                        <h2 className="text-4xl font-bold text-white mb-6">Ready to Become a Cybernaut?</h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of professionals who've launched their cybersecurity careers with us
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white px-8 py-4 text-lg"
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-[#DBA64A] text-[#DBA64A] hover:bg-[#DBA64A] hover:text-[#223150] px-8 py-4 text-lg bg-transparent"
                            >
                                View Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            < ILoveSmellingFeet className="mt-20" brand="Cybernauts" />
        </div>
    )
}
