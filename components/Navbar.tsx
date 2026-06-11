"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Github, Linkedin, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import profile from "@/data/profile.json";
import { assetUrl } from "@/lib/assetUrl";


const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "News", href: "/news" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-gray-900 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:via-blue-400 dark:to-purple-400"
        >
          Amirreza Alasti
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-bold text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <div className="flex items-center space-x-3 ml-4 border-l border-gray-200 dark:border-white/10 pl-4">
            {"cv" in profile && typeof profile.cv === "string" && (
              <a
                href={assetUrl(profile.cv)}
                download="Amirreza-Alasti-CV.pdf"
                className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                title="Download CV"
              >
                <Download size={20} />
              </a>
            )}
            <ThemeToggle />
            <a href="https://github.com/amirrezaalasti" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/amirreza-alasti-61450b1aa/" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 glass rounded-2xl p-4 md:hidden flex flex-col space-y-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-bold text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors block px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 pt-4 border-t border-black/10 dark:border-white/10">
              {"cv" in profile && typeof profile.cv === "string" && (
                <a
                  href={assetUrl(profile.cv)}
                  download="Amirreza-Alasti-CV.pdf"
                  className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
                >
                  <Download size={20} />
                  Download CV
                </a>
              )}
              <a href="https://github.com/amirrezaalasti" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/amirreza-alasti-61450b1aa/" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
