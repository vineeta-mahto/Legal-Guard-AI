import React from "react";
import { Link } from "wouter";
import { ShieldCheck, ArrowRight, Lock, FileText, CheckCircle, Zap, BarChart3, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 selection:bg-primary selection:text-white">
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur border-b border-slate-800/50">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl tracking-tight text-white">LegalGuard AI</span>
          </div>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <button onClick={() => scrollTo("features")} className="hover:text-white transition-colors">Features</button>
          <button onClick={() => scrollTo("how-it-works")} className="hover:text-white transition-colors">How It Works</button>
          <button onClick={() => scrollTo("pricing")} className="hover:text-white transition-colors">Pricing</button>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">Log In</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              Enter App
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-40 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0F172A] to-[#0F172A] -z-10" />
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <Lock className="h-4 w-4" /> Introducing ArmorIQ Governance
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
              The First AI Legal Agent That <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Knows Its Own Limits.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              LegalGuard AI drafts, reviews, and negotiates with precision. But unlike other AI,
              it intercepts sensitive actions and demands human approval before execution. Secure, verifiable, and auditable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => scrollTo("how-it-works")} className="h-14 px-8 text-base border-slate-700 bg-slate-800/50 hover:bg-slate-800 w-full sm:w-auto text-slate-200">
                See How It Works
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything your legal team needs</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Powerful AI capabilities with enterprise-grade governance built in from day one.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-blue-500/40 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Autonomous Analysis</h3>
                <p className="text-slate-400 leading-relaxed">
                  Upload any contract. LegalGuard extracts clauses, identifies risks, and suggests edits in seconds using state-of-the-art LLMs trained on legal precedent.
                </p>
              </div>
              <div className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-amber-500/40 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Lock className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">ArmorIQ Interception</h3>
                <p className="text-slate-400 leading-relaxed">
                  When the AI detects a high-risk obligation or sensitive negotiation stance, it halts execution and routes a request to your approval center.
                </p>
              </div>
              <div className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-emerald-500/40 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Cryptographic Proof</h3>
                <p className="text-slate-400 leading-relaxed">
                  Every AI action and human approval generates an immutable cryptographic receipt. Perfect for compliance, audit trails, and peace of mind.
                </p>
              </div>
              <div className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-purple-500/40 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Real-Time Monitoring</h3>
                <p className="text-slate-400 leading-relaxed">
                  Live dashboards track every AI action, approval queue, and risk score across your entire contract portfolio in real time.
                </p>
              </div>
              <div className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/40 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <BarChart3 className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Risk Scoring</h3>
                <p className="text-slate-400 leading-relaxed">
                  AI-powered risk assessment scores every contract 0–100 with clause-level explanations and negotiation recommendations.
                </p>
              </div>
              <div className="space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-rose-500/40 transition-colors">
                <div className="h-12 w-12 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                  <Clock className="h-6 w-6 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Instant Turnaround</h3>
                <p className="text-slate-400 leading-relaxed">
                  Reduce contract review time from days to minutes. Full analysis, risk report, and suggested edits generated in under 30 seconds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-slate-900/30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How LegalGuard AI works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">A four-step governance loop that keeps humans in control at every critical decision point.</p>
            </div>
            <div className="relative">
              <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-slate-700 -translate-x-1/2" />
              <div className="space-y-12">
                {[
                  { step: "01", title: "Upload & Analyze", desc: "Upload your contract in any format. The AI immediately extracts all clauses, identifies obligations, and generates a full risk assessment.", color: "blue" },
                  { step: "02", title: "ArmorIQ Intercepts", desc: "As the AI processes sensitive actions—sending to clients, executing contracts, sharing externally—ArmorIQ halts and flags them for human review.", color: "amber" },
                  { step: "03", title: "Human Approval", desc: "Your designated approvers receive instant notifications. They review the AI's reasoning, assess the risk, and approve or reject with a single click.", color: "emerald" },
                  { step: "04", title: "Cryptographic Receipt", desc: "Every approved action generates a blockchain-style receipt with a transaction hash, timestamp, and cryptographic signature for permanent auditability.", color: "purple" },
                ].map((item, i) => (
                  <div key={i} className={`flex gap-8 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="flex-1 hidden md:block" />
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-xl font-black border-2 shrink-0 z-10
                      ${item.color === 'blue' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : ''}
                      ${item.color === 'amber' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : ''}
                      ${item.color === 'emerald' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : ''}
                      ${item.color === 'purple' ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : ''}
                    `}>
                      {item.step}
                    </div>
                    <div className="flex-1 p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Start free, scale as your team grows. All plans include ArmorIQ governance.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Starter */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Starter</h3>
                  <p className="text-slate-400 text-sm mt-1">For solo practitioners</p>
                </div>
                <div>
                  <span className="text-4xl font-black text-white">$49</span>
                  <span className="text-slate-400 ml-2">/month</span>
                </div>
                <ul className="space-y-3">
                  {["25 contracts/month", "AI analysis & risk scoring", "ArmorIQ governance", "Audit trail", "Email support"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800">Get Started</Button>
                </Link>
              </div>

              {/* Professional — highlighted */}
              <div className="rounded-2xl border border-blue-500/50 bg-blue-600/10 p-8 space-y-6 relative shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Professional</h3>
                  <p className="text-slate-400 text-sm mt-1">For growing law firms</p>
                </div>
                <div>
                  <span className="text-4xl font-black text-white">$199</span>
                  <span className="text-slate-400 ml-2">/month</span>
                </div>
                <ul className="space-y-3">
                  {["Unlimited contracts", "Up to 10 team members", "Full ArmorIQ suite", "Cryptographic receipts", "Approval workflows", "Priority support"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                      <Check className="h-4 w-4 text-blue-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)]">Start Free Trial</Button>
                </Link>
              </div>

              {/* Enterprise */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Enterprise</h3>
                  <p className="text-slate-400 text-sm mt-1">For large organizations</p>
                </div>
                <div>
                  <span className="text-4xl font-black text-white">Custom</span>
                </div>
                <ul className="space-y-3">
                  {["Unlimited everything", "Unlimited team members", "Custom AI training", "SAML/SSO integration", "Dedicated compliance officer", "SLA & 24/7 support"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} LegalGuard AI. Enterprise-grade Legal Governance.</p>
      </footer>
    </div>
  );
}
