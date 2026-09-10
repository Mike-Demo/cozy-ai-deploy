import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-heading font-semibold text-xl tracking-tight text-text hover:text-accent transition-colors">
            Agent Deploy
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-text-muted">
            <Link to="/setup" className="hover:text-accent transition-colors">
              Setup
            </Link>
            <Link to="/troubleshooting" className="hover:text-accent transition-colors">
              Troubleshooting
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {!hideFooter && <SiteFooter />}
    </div>
  );
}
