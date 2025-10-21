"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
    /** How many twinkling stars */
    starCount?: number;
    /** How many colored glow dots */
    glowCount?: number;
    /** Max parallax translation in px (from center) */
    strength?: number;
    /** How aggressively we approach the target (0..1) */
    smoothing?: number;
    /** Velocity damping per frame (0..1) */
    friction?: number;
    /** Extra classes (z-index, blending, etc.) */
    className?: string;
};

type Star = {
    leftPct: number;
    topPct: number;
    size: "small" | "medium" | "large";
    delaySec: number;
    durationSec: number;
};

type Glow = {
    leftPct: number;
    topPct: number;
    // pick from your palette
    color: string;
    delaySec: number;
    durationSec: number;
};

export function ParallaxStarsbackground({
                                               starCount = 200,
                                               glowCount = 30,
                                               strength = 200,
                                               smoothing = 0.1,
                                               friction = 0.95,
                                               className = "",
                                           }: Props) {
    const parallaxRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);
    const reducedMotionRef = useRef(false);

    // Generate once per prop change; stable across re-renders
    const stars = useMemo<Star[]>(
        () =>
            Array.from({ length: starCount }, () => {
                const r = Math.random();
                const size: Star["size"] =
                    r < 0.7 ? "small" : r < 0.9 ? "medium" : "large";
                return {
                    leftPct: Math.random() * 100,
                    topPct: Math.random() * 100,
                    size,
                    delaySec: Math.random() * 3,
                    durationSec: 2 + Math.random() * 4,
                };
            }),
        [starCount]
    );

    const glows = useMemo<Glow[]>(
        () =>
            Array.from({ length: glowCount }, (_, i) => {
                const palette = ["#C92337", "#E16237", "#DBA64A", "#4A668E"];
                return {
                    leftPct: Math.random() * 100,
                    topPct: Math.random() * 100,
                    color: palette[i % palette.length],
                    delaySec: Math.random() * 3,
                    durationSec: 3 + Math.random() * 2,
                };
            }),
        [glowCount]
    );

    useEffect(() => {
        // Respect user’s reduced-motion preference
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        reducedMotionRef.current = mql.matches;

        const handleMouseMove = (e: MouseEvent) => {
            if (!parallaxRef.current || reducedMotionRef.current) return;

            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPercent = (clientX / innerWidth - 0.5) * 2; // -1..1
            const yPercent = (clientY / innerHeight - 0.5) * 2;

            targetRef.current.x = -xPercent * strength;
            targetRef.current.y = -yPercent * strength;
        };

        const animate = () => {
            if (!parallaxRef.current) return;

            if (!reducedMotionRef.current) {
                // basic spring-ish integration
                velocityRef.current.x +=
                    (targetRef.current.x - positionRef.current.x) * smoothing;
                velocityRef.current.y +=
                    (targetRef.current.y - positionRef.current.y) * smoothing;

                positionRef.current.x += velocityRef.current.x * smoothing;
                positionRef.current.y += velocityRef.current.y * smoothing;

                velocityRef.current.x *= friction;
                velocityRef.current.y *= friction;

                parallaxRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
            } else {
                // Keep it centered when reduced motion is on
                parallaxRef.current.style.transform = `translate3d(0, 0, 0)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", handleMouseMove);
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [strength, smoothing, friction]);

    return (
        <div
            ref={parallaxRef}
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
            aria-hidden
        >
            {/* Stars layer */}
            <div className="absolute inset-0">
                {stars.map((s, idx) => (
                    <div
                        key={idx}
                        className={`absolute rounded-full star ${
                            s.size === "small"
                                ? "star-small"
                                : s.size === "medium"
                                    ? "star-medium"
                                    : "star-large"
                        }`}
                        style={
                            {
                                left: `${s.leftPct}%`,
                                top: `${s.topPct}%`,
                                // use CSS vars so we can drive animation timing in CSS
                                ["--twinkle-delay" as any]: `${s.delaySec}s`,
                                ["--twinkle-duration" as any]: `${s.durationSec}s`,
                            } as React.CSSProperties
                        }
                    />
                ))}
            </div>

            {/* Glow dots layer */}
            <div className="absolute inset-0">
                {glows.map((g, idx) => (
                    <div
                        key={idx}
                        className="absolute w-1 h-1 rounded-full animate-glow"
                        style={{
                            left: `${g.leftPct}%`,
                            top: `${g.topPct}%`,
                            backgroundColor: g.color,
                            animationDelay: `${g.delaySec}s`,
                            animationDuration: `${g.durationSec}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
