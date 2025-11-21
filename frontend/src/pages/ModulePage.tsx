// frontend/src/pages/ModulePage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "@/app/layout";
import { modules } from "@/data/modules";
import {ParallaxStarsbackground} from "@/components/ui/night_sky"


export default function ModulePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const moduleId = Number(id);
    const module = modules.find((m) => m.id === moduleId);

    const [stepIndex, setStepIndex] = useState(0);

    if (!module) {
        return (
            <Layout>
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                    <ParallaxStarsbackground
                        starCount={200}
                        glowCount={30}
                        strength={200}
                        smoothing={0.1}
                        friction={0.95}
                        className="z-0"
                    />
                    <h1 className="text-3xl font-bold">Module not found</h1>
                    <button
                        onClick={() => navigate("/my-learning")}
                        className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
                    >
                        Back to My Learning
                    </button>
                </div>
            </Layout>
        );
    }

    const totalSteps = module.sections.length;
    const currentStepContent = module.sections[stepIndex];

    const handleNext = () => {
        if (stepIndex < totalSteps - 1) {
            setStepIndex(stepIndex + 1);
        }
    };

    const handlePrev = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
        }
    };

    const handleFinish = () => {
        // Later: call backend to mark module complete
        navigate("/my-learning");
    };

    return (
        <Layout>
            <div className="min-h-screen bg-black text-white px-4 py-8 md:px-10 lg:px-20">
                {/* Breadcrumb / back link */}
                <ParallaxStarsbackground
                    starCount={200}
                    glowCount={30}
                    strength={200}
                    smoothing={0.1}
                    friction={0.95}
                    className="z-0"
                />
                <button
                    onClick={() => navigate("/my-learning")}
                    className="text-sm text-gray-400 hover:text-red-400 mb-6"
                >
                    ← Back to My Learning
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 text-red-500">
                        {module.title}
                    </h1>
                    <p className="text-gray-300 mb-2">
                        {module.category} • {module.level}
                    </p>
                    <p className="text-gray-400 max-w-2xl">{module.description}</p>
                </div>

                {/* Progress indicator */}
                <div className="mb-6 max-w-2xl">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>
              Step {stepIndex + 1} of {totalSteps}
            </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                                width: `${((stepIndex + 1) / totalSteps) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Lesson content */}
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8 max-w-3xl">
                    <h2 className="text-2xl font-semibold mb-4">Lesson</h2>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                        {currentStepContent}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                    <button
                        onClick={handlePrev}
                        disabled={stepIndex === 0}
                        className={`px-4 py-2 rounded-lg border border-gray-600 ${
                            stepIndex === 0
                                ? "text-gray-500 border-gray-800 cursor-not-allowed"
                                : "text-white hover:border-red-500"
                        }`}
                    >
                        Previous
                    </button>

                    {stepIndex < totalSteps - 1 ? (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleFinish}
                            className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                        >
                            Finish Module
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    );
}
