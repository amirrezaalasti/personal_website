"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import characterWelcome from "../public/images/character_welcome.png";
import profile from "@/data/profile.json";

const STORAGE_KEY = "portfolio-welcome-dismissed";

export default function WelcomeOverlay() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* private mode */
    }
    // Skip heavy overlay for users who prefer reduced motion (also avoids extra GPU work).
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setOpen(true);
  }, []);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="welcome-title"
          aria-describedby="welcome-desc"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/65 cursor-pointer border-0 appearance-none"
            aria-label="Close welcome dialog"
            onClick={dismiss}
          />

          <motion.div
            className="relative z-10 w-full max-w-lg rounded-3xl border border-black/10 bg-white shadow-2xl overflow-hidden backdrop-blur-md dark:border-white/15 dark:bg-zinc-900/95"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Skip
              </button>
            </div>

            <div className="pt-10 px-6 sm:px-8 pb-8 text-center">
              <motion.div
                className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 mb-6"
                initial={{ scale: 0, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}
              >
                <Image
                  src={characterWelcome}
                  alt=""
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                  unoptimized
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="flex items-center justify-center gap-2 text-blue-800 dark:text-blue-400 mb-2"
              >
                <Sparkles className="w-4 h-4 shrink-0" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-widest">Hello</span>
              </motion.div>

              <motion.h2
                id="welcome-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4 }}
                className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3"
              >
                Welcome to my website
              </motion.h2>

              <motion.p
                id="welcome-desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-gray-800 dark:text-gray-300 text-sm sm:text-base leading-relaxed font-medium max-w-md mx-auto mb-8"
              >
                I&apos;m <span className="text-gray-900 dark:text-white font-semibold">{profile.name}</span>
                — here you&apos;ll find my AI research, projects, and publications. Thanks for stopping by.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.35 }}
              >
                <button
                  type="button"
                  onClick={dismiss}
                  className="px-10 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Come on in
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
