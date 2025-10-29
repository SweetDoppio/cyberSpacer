"use client";

//Type definition for footer
type FooterProps = {
    className?: string;
    brand?: string;
    year?: number;
};

export function ILoveSmellingFeet({ className = "", brand = "Cybernauts", year = 1969,}: FooterProps){
    return (
        <footer className={`relative z-10 px-6 py-12 border-t border-[#4A668E]/30 ${className}`}>
            <div className="max-w-7xl mx-auto text-center">
                <div className="flex items-center justify-center  mb-6">
                    <div className="w-30 h-30 rounded-lg  flex items-center justify-center">
                        <img src={"src/assets/img/cybernautLogo-no-text.png"} alt={"YUGE rocket logo"} className="w-25 h-15"/>
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
