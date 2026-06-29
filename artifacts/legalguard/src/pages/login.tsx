import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Lock, Mail, ArrowRight, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";

type AccountType = "individual" | "organization";

export default function Login() {
  const [, setLocation] = useLocation();
  const { userType, setUserType, setUserName } = useUser();
  const [step, setStep] = useState<"type" | "login">(userType ? "login" : "type");
  const [selectedType, setSelectedType] = useState<AccountType | null>(userType as AccountType | null);

  const handleTypeSelect = (type: AccountType) => {
    setSelectedType(type);
    setUserType(type);
    setStep("login");
  };

  const doLogin = () => {
    const destination = (selectedType || userType) === "individual" ? "/user-dashboard" : "/dashboard";
    setLocation(destination);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin();
  };

  const handleGoogleLogin = () => {
    doLogin();
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        <Link href="/">
          <div className="flex flex-col items-center mb-8 cursor-pointer">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 border border-primary/20 hover:bg-primary/20 transition-colors">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your LegalGuard AI account</p>
          </div>
        </Link>

        {/* Step: Choose account type */}
        {step === "type" && (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground mb-4">Sign in as…</p>

            <button
              onClick={() => handleTypeSelect("individual")}
              className="w-full text-left p-5 rounded-2xl border-2 border-border bg-card hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold">Individual</p>
                  <p className="text-sm text-muted-foreground">Personal legal assistant</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </button>

            <button
              onClick={() => handleTypeSelect("organization")}
              className="w-full text-left p-5 rounded-2xl border-2 border-border bg-card hover:border-purple-500 hover:bg-purple-500/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="font-bold">Organization</p>
                  <p className="text-sm text-muted-foreground">Enterprise workspace</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
            </p>
          </div>
        )}

        {/* Step: Login form */}
        {step === "login" && (
          <>
            {/* Show which mode they're signing into */}
            <div className={`flex items-center gap-3 p-3 rounded-xl border mb-4 ${
              selectedType === "individual" ? "bg-blue-500/5 border-blue-500/20" : "bg-purple-500/5 border-purple-500/20"
            }`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                selectedType === "individual" ? "bg-blue-500/10" : "bg-purple-500/10"
              }`}>
                {selectedType === "individual"
                  ? <User className="h-4 w-4 text-blue-500" />
                  : <Building2 className="h-4 w-4 text-purple-500" />
                }
              </div>
              <span className="text-sm font-medium">
                Signing in as <strong>{selectedType === "individual" ? "Individual" : "Organization"}</strong>
              </span>
              <button
                onClick={() => setStep("type")}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground underline"
              >
                Change
              </button>
            </div>

            <Card className="shadow-lg border-border">
              <form onSubmit={handleLogin}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Account Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-11 gap-3"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="name@company.com" required className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type="password" required className="pl-9" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm leading-none">Remember me for 30 days</label>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button type="submit" className="w-full h-11 text-base">
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </>
        )}

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Secured by ArmorIQ Enterprise Grade Encryption
        </div>
      </div>
    </div>
  );
}
