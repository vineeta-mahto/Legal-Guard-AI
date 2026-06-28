import React from "react";
import { Link } from "wouter";
import { ShieldCheck, ArrowRight, Lock, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 selection:bg-primary selection:text-white">
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-xl tracking-tight text-white">LegalGuard AI</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
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
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-700 bg-slate-800/50 hover:bg-slate-800 w-full sm:w-auto text-slate-200">
                Book a Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features/Value Prop */}
        <section id="how-it-works" className="py-24 bg-slate-900/50 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Autonomous Analysis</h3>
                <p className="text-slate-400 leading-relaxed">
                  Upload any contract. LegalGuard extracts clauses, identifies risks, and suggests edits in seconds using state-of-the-art LLMs trained on legal precedent.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Lock className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">ArmorIQ Interception</h3>
                <p className="text-slate-400 leading-relaxed">
                  When the AI detects a high-risk obligation or sensitive negotiation stance, it halts execution and routes a request to your approval center.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Cryptographic Proof</h3>
                <p className="text-slate-400 leading-relaxed">
                  Every AI action and human approval generates an immutable cryptographic receipt. Perfect for compliance, audit trails, and peace of mind.
                </p>
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
