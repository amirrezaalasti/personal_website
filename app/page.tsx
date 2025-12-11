import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsFeed from "@/components/NewsFeed";
import ProjectCard from "@/components/ProjectCard";
import projects from "@/data/projects.json";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredProjects = projects.slice(0, 2);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <Hero />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Latest News */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Latest News</h2>
              <Link href="/news" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="glass rounded-2xl p-8">
              <NewsFeed />
            </div>
          </div>

          {/* Featured Projects */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Featured Projects</h2>
              <Link href="/projects" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View Portfolio <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-6">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
