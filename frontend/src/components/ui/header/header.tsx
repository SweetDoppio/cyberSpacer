import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

type NavItem =
    | {
    label: string;
    to: string;
    exact?: boolean;
    icon?: ReactNode;
}
    | {
    label: string;
    to: `#${string}`;
    kind: "hash";
    icon?: ReactNode;
};

const baseLink =
    "inline-block rounded-[10px] border-2 p-2 border-transparent hover:border-red-500 text-black transition-colors";
const activeLink = "text-red";

export function Header() {
    const { user, logout } = useAuth();
    const displayName = (user as any)?.first_name ?? (user as any)?.firstName ?? null;

    const navItems: NavItem[] = [
        { label: "Home", to: "/", exact: true },
        { label: "My Learning", to: "/my-learning" },
        { label: "Pricing", to: "/pricing" },
    ];

    const handleLogout = () => logout();

    return (
        <header className="sticky top-0 z-50 bg-white border-b px-6 py-4">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg border border-black flex items-center justify-center">
                        <Shield className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-2xl font-bold text-black">Cybernauts</span>
                </Link>

                {/* Navigation + Auth */}
                <div className="flex items-center gap-8">
                    {navItems.map((item, idx) => (
                        <NavLink
                            key={idx}
                            to={item.to}
                            end={"exact" in item && item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-2 ${isActive ? activeLink : baseLink}`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}

                    {displayName ? (
                        <div className="flex items-center gap-3">
                            <NavLink to="/scanner" className={baseLink}>
                                Scanner
                            </NavLink>
                            <NavLink to="/dashboard" className="text-black">
                                — Hi, <b>{displayName}</b> —
                            </NavLink>
                            <Button
                                variant="outline"
                                className="border-black text-black hover:text-red-500"
                                onClick={handleLogout}
                            >
                                Log out
                            </Button>
                        </div>
                    ) : (
                        <Button asChild variant="outline" className="border-black text-black hover:text-red-500">
                            <Link to="/auth/login">Sign in / Register</Link>
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
}