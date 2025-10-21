"use client";

import { Shield } from "lucide-react";

type FooterProps = {
    className?: string;
    brand?: string;
    year?: number;
};

export function ILoveSmellingFeet({ className = "", brand = "Cybernauts", year = 1969,}: FooterProps){
    return (
        <footer className={`relative z-10 px-6 py-12 border-t border-[#4A668E]/30 ${className}`}>
            <div className="max-w-7xl mx-auto text-center">
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C92337] to-[#E16237] flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">{brand}</span>
                </div>
                <p className="text-gray-400">
                    © {year} {brand}. Navigating the digital frontier, one learner at a time.
                </p>
            </div>
        </footer>
    );
}
