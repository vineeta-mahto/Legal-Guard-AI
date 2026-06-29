import React from "react";
import { Link } from "wouter";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Clock,
  BookOpen,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";

const tips = [
  {
    icon: Scale,
    title: "Always Read Before Signing",
    body: "Never sign a contract without reading every clause. Ask LegalGuard AI to summarize any document in plain English.",
    color: "blue",
  },
  {
    icon: AlertTriangle,
    title: "Watch for Unlimited Liability",
    body: "Clauses that hold you personally liable without a cap are high risk. Always negotiate a liability ceiling.",
    color: "amber",
  },
  {
    icon: BookOpen,
    title: "Understand Termination Terms",
    body: "Know how either party can exit. Look for notice periods, penalties, and auto-renewal clauses.",
    color: "emerald",
  },
  {
    icon: Lightbulb,
    title: "IP Ownership Matters",
    body: "In freelance or employment contracts, ensure intellectual property rights are clearly defined in your favor.",
    color: "purple",
  },
];

const quickActions = [
  { label: "Analyze a Contract", desc: "Upload and get instant AI analysis", href: "/contracts/upload", icon: Upload, color: "blue" },
  { label: "Chat with AI Lawyer", desc: "Ask any legal question in plain English", href: "/assistant", icon: MessageSquare, color: "green" },
  { label: "View My Documents", desc: "See all your uploaded contracts", href: "/contracts", icon: FileText, color: "purple" },
  { label: "My Receipts", desc: "Verified proof of AI actions", href: "/receipts", icon: ShieldCheck, color: "amber" },
];

export default function UserDashboard() {
  const { userName } = useUser();
  const firstName = userName.split(" ")[0];

  const stats = [
    { label: "Documents Analyzed", value: "3", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "AI Conversations", value: "7", icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Hours Saved", value: "12", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Issues Flagged", value: "5", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const recentDocs = [
    { name: "Freelance Agreement — Acme Corp", date: "Today", risk: "medium", riskScore: 42 },
    { name: "Apartment Lease 2025", date: "2 days ago", risk: "low", riskScore: 18 },
    { name: "Employment Offer Letter", date: "1 week ago", risk: "low", riskScore: 22 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent)]" />
        <div className="relative">
          <p className="text-blue-200 text-sm font-medium mb-1">Welcome back</p>
          <h1 className="text-3xl font-bold mb-2">Hello, {firstName} 👋</h1>
          <p className="text-blue-100 max-w-lg">
            Your personal AI legal assistant is ready. Upload a contract, ask a legal question, or review your past analyses.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link href="/contracts/upload">
              <Button className="bg-white text-blue-700 hover:bg-blue-50 gap-2 font-semibold">
                <Upload className="h-4 w-4" /> Analyze a Contract
              </Button>
            </Link>
            <Link href="/assistant">
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10 gap-2">
                <MessageSquare className="h-4 w-4" /> Ask AI Lawyer
              </Button>
            </Link>
          </div>
        </div>
        <ShieldCheck className="absolute right-8 top-8 h-24 w-24 text-white/10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="shadow-sm">
                <CardContent className="p-5">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-lg">Quick Actions</h2>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors cursor-pointer group">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0
                    ${action.color === "blue" ? "bg-blue-500/10 text-blue-500" : ""}
                    ${action.color === "green" ? "bg-green-500/10 text-green-500" : ""}
                    ${action.color === "purple" ? "bg-purple-500/10 text-purple-500" : ""}
                    ${action.color === "amber" ? "bg-amber-500/10 text-amber-500" : ""}
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Documents */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Recent Documents</h2>
            <Link href="/contracts">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">View all <ArrowRight className="h-3 w-3" /></Button>
            </Link>
          </div>
          <Card className="shadow-sm">
            <CardContent className="p-0 divide-y divide-border">
              {recentDocs.map((doc, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        doc.risk === "high" ? "text-red-600 border-red-200 bg-red-50" :
                        doc.risk === "medium" ? "text-amber-600 border-amber-200 bg-amber-50" :
                        "text-green-600 border-green-200 bg-green-50"
                      }`}
                    >
                      {doc.riskScore} risk
                    </Badge>
                    <CheckCircle2 className={`h-4 w-4 ${doc.risk === "low" ? "text-green-500" : "text-amber-500"}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Legal Tips */}
      <div>
        <h2 className="font-semibold text-lg mb-4">Legal Tips for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
              >
                <Card className="shadow-sm h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-2
                      ${tip.color === "blue" ? "bg-blue-500/10 text-blue-500" : ""}
                      ${tip.color === "amber" ? "bg-amber-500/10 text-amber-500" : ""}
                      ${tip.color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : ""}
                      ${tip.color === "purple" ? "bg-purple-500/10 text-purple-500" : ""}
                    `}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.body}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
