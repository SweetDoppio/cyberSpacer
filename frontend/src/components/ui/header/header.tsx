import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";

type NavItem =
    | { label: string; to: string; kind?: "route"; exact?: boolean }
    | { label: string; to: `#${string}`; kind: "hash" };

type HeaderProps = {
    brand?: string;
    nav?: NavItem[];
    showSignIn?: boolean;
    signInTo?: string;
    className?: string;
};

const baseLink =
    "text-gray-300 hover:text-[#DBA64A] transition-colors";
const activeLink =
    "text-[#DBA64A] font-semibold";

export function Header({
                                   brand = "Cybernauts",
                                   nav = [
                                       { label: "Home", to: "/", exact: true },
                                       { label: "Courses", to: "#courses", kind: "hash" },
                                       { label: "Pricing", to: "/pricing" },
                                   ],
                                   showSignIn = true,
                                   signInTo = "/auth/login",
                                   className = "",
                               }: HeaderProps) {
    const [open, setOpen] = useState(false);

    const renderNavItem = (item: NavItem, idx: number) => {
        if (item.kind === "hash") {
            return (
                <a
                    key={idx}
                    href={item.to}
                    className={baseLink}
                    onClick={() => setOpen(false)}
                >
                    {item.label}
                </a>
            );
        }
        return (
            <NavLink
                key={idx}
                to={item.to}
                end={item.exact ?? false}
                className={({ isActive }) =>
                    isActive ? `${activeLink}` : `${baseLink}`
                }
                onClick={() => setOpen(false)}
            >
                {item.label}
            </NavLink>
        );
    };

    return (
        <header className={`relative z-10 px-6 py-4 ${className}`}>
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C92337] to-[#E16237] flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">{brand}</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {nav.map(renderNavItem)}
                    {showSignIn && (
                        <Button
                            asChild
                            variant="outline"
                            className="border-[#4A668E] text-[#4A668E] hover:bg-[#4A668E] hover:text-white bg-transparent"
                        >
                            <Link to={signInTo}>Sign in</Link>
                        </Button>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#4A668E]"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Mobile drawer */}
            {open && (
                <div className="md:hidden mt-3 rounded-xl border border-[#4A668E]/30 bg-[#0b1220]/90 backdrop-blur-sm">
                    <div className="px-4 py-3 flex flex-col space-y-3">
                        {nav.map((item, idx) => (
                            <div key={idx}>{renderNavItem(item, idx)}</div>
                        ))}
                        {showSignIn && (
                            <Button
                                asChild
                                variant="outline"
                                className="border-[#4A668E] text-[#4A668E] hover:bg-[#4A668E] hover:text-white bg-transparent"
                            >
                                <Link to={signInTo}>Sign in</Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
