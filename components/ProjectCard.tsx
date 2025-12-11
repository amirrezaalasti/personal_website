import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProjectProps {
  title: string;
  description: string;
  tags: string[];
  links?: { type: string; url: string }[];
}

export default function ProjectCard({ title, description, tags, links }: ProjectProps) {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
        <div className="flex gap-3">
          {links?.map((link, index) => (
            <a 
              key={index}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              title={link.type === 'github' ? 'View Code' : 'View Project'}
            >
              {link.type === 'github' ? <Github size={20} /> : <ExternalLink size={20} />}
            </a>
          ))}
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-400 mb-6 flex-grow font-medium">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-black/10 dark:bg-white/5 text-gray-800 dark:text-gray-300 border border-black/10 dark:border-white/10">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
