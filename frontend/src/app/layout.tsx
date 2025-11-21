// frontend/src/app/layout.tsx
import React, { Suspense } from "react";
import "../global.css";

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="font-sans min-h-screen bg-black text-white">
            <Suspense fallback={null}>
                {children}
            </Suspense>
        </div>
    );
};

export default Layout;
