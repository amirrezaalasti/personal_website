"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import profile from "@/data/profile.json";

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
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl mb-4"
        >
          <Image 
            src="https://media.licdn.com/dms/image/v2/D4E03AQHmvc3m4ONjSQ/profile-displayphoto-scale_200_200/B4EZo7gWYCHcAc-/0/1761934927936?e=1767225600&v=beta&t=cbJhthfCmCpSxtvFhx3KDgHIblLwfrTBh_TtwTslQis" 
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
          className="text-sm md:text-base font-medium text-blue-400 tracking-wider uppercase"
        >
          Portfolio
        </motion.h2>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">{profile.name}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-900 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium"
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
            className="px-8 py-3 rounded-full glass text-gray-900 dark:text-white font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-all hover:scale-105"
          >
            About Me
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
