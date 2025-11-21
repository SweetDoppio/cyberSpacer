import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import CybernautsLanding from "@/pages/cyberNaut";
import { AuthPage } from "@/app/auth/login/page";        // named import
import PricingPage from "@/app/pricing/page";
import QuizPage from "@/pages/quiz";
import ScannerIHardlyKnowHer from "@/pages/scanner";
import { Dashboard } from "@/pages/dashboard";
import MyLearning  from "@/pages/MyLearning";
import ModulePage from "@/pages/ModulePage";

import { useAuth } from "@/lib/auth-context";

function RequireAuth() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;
    if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />;

    return <Outlet />;   // 🔥 this is where nested routes show up
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<CybernautsLanding />} />
            <Route path="/auth/login" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/scanner" element={<ScannerIHardlyKnowHer />} />

            {/* Protected routes */}
            <Route element={<RequireAuth />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/my-learning" element={<MyLearning />} />
                <Route path="/module/:id" element={<ModulePage />} />
            </Route>

            <Route path="*" element={<div className="p-20 text-center text-white text-4xl">404</div>} />
        </Routes>
    );
}
