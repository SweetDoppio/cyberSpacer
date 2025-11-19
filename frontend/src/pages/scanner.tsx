"use client"

// src/pages/ScannerPage.tsx
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { type ScanCheck, ScannerApi, type ScanResult } from "@/lib/api";
import {ILoveSmellingFeet} from "@/components/ui/footer";
import { Header } from "@/components/ui/header"
import { ParallaxStarsbackground } from "@/components/ui/night_sky"
import {AlertCircle, CheckCircle2, Zap} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card";


export default function ScannerPage() {
    const [result, setResult] = useState<ScanResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const httpsRes = result?.checks?.https;
    const xssRes   = result?.checks?.xss;
    const sqliRes  = result?.checks?.sqli;
    const urlInputRef = useRef<HTMLInputElement | null>(null);

    function resetScan() {
        setResult(null);
        setError(null);
        setLoading(false);
        setUrl("");
        setChecks({ https: true, xss: true, sqli: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
        requestAnimationFrame(() => urlInputRef.current?.focus());
    }

    function VulnBox({
                         title,
                         items,
                     }: {
        title: string
        items: { label: string; value?: string }[]
    }) {
        return (
            <div className="rounded-lg border-l-4 border-[#C92337] bg-[#223150]/40 backdrop-blur-sm p-4">
                <p className="text-[#DBA64A] font-semibold mb-2">{title}</p>
                <ul className="space-y-3">
                    {items.map((it, i) => (
                        <li key={i} className="text-gray-300">
                            <div className="font-medium">{it.label}</div>
                            {it.value && <div className="text-gray-400 text-sm">{it.value}</div>}
                            {i < items.length - 1 && <hr className="border-[#4A668E]/30 mt-3" />}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    const run = useCallback(async (u: string, c?: ScanCheck[]) => {
        if (!u) return
        try {
            setLoading(true)
            setError(null)
            const r = await ScannerApi.scan(u, c)
            setResult(r)
        } catch (e: any) {
            setError(e?.message || "Scan failed")
        } finally {
            setLoading(false)
        }
    }, [])

    const [url, setUrl] = useState("")
    const [checks, setChecks] = useState<Record<ScanCheck, boolean>>({
        https: true,
        xss: true,
        sqli: true,
    })
    const resultsRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!loading && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }, [loading])

    function onSubmit(e: FormEvent) {
        e.preventDefault()
        const selectedChecks = Object.entries(checks)
            .filter(([, v]) => v)
            .map(([k]) => k) as ScanCheck[]
        run(url.trim(), selectedChecks)
    }

    function RadarSpinner({ active }: { active: boolean }) {
        if (!active) {
            return (
                <div className="relative w-80 h-80">
                    <Rings />
                    <Nodes />
                </div>
            )
        }
        return (
            <div className="relative w-80 h-80">
                <Rings />
                <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{
                        backgroundImage: "conic-gradient(from 320deg, rgba(201,35,55,0) 0% 85%, rgba(201,35,55,0.9))",
                        mask: "radial-gradient(circle at center, black 58%, transparent 59%)",
                        WebkitMask: "radial-gradient(circle at center, black 58%, transparent 59%)",
                    }}
                />
                <Nodes animate />
            </div>
        )
    }

    function Rings() {
        return (
            <>
                <div className="absolute inset-0 rounded-full border border-[#E16237]/70" />
                <div className="absolute inset-8 rounded-full border border-[#E16237]/70" />
                <div className="absolute inset-16 rounded-full border border-[#E16237]/70" />
                <div className="absolute inset-0 rounded-full ring-1 ring-[#E16237]/20" />
            </>
        )
    }

    function Nodes({ animate = false }: { animate?: boolean }) {
        const nodeClass = "absolute size-2 rounded-full bg-[#E16237]/90 shadow-[0_0_10px_rgba(225,98,55,0.6)]"
        return (
            <>
                <div className={`${nodeClass} -left-16 top-20 ${animate ? "animate-ping" : ""}`} />
                <div className={`${nodeClass} left-44 -bottom-6 ${animate ? "animate-ping [animation-delay:0.6s]" : ""}`} />
                <div className={`${nodeClass} right-16 -top-10 ${animate ? "animate-ping [animation-delay:1.2s]" : ""}`} />
            </>
        )
    }


    return (
        <div className="min-h-screen bg-black circuit-pattern relative overflow-hidden">
            <ParallaxStarsbackground
                starCount={200}
                glowCount={30}
                strength={200}
                smoothing={0.1}
                friction={0.95}
                className="z-0"
            />

            <Header />

            <main className="relative z-10 w-full h-screen  mt-20 flex flex-col items-center justify-center px-6">
                {!result ? (
                    <>
                        {/* Header */}
                        <div className="mb-10 text-center mt-10">
                            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
                                Website Security
                                <span className="bg-gradient-to-r from-[#C92337] via-[#E16237] to-[#DBA64A] bg-clip-text text-transparent">
                                    {" "}
                                    Scanner
                                    </span>
                            </h1>
                            <p className="text-lg text-gray-300 max-w-2xl  mt-4">
                                Scan websites for critical vulnerabilities including HTTPS security, XSS attacks, and SQL injection
                                threats.
                            </p>
                        </div>



                        {/* Form + Radar Container */}
                        <div className="flex self-center justify-center">
                            <div className=" flex p-20 flex-col gap-5">                                {/* Form */}
                                <Card className="bg-[#223150]/40 border-[#4A668E]/50 backdrop-blur-sm">
                                    <CardContent className="p-8 w-full">
                                        <form onSubmit={onSubmit} className="space-y-6">
                                            <div className="space-y-2">
                                                <label htmlFor="url" className="text-gray-200 font-semibold block">
                                                    Enter URL to start scanning
                                                </label>
                                                <input
                                                    id="url"
                                                    type="url"
                                                    ref={urlInputRef}
                                                    required
                                                    placeholder="https://example.com"
                                                    value={url}
                                                    onChange={(e) => setUrl(e.target.value)}
                                                    className="w-full rounded-lg bg-black/40 border border-[#4A668E]/50 px-4 py-3 text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#DBA64A] transition"
                                                />
                                            </div>

                                            <fieldset className="space-y-3">
                                                <p className="text-gray-200 font-semibold text-sm">Security Checks</p>
                                                <div className="space-y-2">
                                                    {(["https", "xss", "sqli"] as const).map((k) => (
                                                        <label
                                                            key={k}
                                                            className="inline-flex items-center gap-3 text-gray-300 p-2 hover:bg-[#2F4B7A]/20 rounded transition cursor-pointer"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checks[k]}
                                                                onChange={(e) => setChecks((s) => ({ ...s, [k]: e.target.checked }))}
                                                                className="size-4 accent-[#DBA64A]"
                                                            />
                                                            <span className="capitalize font-medium">
                                {k === "https" ? "HTTPS Security" : k === "xss" ? "XSS Vulnerability" : "SQL Injection"}
                              </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </fieldset>

                                            <div className="flex justify-center pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={loading || !url.trim()}
                                                    className="relative inline-grid place-items-center rounded-full h-40 w-40 border-2 border-[#E16237]/80 text-white font-bold tracking-wide transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-[#C92337]/20 to-[#E16237]/20"
                                                >
                          <span className="pointer-events-none select-none text-sm">
                            {loading ? "Scanning…" : "Scan"}
                          </span>
                                                    <span className="absolute inset-0 rounded-full border-2 border-[#E16237]/60 animate-ping" />
                                                    <span className="absolute inset-0 rounded-full border-2 border-[#E16237]/30 animate-ping [animation-delay:0.8s]" />
                                                </button>
                                            </div>

                                            {error && (
                                                <div className="rounded-lg border border-[#C92337]/40 bg-[#C92337]/10 text-[#DBA64A] px-4 py-3 flex items-gap-2">
                                                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                                    <span>{error}</span>
                                                </div>
                                            )}
                                        </form>
                                    </CardContent>
                                </Card>

                                {loading && (
                                    <div className="w-full flex justify-center items-center">
                                        <RadarSpinner active={true} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : null}

                <section ref={resultsRef} className="w-full max-w-6xl mt-12">
                    {result && (
                        <Card className="bg-[#223150]/40 border-[#4A668E]/50 backdrop-blur-sm">
                            <CardContent className="p-8 space-y-8">
                                <div className="text-center space-y-2 border-b border-[#4A668E]/30 pb-6">
                                    <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                                        <Zap className="w-7 h-7 text-[#DBA64A]" />
                                        Scan Results
                                    </h2>
                                    <p className="text-gray-300">
                                        URL: <span className="text-[#DBA64A] font-mono">{result.url}</span>
                                    </p>
                                    {"duration_ms" in result && (
                                        <p className="text-xs text-gray-400">Duration: {(result as any).duration_ms}ms</p>
                                    )}
                                    {Array.isArray((result as any).errors) && (result as any).errors.length > 0 && (
                                        <div className="mt-4 rounded-lg border border-[#DBA64A]/30 bg-[#DBA64A]/10 text-[#DBA64A] px-4 py-3 text-left">
                                            <p className="font-semibold mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Warnings
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {(result as any).errors.map((m: string, i: number) => (
                                                    <li key={i}>{m}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <button
                                        type="button"
                                        onClick={resetScan}
                                        className="ml-4 rounded-lg bg-gradient-to-r from-[#C92337] to-[#E16237] px-4 py-2 text-white text-sm font-semibold shadow hover:brightness-110 transition"
                                    >
                                        New scan
                                    </button>
                                    {/* HTTPS */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                        </div>
                                        {httpsRes ? (
                                            httpsRes.is_https ? (
                                                <div className="flex items-start gap-3 bg-[#2F4B7A]/20 rounded-lg p-4 border border-[#E16237]/30">
                                                    <CheckCircle2 className="w-5 h-5 text-[#E16237] mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[#E16237] font-semibold">✅ Secure — Uses HTTPS</p>
                                                        <p className="text-gray-300 text-sm mt-1">URL is properly secured with HTTPS protocol</p>
                                                        <p className=" text-white"> <span className="mt-0.5 text-[1.5rem] text-white font-bold">What does this mean?</span><br/>
                                                            This means your browser and the website are talking over a locked, private line. Everything you type
                                                            (like passwords or card details) is scrambled into
                                                            secret code while it travels, so people on the same Wi-Fi can’t
                                                            easily read or change it. You can spot it by the lock icon and the
                                                            address starting with https://. It keeps your info safe on the way, but it doesn’t prove the site itself is
                                                            honest—so still check the website’s name and only share details with sites you trust!</p>
                                                    </div>
                                                </div>
                                            ) : httpsRes.redirects_to_https ? (
                                                <div className="flex items-start gap-3 bg-[#2F4B7A]/20 rounded-lg p-4 border border-[#E16237]/30">
                                                    <CheckCircle2 className="w-5 h-5 text-[#E16237] mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[#E16237] font-semibold">✅ Secure — Redirects to HTTPS</p>
                                                        <p className="text-gray-300 text-sm mt-1">HTTP requests are properly redirected to HTTPS</p>
                                                    </div>
                                                </div>
                                            ) : (httpsRes.security_issues?.length ?? 0) > 0 ? (
                                                <VulnBox
                                                    title="⚠️ HTTP Issues Detected"
                                                    items={httpsRes.security_issues.map((s: string) => ({
                                                        label: s,
                                                    }))}
                                                />
                                            ) : (
                                                <div className="flex items-start gap-3 bg-[#C92337]/20 rounded-lg p-4 border border-[#C92337]/30">
                                                    <AlertCircle className="w-5 h-5 text-[#C92337] mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-[#C92337] font-semibold">⚠️ No HTTPS Configured</p>
                                                        <p className="text-gray-300 text-sm mt-1">Website is not using HTTPS encryption</p>
                                                        <p className="text-white">Not every pee-pee time is poop-poo time, but every poo-poo time is
                                                            pee-pee time</p>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <p className="text-gray-400">—</p>
                                        )}
                                    </div>

                                    {/* SQLi */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                        </div>
                                        {sqliRes?.vulnerable_params?.length ? (
                                            <VulnBox
                                                title="⚠️ Vulnerabilities Detected"
                                                items={sqliRes.vulnerable_params.map((p: any) => ({
                                                    label: `Parameter: ${p.name}`,
                                                    value: `Payload: ${p.payload}`,
                                                }))}
                                            />
                                        ) : (
                                            <div className="flex items-start gap-3 bg-[#2F4B7A]/20 rounded-lg p-4 border border-[#E16237]/30">
                                                <CheckCircle2 className="w-5 h-5 text-[#E16237] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[#E16237] font-semibold">✅ No SQL Vulnerabilities Detected</p>
                                                    <p className="text-gray-300 text-sm mt-1">Parameters tested: {sqliRes?.param_count ?? 0}</p>
                                                    <p className=" text-white"> <span className="mt-0.5 text-[1.5rem] text-white font-bold">What does this mean?</span><br/>
                                                        This means Forms and search boxes only accept your input as data, not as secret commands to the database.
                                                        Attackers can’t use a text box to peek at other people’s information, change records, or wipe data.
                                                        In short: the site’s data is much harder to steal or mess with through that trick.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* XSS */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                        </div>
                                        {xssRes?.vulnerable_forms?.length ? (
                                            <VulnBox
                                                title="⚠️ Vulnerabilities Detected"
                                                items={xssRes.vulnerable_forms.map((f: any) => ({
                                                    label: `Form Action: ${f.action}`,
                                                    value: `Method: ${(f.method ?? f?.details?.method ?? "unknown").toUpperCase()}`,
                                                }))}
                                            />
                                        ) : (
                                            <div className="flex items-start gap-3 bg-[#2F4B7A]/20 rounded-lg p-4 border border-[#E16237]/30">
                                                <CheckCircle2 className="w-5 h-5 text-[#E16237] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[#E16237] font-semibold">✅ No XSS Vulnerabilities Detected</p>
                                                    <p className="text-gray-300 text-sm mt-1">Forms tested: {xssRes?.form_count ?? 0}</p>
                                                    <p className=" text-white"> <span className="mt-0.5 text-[1.5rem] text-white font-bold">What does this mean?</span><br/>
                                                        Pages won’t run surprise code from strangers in your browser.
                                                        That means attackers can’t easily steal your login, show fake pop-ups, or click things on your behalf
                                                        just by getting you to view a page. What you see and do on the site stays what the site intended.</p>

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>


                    )}

                </section>
            </main>
            <ILoveSmellingFeet/>
        </div>


    )
}



