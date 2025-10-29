"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { Header } from "@/components/ui/header"
import {ParallaxStarsbackground} from "@/components/ui/night_sky";
import {ILoveSmellingFeet} from "@/components/ui/footer";


interface QuizQuestion {
    index: number
    question: string
    options: Array<{ value: string; text: string }>
    correct: string
    explanation: string
}

const quizData: QuizQuestion[] = [
    {
        index: 0,
        question: "What is the primary goal of a firewall?",
        options: [
            { value: "a", text: "To increase internet speed" },
            { value: "b", text: "To store data securely" },
            { value: "c", text: "To monitor and control network traffic" },
        ],
        correct: "c",
        explanation:
            "The correct answer is c) To monitor and control network traffic because a firewall's primary role is to act as a barrier between trusted and untrusted networks, regulating data flow to enhance security.",
    },
    {
        index: 1,
        question: "Which of these is a common type of malware?",
        options: [
            { value: "a", text: "Spreadsheet" },
            { value: "b", text: "Ransomware" },
            { value: "c", text: "Web browser" },
        ],
        correct: "b",
        explanation:
            "The correct answer is b) Ransomware because it is a type of malware that encrypts a victim's data and demands payment for decryption, which is a widespread cyber threat.",
    },
    {
        index: 2,
        question: "What does phishing aim to steal?",
        options: [
            { value: "a", text: "Physical hardware" },
            { value: "b", text: "Personal information" },
            { value: "c", text: "Network cables" },
        ],
        correct: "b",
        explanation:
            "The correct answer is b) Personal information because phishing involves tricking users into providing sensitive data like passwords or credit card details.",
    },
    {
        index: 3,
        question: "Which protocol is used to secure websites?",
        options: [
            { value: "a", text: "HTTP" },
            { value: "b", text: "HTTPS" },
            { value: "c", text: "FTP" },
        ],
        correct: "b",
        explanation:
            "The correct answer is b) HTTPS because it adds a layer of SSL/TLS encryption to HTTP, securing data transmitted between the user's browser and the website.",
    },
    {
        index: 4,
        question: "What is a key feature of two-factor authentication (2FA)?",
        options: [
            { value: "a", text: "Single password" },
            { value: "b", text: "Two different authentication methods" },
            { value: "c", text: "No password required" },
        ],
        correct: "b",
        explanation:
            "The correct answer is b) Two different authentication methods because 2FA requires two independent factors (e.g., password and a code) to enhance security.",
    },
    {
        index: 5,
        question: "Which of these is a common password attack?",
        options: [
            { value: "a", text: "Brute force" },
            { value: "b", text: "Data backup" },
            { value: "c", text: "File compression" },
        ],
        correct: "a",
        explanation:
            "The correct answer is a) Brute force because it involves trying numerous password combinations to gain unauthorized access.",
    },
    {
        index: 6,
        question: "What does VPN stand for?",
        options: [
            { value: "a", text: "Virtual Private Network" },
            { value: "b", text: "Very Public Network" },
            { value: "c", text: "Virtual Phone Network" },
        ],
        correct: "a",
        explanation:
            "The correct answer is a) Virtual Private Network because a VPN creates a secure, encrypted connection over a public network.",
    },
    {
        index: 7,
        question: "What is the purpose of a DDoS attack?",
        options: [
            { value: "a", text: "To encrypt data" },
            { value: "b", text: "To overwhelm a server with traffic" },
            { value: "c", text: "To improve website speed" },
        ],
        correct: "b",
        explanation:
            "The correct answer is b) To overwhelm a server with traffic because a DDoS attack floods a server with requests to disrupt its availability.",
    },
    {
        index: 8,
        question: "Which of these is a secure file transfer protocol?",
        options: [
            { value: "a", text: "SFTP" },
            { value: "b", text: "SMTP" },
            { value: "c", text: "HTTP" },
        ],
        correct: "a",
        explanation:
            "The correct answer is a) SFTP because it provides a secure way to transfer files over SSH, unlike unencrypted protocols like SMTP or HTTP.",
    },
    {
        index: 9,
        question: "What does a zero-day exploit target?",
        options: [
            { value: "a", text: "Known vulnerabilities" },
            { value: "b", text: "Unknown vulnerabilities" },
            { value: "c", text: "Hardware failures" },
        ],
        correct: "b",
        explanation:
            "The correct answer is b) Unknown vulnerabilities because a zero-day exploit targets flaws not yet identified or patched by developers.",
    },
]

