"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { modules, totalLessons } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";
import { Logo } from "./Logo";
import {
  CheckCircle2,
  Circle,
  BookOpen,
  GraduationCap,
  MessagesSquare,
  Workflow,
  Menu,
  X,
  Search,
} from "lucide-react";

const accentDot: Record<string, string> = {
  iris: "bg-iris",
  teal: "bg-teal",
  amber: "bg-amber",
  rose: "bg-rose",
};

export function Sidebar() {
  const pathname = usePathname();
  const { done, completedCount } = useProgress();
  const [open, setOpen] = useState(false);
  const pct = Math.round((completedCount / totalLessons) * 100);

  const content = (
    <nav className="flex flex-col h-full">
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-5 border-b border-canvas-300"
        onClick={() => setOpen(false)}
      >
        <Logo size={28} />
        <span className="font-display text-lg font-semibold text-ink tracking-tight">
          Agent Academy
        </span>
      </Link>

      <div className="px-5 py-4 border-b border-canvas-300">
        <div className="flex justify-between text-xs text-ink-muted mb-1.5">
          <span>Your progress</span>
          <span>
            {completedCount}/{totalLessons}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-canvas-300 overflow-hidden">
          <div
            className="h-full bg-iris rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="px-3 pt-3">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            window.dispatchEvent(new Event("open-command-palette"));
          }}
          className="flex w-full items-center gap-2 rounded-lg border border-canvas-300 bg-canvas-50 px-2.5 py-2 text-[0.82rem] text-ink-muted transition-colors hover:bg-canvas-200"
        >
          <Search size={15} className="shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-[0.62rem] font-medium border border-canvas-300 rounded px-1 py-0.5">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-4">
        {modules.map((m, mi) => (
          <div key={m.id} className="mb-5">
            <div className="flex items-center gap-2 px-2 mb-1.5">
              <span className={`h-2 w-2 rounded-full ${accentDot[m.accent]}`} />
              <span className="text-[0.72rem] font-bold uppercase tracking-wider text-ink-muted">
                {mi + 1}. {m.title}
              </span>
            </div>
            <ul>
              {m.lessons.map((l) => {
                const href = `/learn/${l.slug}`;
                const active = pathname === href;
                const isDone = done[l.slug];
                return (
                  <li key={l.slug}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[0.86rem] transition-colors ${
                        active
                          ? "bg-iris-50 text-iris-dark font-medium"
                          : "text-ink-soft hover:bg-canvas-200"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={15} className="text-teal shrink-0" />
                      ) : (
                        <Circle size={15} className="text-canvas-300 shrink-0" />
                      )}
                      <span className="truncate">{l.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-canvas-300 px-3 py-3 space-y-1">
        <FooterLink href="/learn" label="Curriculum" icon={<BookOpen size={15} />} active={pathname === "/learn"} onClick={() => setOpen(false)} />
        <FooterLink href="/patterns" label="Pattern Catalog" icon={<Workflow size={15} />} active={pathname === "/patterns"} onClick={() => setOpen(false)} />
        <FooterLink href="/interview" label="Interview Q&A" icon={<MessagesSquare size={15} />} active={pathname === "/interview"} onClick={() => setOpen(false)} />
        <FooterLink href="/glossary" label="Glossary" icon={<GraduationCap size={15} />} active={pathname === "/glossary"} onClick={() => setOpen(false)} />
      </div>
    </nav>
  );

  return (
    <>
      {/* mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center gap-3 px-4 border-b border-canvas-300 bg-canvas-50/90 backdrop-blur-sm">
        <button
          className="h-9 w-9 -ml-1 rounded-lg text-ink flex items-center justify-center hover:bg-canvas-200 transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Logo size={26} />
          <span className="font-display text-base font-semibold text-ink tracking-tight">
            Agent Academy
          </span>
        </Link>
      </div>

      {/* desktop */}
      <aside className="hidden lg:flex w-72 shrink-0 h-screen sticky top-0 border-r border-canvas-300 bg-canvas-50">
        {content}
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink/40 animate-[fade-up_0.2s_ease-out]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-canvas-50 shadow-2xl animate-[slide-in_0.25s_ease-out]">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 z-10 h-9 w-9 rounded-lg text-ink-muted flex items-center justify-center hover:bg-canvas-200 hover:text-ink transition-colors"
            >
              <X size={20} />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

function FooterLink({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[0.86rem] transition-colors ${
        active ? "bg-iris-50 text-iris-dark font-medium" : "text-ink-soft hover:bg-canvas-200"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
