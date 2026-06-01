"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/20 bg-[#15231d]/90 backdrop-blur-md">
      <nav
        aria-label="주요 메뉴"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 text-white sm:px-8"
      >
        <Link href="/" className="text-lg font-semibold tracking-[0.08em]">
          ECOMAP
        </Link>

        <div className="flex items-center gap-7 text-sm font-medium text-white/75">
          <Link
            href="/"
            className={`transition hover:text-white ${pathname === "/" ? "text-white font-semibold" : ""}`}
          >
            홈
          </Link>
          <Link
            href="/board"
            className={`transition hover:text-white ${pathname.startsWith("/board") ? "text-white font-semibold" : ""}`}
          >
            게시판
          </Link>
          <Link
            href="/notion"
            className={`transition hover:text-white ${pathname.startsWith("/board") ? "text-white font-semibold" : ""}`}
          >
            아카이브
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-white/60 sm:block">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="rounded-full bg-[#f2c14e] px-4 py-2 text-sm font-semibold text-[#15231d] shadow-sm transition hover:bg-[#ffd36b]"
            >
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
