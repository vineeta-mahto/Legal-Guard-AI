import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  CheckSquare,
  History,
  ShieldCheck,
  Bell,
  Users,
  Settings,
  Menu,
  Moon,
  Sun,
  ChevronUp,
  User,
  LogOut,
  UserCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle Theme">
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function UserProfileMenu() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative p-4 border-t border-border">
      <button
        className="w-full flex items-center justify-between gap-3 hover:bg-accent rounded-lg p-2 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            JD
          </div>
          <div className="text-sm text-left">
            <p className="font-medium leading-none">Jane Doe</p>
            <p className="text-xs text-muted-foreground mt-1">Senior Partner</p>
          </div>
        </div>
        <ChevronUp className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-2 right-2 mb-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-semibold">Jane Doe</p>
            <p className="text-xs text-muted-foreground">jane.doe@legalguard.ai</p>
          </div>
          <div className="p-1">
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-left"
              onClick={() => { setOpen(false); setLocation("/settings"); }}
            >
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              View Profile
            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-left"
              onClick={() => { setOpen(false); setLocation("/settings"); }}
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Account Settings
            </button>
          </div>
          <div className="p-1 border-t border-border">
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left"
              onClick={() => { setOpen(false); setLocation("/login"); }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/assistant", label: "AI Assistant", icon: MessageSquare },
    { href: "/contracts", label: "Contracts", icon: FileText },
    { href: "/approvals", label: "Approval Center", icon: CheckSquare },
    { href: "/audit-trail", label: "Audit Trail", icon: History },
    { href: "/receipts", label: "Receipts", icon: ShieldCheck },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/team", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <Link href="/">
        <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg tracking-tight">LegalGuard AI</span>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href}>
              <span
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-medium ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <UserProfileMenu />
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col bg-card border-r border-border shadow-xl">
            <div className="flex items-center justify-end p-3 border-b border-border">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg hidden sm:block">
              {links.find(l => location.startsWith(l.href))?.label || "LegalGuard AI"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              ArmorIQ Active
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
