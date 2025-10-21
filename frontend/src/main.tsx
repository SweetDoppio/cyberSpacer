// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./global.css";
import { AuthProvider } from "@/lib/auth-context"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
            </AuthProvider>
    </React.StrictMode>
);
