import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Sparkles, LineChart, GraduationCap, Briefcase, Scale, UserCheck, Settings, Menu, Bell,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/skills", label: "Skills Discovery", icon: Sparkles },
  { to: "/market", label: "Market Intelligence", icon: LineChart },
  { to: "/learning", label: "Learning Pathway", icon: GraduationCap },
  { to: "/jobs", label: "Job Opportunities", icon: Briefcase },
  { to: "/bias-audit", label: "Employer Bias Audit", icon: Scale },
  { to: "/review", label: "Human Review", icon: UserCheck },
  { to: "/profile", label: "Profile & Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: true }}
          className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-champagne"
        >
          <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gold opacity-0 transition-opacity group-data-[status=active]:opacity-100" />
          <Icon className="h-4 w-4 shrink-0 group-data-[status=active]:text-primary" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-3">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-gold font-display text-lg font-bold text-primary-foreground">S</div>
      <span className="font-display text-2xl font-semibold text-gold">Skillora AI</span>
    </div>
  );
}

export function DashboardShell({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-8 border-r border-sidebar-border bg-sidebar px-3 py-6 lg:flex">
        <Brand />
        <NavList />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-4 pt-8">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="mb-8"><Brand /></div>
          <NavList onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-md p-2 text-muted-foreground hover:text-foreground lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm text-muted-foreground">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/profile" aria-label="Notifications" className="relative rounded-full border border-border p-2 text-muted-foreground hover:text-champagne">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Link>
            <Link to="/profile" aria-label="Profile settings" className="grid h-9 w-9 place-items-center rounded-full bg-gold text-sm font-semibold text-primary-foreground">A</Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
