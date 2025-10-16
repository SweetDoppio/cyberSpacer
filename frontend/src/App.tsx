import { Routes, Route, Navigate } from "react-router-dom";
import CybernautsLanding from "@/pages/cyberNaut";
import AuthPage from "@/app/auth/login/page";  // include the file name
import PricingPage from "@/app/pricing/page";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<CybernautsLanding />} />
            <Route path="/auth/login" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            {/* optional redirect */}
            {/* 404 */}
            <Route path="*" element={<div className="p-8 text-white">404</div>} />
        </Routes>
    );
}
