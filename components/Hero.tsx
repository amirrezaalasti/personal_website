"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import profile from "@/data/profile.json";
import { assetUrl } from "@/lib/assetUrl";
import heroPhoto from "../public/images/amirreza.jpeg";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, staggerChildren: 0.2 }}
        className="max-w-4xl mx-auto space-y-6 flex flex-col items-center"
      >
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-2xl mb-4 dark:border-white/15"
        >
          <Image 
            src={heroPhoto} 
            alt={profile.name} 
            fill 
            className="object-cover"
            priority
            unoptimized
          />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base font-medium text-blue-800 tracking-wider uppercase dark:text-blue-400"
        >
          Portfolio
        </motion.h2>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Hi, I&apos;m{" "}
          <span className="text-gray-900 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:via-blue-400 dark:to-purple-400">
            {profile.name}
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-800 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          {profile.headline}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <Link 
            href="/projects"
            className="px-8 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:scale-105 flex items-center gap-2"
          >
            View Projects <ArrowRight size={18} />
          </Link>
          <Link 
            href="/about"
            className="px-8 py-3 rounded-full border border-black/15 bg-white text-gray-900 font-semibold shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-none dark:backdrop-blur-sm dark:hover:bg-white/15 transition-all hover:scale-105"
          >
            About Me
          </Link>
          {"cv" in profile && typeof profile.cv === "string" && (
            <a
              href={assetUrl(profile.cv)}
              download="Amirreza-Alasti-CV.pdf"
              className="px-8 py-3 rounded-full border border-black/15 bg-white text-gray-900 font-semibold shadow-sm hover:bg-gray-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:shadow-none dark:backdrop-blur-sm dark:hover:bg-white/15 transition-all hover:scale-105 flex items-center gap-2"
            >
              Download CV <Download size={18} />
            </a>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
