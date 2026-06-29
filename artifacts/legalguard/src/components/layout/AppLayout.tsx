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
  LogOut,
  UserCircle,
  X,
  User,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) { root.classList.remove("dark"); setIsDark(false); }
    else { root.classList.add("dark"); setIsDark(true); }
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
  const { userType, userName, orgName, clearUser } = useUser();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const subtitle = userType === "organization" ? orgName : "Individual Account";

  return (
    <div ref={ref} className="relative p-4 border-t border-border">
      <button
        className="w-full flex items-center justify-between gap-3 hover:bg-accent rounded-lg p-2 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="text-sm text-left min-w-0">
            <p className="font-medium leading-none truncate">{userName}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>
          </div>
        </div>
        <ChevronUp className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-2 right-2 mb-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              {userType === "individual"
                ? <User className="h-3.5 w-3.5 text-blue-500" />
                : <Building2 className="h-3.5 w-3.5 text-purple-500" />
              }
              <span className="text-xs font-medium text-muted-foreground">
                {userType === "individual" ? "Individual Account" : "Organization Account"}
              </span>
            </div>
            <p className="text-sm font-semibold">{userName}</p>
          </div>
          <div className="p-1">
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-left"
              onClick={() => { setOpen(false); setLocation("/settings"); }}
            >
              <UserCircle className="h-4 w-4 text-muted-foreground" /> View Profile
            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-left"
              onClick={() => { setOpen(false); setLocation("/settings"); }}
            >
              <Settings className="h-4 w-4 text-muted-foreground" /> Account Settings
            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors text-left"
              onClick={() => { setOpen(false); setLocation("/login"); }}
            >
              <Users className="h-4 w-4 text-muted-foreground" /> Switch Account Type
            </button>
          </div>
          <div className="p-1 border-t border-border">
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left"
              onClick={() => { setOpen(false); clearUser(); setLocation("/login"); }}
            >
              <LogOut className="h-4 w-4" /> Sign Out
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
  const { userType } = useUser();

  const orgLinks = [
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

  const individualLinks = [
    { href: "/user-dashboard", label: "My Dashboard", icon: LayoutDashboard },
    { href: "/assistant", label: "AI Legal Chat", icon: MessageSquare },
    { href: "/contracts", label: "My Documents", icon: FileText },
    { href: "/receipts", label: "My Receipts", icon: ShieldCheck },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const links = userType === "individual" ? individualLinks : orgLinks;

  // Determine active link — check user-dashboard too
  const activeLink = links.find(l => {
    if (l.href === "/user-dashboard") return location === "/user-dashboard" || location.startsWith("/user-dashboard");
    if (l.href === "/dashboard") return location === "/dashboard" || location.startsWith("/dashboard");
    return location.startsWith(l.href);
  });

  const SidebarContent = () => (
    <>
      <Link href={userType === "individual" ? "/user-dashboard" : "/dashboard"}>
        <div className="p-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <span className="font-bold text-lg tracking-tight block leading-none">LegalGuard AI</span>
            {userType && (
              <span className={`text-xs font-medium mt-0.5 block ${userType === "individual" ? "text-blue-500" : "text-purple-500"}`}>
                {userType === "individual" ? "Individual" : "Organization"}
              </span>
            )}
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.href === activeLink?.href;
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

      {/* Mobile Sidebar */}
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
              {activeLink?.label || "LegalGuard AI"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {userType === "organization" && (
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                ArmorIQ Active
              </Button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