export default function QuizPage() {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [answered, setAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [quizComplete, setQuizComplete] = useState(false)
    const [randomQuestions, setRandomQuestions] = useState<QuizQuestion[]>([])

    // Initialize random questions on mount
    useEffect(() => {
        const shuffled = [...quizData].sort(() => Math.random() - 0.5).slice(0, 10)
        setRandomQuestions(shuffled)
    }, [])

    // Parallax effect


    const handleAnswerSelect = (value: string) => {
        if (answered) return

        setSelectedAnswer(value)
        setAnswered(true)

        if (value === randomQuestions[currentQuestionIndex].correct) {
            setScore(score + 1)
        }
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < randomQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedAnswer(null)
            setAnswered(false)
        } else {
            setQuizComplete(true)
        }
    }

    const handleRestartQuiz = () => {
        const shuffled = [...quizData].sort(() => Math.random() - 0.5).slice(0, 10)
        setRandomQuestions(shuffled)
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setAnswered(false)
        setScore(0)
        setQuizComplete(false)
    }

    if (randomQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-black circuit-pattern relative overflow-hidden flex items-center justify-center">
                <div className="text-white text-2xl">Loading quiz...</div>
            </div>
        )
    }

    const currentQuestion = randomQuestions[currentQuestionIndex]
    const accuracy = Math.round((score / randomQuestions.length) * 100)

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

            {/* main quiz section */}
            <main className="relative z-10 px-6 py-8 mt-20 mb-50">
                <div className="max-w-4xl mx-auto">
                    {!quizComplete ? (
                        <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">
                            <CardContent className="p-8">
                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-2xl font-bold text-white">{currentQuestion.question}</h2>
                                        <span className="text-[#DBA64A] font-semibold">
                                          {score}/{currentQuestionIndex + 1} Correct
                                        </span>
                                    </div>
                                    <div className="w-full bg-[#223150] rounded-full h-2 overflow-hidden border border-[#4A668E]/50">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#C92337] to-[#E16237] transition-all duration-500"
                                            style={{ width: `${((currentQuestionIndex + 1) / randomQuestions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Answer Options */}
                                <div className="space-y-4 mb-8">
                                    {currentQuestion.options.map((option) => {
                                        const isSelected = selectedAnswer === option.value
                                        const isCorrect = option.value === currentQuestion.correct
                                        const isWrong = isSelected && !isCorrect

                                        let bgColor = "bg-[#223150]/40 border-[#4A668E]/30 hover:bg-[]/40"
                                        let textColor = "text-white"

                                        if (answered) {
                                            if (isCorrect) {
                                                bgColor = "bg-[#4A668E]/50 border-[#2F4B7A]/60"
                                                textColor = "text-[#0DDB0D]"
                                            } else if (isWrong) {
                                                bgColor = "bg-[#C92337]/40 border-[#C92337]/60"
                                                textColor = "text-[#E16237]"
                                            }
                                        }

                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleAnswerSelect(option.value)}
                                                disabled={answered}
                                                className={`w-full p-4 rounded-lg border transition-all text-left ${bgColor} ${
                                                    answered ? "cursor-not-allowed" : "cursor-pointer"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${
                                                            isSelected ? "border-[#DBA64A] bg-[#DBA64A]/20" : "border-[#4A668E]/50 bg-[#223150]/50"
                                                        }`}
                                                    >
                                                        {option.value.toUpperCase()}
                                                    </div>
                                                    <span className={`text-lg ${textColor}`}>{option.text}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Explanation bit, to show...explanation. */}
                                {answered && (
                                    <div
                                        className={`p-4 rounded-lg border mb-8 ${
                                            selectedAnswer === currentQuestion.correct
                                                ? "bg-[#4A668E]/20 border-[#DBA64A]/50"
                                                : "bg-[#C92337]/20 border-[#C92337]/50"
                                        }`}
                                    >
                                        <p className="text-gray-200 text-sm">
                                            <span className="font-semibold text-[#DBA64A]">Explanation: </span>
                                            {currentQuestion.explanation}
                                        </p>
                                    </div>
                                )}

                                {/* the next button */}
                                {answered && (
                                    <Button
                                        onClick={handleNextQuestion}
                                        className="w-full bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2"
                                    >
                                        <span>{currentQuestionIndex === randomQuestions.length - 1 ? "See Results" : "Next Question"}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        /* The results screen. */
                        <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">
                            <CardContent className="p-8 text-center">
                                <h2 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h2>
                                <p className="text-gray-300 mb-8">Here's how you performed:</p>

                                <div className="grid md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-[#223150]/50 border border-[#4A668E]/50 rounded-lg p-6">
                                        <p className="text-gray-300 text-sm mb-2">Score</p>
                                        <p className="text-5xl font-bold text-[#DBA64A]">
                                            {score}/{randomQuestions.length}
                                        </p>
                                    </div>
                                    <div className="bg-[#223150]/50 border border-[#4A668E]/50 rounded-lg p-6">
                                        <p className="text-gray-300 text-sm mb-2">Accuracy</p>
                                        <p className="text-5xl font-bold text-[#E16237]">{accuracy}%</p>
                                    </div>
                                    <div className="bg-[#223150]/50 border border-[#4A668E]/50 rounded-lg p-6">
                                        <p className="text-gray-300 text-sm mb-2">Performance</p>
                                        <p className="text-3xl font-bold text-[#4A668E]">
                                            {accuracy >= 80 ? "Excellent" : accuracy >= 60 ? "Good" : "Keep Learning"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-8 p-6 bg-[#2F4B7A]/50 border border-[#4A668E]/50 rounded-lg">
                                    <p className="text-gray-300 mb-2">
                                        {accuracy >= 80
                                            ? "Outstanding performance! You've demonstrated strong cybersecurity knowledge."
                                            : accuracy >= 60
                                                ? "Good effort! Review the questions you missed to strengthen your knowledge."
                                                : "Keep practicing! Each quiz helps you improve your cybersecurity skills."}
                                    </p>
                                </div>

                                <div className="flex space-x-4">
                                    <Button
                                        onClick={handleRestartQuiz}
                                        className="flex-1 bg-gradient-to-r from-[#4A668E] to-[#2F4B7A] hover:from-[#DBA64A] hover:to-[#E16237] text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                        <span>Retake Quiz</span>
                                    </Button>
                                    <Button
                                        onClick={() => (window.location.href = "/dashboard")}
                                        className="flex-1 bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white font-semibold py-3 rounded-lg"
                                    >
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
            <ILoveSmellingFeet/>
        </div>
    )
}
