import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Building2, User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";

type AccountType = "individual" | "organization";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { setUserType, setUserName, setOrgName } = useUser();
  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");

  const handleTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep(2);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountType) return;
    setUserType(accountType);
    setUserName(name || "Jane Doe");
    if (accountType === "organization") setOrgName(org || "My Organization");
    setLocation(accountType === "organization" ? "/dashboard" : "/user-dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[480px]">
        <Link href="/">
          <div className="flex flex-col items-center mb-8 cursor-pointer">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">LegalGuard AI — Choose how you want to use it</p>
          </div>
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step > s ? "bg-primary text-primary-foreground" :
                step === s ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <Check className="h-3.5 w-3.5" /> : s}
              </div>
              <span className={`text-sm ${step >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s === 1 ? "Account Type" : "Your Details"}
              </span>
              {s < 2 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Choose Account Type */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <p className="text-muted-foreground text-sm">How will you be using LegalGuard AI?</p>
            </div>
            <button
              onClick={() => handleTypeSelect("individual")}
              className="w-full text-left p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <User className="h-7 w-7 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold">Individual</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Personal legal assistant — review your own contracts, freelance agreements, leases, and employment offers.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {["Personal contracts", "AI chat", "Document analysis"].map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">{tag}</span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </button>

            <button
              onClick={() => handleTypeSelect("organization")}
              className="w-full text-left p-6 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <Building2 className="h-7 w-7 text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold">Organization</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Enterprise suite — full ArmorIQ governance, team management, approval workflows, and audit trails.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {["ArmorIQ governance", "Team management", "Audit trail", "Approvals"].map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">{tag}</span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </div>
          </div>
        )}

        {/* Step 2 — Fill Details */}
        {step === 2 && accountType && (
          <Card className="shadow-lg border-border">
            <form onSubmit={handleSignup}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${accountType === "individual" ? "bg-blue-500/10" : "bg-purple-500/10"}`}>
                    {accountType === "individual"
                      ? <User className="h-5 w-5 text-blue-500" />
                      : <Building2 className="h-5 w-5 text-purple-500" />
                    }
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {accountType === "individual" ? "Personal Account" : "Organization Account"}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      required
                      className="pl-9"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>

                {accountType === "organization" && (
                  <div className="space-y-2">
                    <Label htmlFor="org">Organization Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="org"
                        placeholder="Acme Law Partners"
                        required
                        className="pl-9"
                        value={org}
                        onChange={e => setOrg(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder={accountType === "individual" ? "jane@gmail.com" : "jane@acmelaw.com"} required className="pl-9" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type="password" required className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="confirm" type="password" required className="pl-9" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-1">
                  By creating an account you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button type="submit" className="w-full h-11 text-base">
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to account type
                </button>
              </CardFooter>
            </form>
          </Card>
        )}

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Secured by ArmorIQ Enterprise Grade Encryption
        </div>
      </div>
    </div>
  );
}
