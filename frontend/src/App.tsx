import { Routes, Route, useLocation, Navigate} from "react-router-dom"
import CybernautsLanding from "@/pages/cyberNaut"
import {AuthPage} from "@/app/auth/login/page"      // <-- the login PAGE component
import PricingPage from "@/app/pricing/page"
import QuizPage from "@/pages/quiz";
import {Dashboard} from "@/pages/dashboard"
import { useAuth } from "@/lib/auth-context";
import type {JSX} from "react"

export function RequireAuth({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) return null;
    if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />;
    return children;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<CybernautsLanding />} />
            <Route path="/auth/login" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/dashboard" element={
                <RequireAuth>
                    <Dashboard />
                </RequireAuth>
            } />
            <Route path="/quiz" element={<RequireAuth><QuizPage/></RequireAuth>}/>
            <Route path="*" element={<div className="p-8 text-white">404</div>} />
        </Routes>
    )
}
