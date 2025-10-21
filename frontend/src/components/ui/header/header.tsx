import { Link, NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type NavItem =
    | { label: string; to: string; kind?: "route"; exact?: boolean }
    | { label: string; to: `#${string}`; kind: "hash" }

type HeaderProps = {
    brand?: string
    nav?: NavItem[]
    showSignIn?: boolean
    signInTo?: string
    className?: string
}

const baseLink = "text-black hover:text-red-500 transition-colors"
const activeLink = "text-red"

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
    const { user, logout } = useAuth()

    // Support either snake_case or camelCase from your backend
    const displayName = (user as any)?.first_name ?? (user as any)?.firstName ?? null

    const renderNavItem = (item: NavItem, idx: number) => {
        if (item.kind === "hash") {
            return (
                <a key={idx} href={item.to} className={baseLink}>
                    {item.label}
                </a>
            )
        }
        return (
            <NavLink
                key={idx}
                to={item.to}
                end={item.exact ?? false}
                className={({ isActive }) => (isActive ? activeLink : baseLink)}
            >
                {item.label}
            </NavLink>
        )
    }

    const handleLogout = () => { void logout() }


    return (
        <header className={`sticky top-0 z-50 bg-white border-b px-6 py-4 ${className}`}>
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg border border-black flex items-center justify-center">
                        <Shield className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-2xl font-bold text-black">{brand}</span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-8">
                    {nav.map(renderNavItem)}

                    {/* Auth-aware section */}
                    {displayName ? (
                        <div className="flex items-center gap-3">
                            <NavLink to="/dashboard" className="text-black">
                                Hi, <b>{displayName}</b>
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
                        showSignIn && (
                            <Button
                                asChild
                                variant="outline"
                                className="border-black text-black hover:text-red-500"
                            >
                                <Link to={signInTo}>Sign in</Link>
                            </Button>
                        )
                    )}
                </div>
            </nav>
        </header>
    )
}