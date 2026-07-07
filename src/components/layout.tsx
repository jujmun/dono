"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Users,
  PiggyBank,
  User,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/campaigns", label: "Campaigns", icon: PiggyBank },
  { href: "/communities", label: "Communities", icon: Users },
  { href: "/dashboard", label: "You", icon: User },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-dono-border bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dono-primary">
            <span className="text-sm font-bold text-white">D</span>
          </div>
          <span className="text-xl font-bold text-dono-text">Dono</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.slice(1, -1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-dono-primary/10 text-dono-primary"
                  : "text-dono-muted hover:bg-dono-surface-muted hover:text-dono-text"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/create"
            className="hidden items-center gap-1.5 rounded-full bg-dono-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dono-accent-dark sm:flex"
          >
            <Plus className="h-4 w-4" />
            Start a Campaign
          </Link>

          <Link
            href="/dashboard"
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-dono-primary/10 text-sm font-bold text-dono-primary md:flex"
          >
            Y
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dono-muted hover:bg-dono-surface-muted md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-dono-border bg-white px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                pathname === item.href
                  ? "bg-dono-primary/10 text-dono-primary"
                  : "text-dono-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/create"
            onClick={() => setMobileOpen(false)}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-dono-accent px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Start a Campaign
          </Link>
        </div>
      )}
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-dono-border bg-white/90 backdrop-blur-lg md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors",
                isActive ? "text-dono-primary" : "text-dono-muted"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-dono-border bg-dono-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dono-primary">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <span className="text-lg font-bold text-dono-text">Dono</span>
            </div>
            <p className="text-sm text-dono-muted">
              Community infrastructure for transparent university giving.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-dono-text">Platform</h4>
            <ul className="space-y-2 text-sm text-dono-muted">
              <li><Link href="/campaigns" className="hover:text-dono-primary">Campaigns</Link></li>
              <li><Link href="/communities" className="hover:text-dono-primary">Communities</Link></li>
              <li><Link href="/funds" className="hover:text-dono-primary">Community Funds</Link></li>
              <li><Link href="/discover" className="hover:text-dono-primary">Discover</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-dono-text">About</h4>
            <ul className="space-y-2 text-sm text-dono-muted">
              <li><a href="#" className="hover:text-dono-primary">Our Mission</a></li>
              <li><a href="#" className="hover:text-dono-primary">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-dono-primary">For Universities</a></li>
              <li><a href="#" className="hover:text-dono-primary">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-dono-text">Principles</h4>
            <ul className="space-y-2 text-sm text-dono-muted">
              <li>Radical transparency</li>
              <li>Small donations, big impact</li>
              <li>Communities over campaigns</li>
              <li>Trust through visibility</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-dono-border pt-8 text-center text-xs text-dono-muted">
          &copy; 2026 Dono. Making university giving transparent, social and rewarding.
        </div>
      </div>
    </footer>
  );
}
