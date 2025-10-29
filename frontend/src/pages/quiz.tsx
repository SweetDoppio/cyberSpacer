"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { Header } from "@/components/ui/header"
import {ParallaxStarsbackground} from "@/components/ui/night_sky";
import {ILoveSmellingFeet} from "@/components/ui/footer";

import {QuizApi, type QuizQuestionClient} from "@/lib/api";



export default function QuizPage() {
    const [attemptId, setAttemptId] = useState<string>("")
    const [questions, setQuestions] = useState<QuizQuestionClient[]>([])
    const [i, setI] = useState(0)
    const [isAnswered, setIsAnswered] = useState(false);          // <-- boolean
    const [answers, setAnswers] = useState<Record<string,string>>({}); // <-- per-question map
    const [selected, setSelected] = useState<string | null>(null)
    const [correctId, setCorrectId] = useState<string | null>(null)
    const [explanation, setExplanation] = useState<string | null>(null)
    const [correctCount, setCorrectCount] = useState(0)
    const [complete, setComplete] = useState(false)

    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        ;(async () => {
            try {
                const { attempt_id, quiz } = await QuizApi.start("QuizMe", 10)
                setAttemptId(attempt_id)
                setQuestions(quiz.questions)
            } catch (e: any) {
                setError(e?.message || "Failed to load quiz")
            }
        })()
    }, [])

    if (error) return <div className="p-8 text-red-300">{error}</div>
    if (!questions.length) {
        return (
            <div className="min-h-screen bg-black circuit-pattern relative overflow-hidden flex items-center justify-center">
                <div className="text-white text-2xl">Loading quiz…</div>
            </div>
        )
    }

    // variables for progress check, results
    const q = questions[i]
    const progressPct = ((i + 1) / questions.length) * 100
    const accuracy = Math.round((correctCount / questions.length) * 100)

    async function handleSelect(optionId: string) {
        if (isAnswered) return;
        setSelected(optionId);
        setIsAnswered(true);
        setAnswers(prev => ({ ...prev, [q.id]: optionId }));
        const res = await QuizApi.answer(attemptId, q.id, optionId);
        if (res.correct) setCorrectCount(c => c + 1);
        setCorrectId(res.correct_option_id || null);
        setExplanation(res.explanation || null);
    }

    function next() {
        if (i < questions.length - 1) {
            setI(i + 1);
            setSelected(null);
            setIsAnswered(false);
            setCorrectId(null);
            setExplanation(null);
        } else {
            setComplete(true);
        }
    }
    async function submit() {
        try {
            await QuizApi.submit(attemptId, answers)
            setComplete(true)
        } catch (e: any) {
            setError(e?.message || "Failed to submit quiz")
        }
    }

    function restart() {
        window.location.reload()
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

            {/* main quiz section */}
            <main className="relative z-10 px-6 py-8 mt-20 mb-50">  <div className="max-w-4xl mx-auto">
                {!complete ? (
                    <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">
                        <CardContent className="p-8">
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-2xl font-bold text-white">{q.text}</h2>
                                    <span className="text-[#DBA64A] font-semibold">
                                        {correctCount}/{i} Correct
                                    </span>
                                </div>
                                <div className="w-full bg-[#223150] rounded-full h-2 overflow-hidden border border-[#4A668E]/50">
                                    <div className="h-full bg-gradient-to-r from-[#C92337] to-[#E16237] transition-all" style={{ width: `${progressPct}%` }} />
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {q.options.map(o => {
                                    const isSelected = selected === o.id
                                    const isCorrect = isAnswered && o.id === correctId
                                    const isWrongSelected = isAnswered && isSelected && !isCorrect

                                    let classes = "w-full p-4 rounded-lg border transition-all text-left border-[#4A668E]/30 bg-[#223150]/40"
                                    if (isCorrect) {
                                        classes = "w-full p-4 rounded-lg border transition-all text-left bg-[#4A668E]/30 border-[#40CF5D]/60"
                                    } else if (isWrongSelected) {
                                        classes = "w-full p-4 rounded-lg border transition-all text-left bg-[#C92337]/30 border-[#C92337]/60"
                                    }

                                    return (
                                        <button
                                            key={o.id}
                                            onClick={() => handleSelect(o.id)}
                                            disabled={isAnswered}
                                            className={`${classes} ${isAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
                                            aria-pressed={isSelected}
                                            aria-describedby={isCorrect ? `correct-${o.id}` : undefined}>
                                            <span className={`text-lg ${isCorrect ? "text-[#DBA64A]" : isWrongSelected ? "text-[#E16237]" : "text-white"}`}>{o.text}</span>
                                            {isCorrect && (
                                                <span id={`correct-${o.id}`} className="ml-2 text-sm text-[#DBA64A] font-semibold">
                                                </span>
                                            )}
                                            {isWrongSelected && (
                                                <span className="ml-2 text-sm text-[#E16237] font-semibold">
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            {isAnswered && explanation && (
                                <div className={`p-4 rounded-lg border mb-8 ${selected === correctId ? "bg-[#4A668E]/20 border-[#DBA64A]/50" : "bg-[#C92337]/20 border-[#C92337]/50"}`}>                                    <p className="text-gray-200 text-sm">
                                        <span className="font-semibold text-[#DBA64A]">Explanation: </span>
                                        {explanation}
                                    </p>
                                </div>
                            )}
                            {isAnswered && (
                                <Button onClick={i === questions.length - 1 ? submit : next}
                                        className="w-full bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white">
                                    {i === questions.length - 1 ? "Submit Quiz" : "Next Question"}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-[#2F4B7A]/30 border-[#4A668E]/50 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <h2 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h2>
                            <p className="text-gray-300 mb-8">Accuracy: <b className="text-[#E16237]">{accuracy}%</b></p>
                            {/*Clear up this bit better later...*/}
                            {accuracy >= 90 ? <span className={"results_response"}>Wow, You're a real Cybernaut!</span> : accuracy < 89 && accuracy >= 60 ? <span className={"results_response"}> Not bad...
                                </span> : accuracy <=59  && accuracy > 30 ? <span className={"results_response"}> Well, could be a lot worse...</span> : <span className={"results_response"}> You're on your way to get ejected out of the ship...</span>}

                            <div className="flex gap-4">
                                <Button onClick={restart} className="flex-1 bg-[#4A668E] hover:bg-[#DBA64A] text-white">
                                    <RotateCcw className="w-5 h-5 mr-2" /> Retake Quiz
                                </Button>
                                <Button onClick={() => (window.location.href = "/dashboard")}
                                        className="flex-1 bg-gradient-to-r from-[#C92337] to-[#E16237] hover:from-[#E16237] hover:to-[#DBA64A] text-white">
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
