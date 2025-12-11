import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import profile from "@/data/profile.json";
import certificates from "@/data/certificates.json";
import { Briefcase, GraduationCap, Code, Award, Heart, FileCheck, ExternalLink, Globe, Mail } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* About Section */}
          <section className="space-y-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">About Me</h1>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2 glass rounded-2xl p-8 text-gray-900 dark:text-gray-300 leading-relaxed text-lg font-medium">
                {profile.about}
              </div>
              <div className="relative h-64 md:h-full min-h-[250px] rounded-2xl overflow-hidden glass">
                <Image 
                  src="https://www.uni-hannover.de/typo3temp/assets/_processed_/6/4/csm_e454b9bee479fdd5267495b3f1727b68012fd8de-fp-5-2-0-0_647f82dacd.jpg" 
                  alt="Leibniz University Hannover" 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Briefcase className="text-blue-600 dark:text-blue-400" /> Experience
            </div>
            <div className="space-y-6">
              {profile.experience.map((job, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-black dark:text-white">{job.title}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full font-medium">{job.period}</span>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium mb-4">{job.company} &middot; {job.type}</div>
                  <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed font-medium">{job.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <GraduationCap className="text-purple-600 dark:text-purple-400" /> Education
            </div>
            <div className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-black dark:text-white">{edu.school}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full font-medium">{edu.period}</span>
                  </div>
                  <div className="text-purple-600 dark:text-purple-400 font-medium mb-2">{edu.degree}</div>
                  {edu.grade && <div className="text-sm text-gray-600 dark:text-gray-500 font-medium">Grade: {edu.grade}</div>}
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Code className="text-green-600 dark:text-green-400" /> Skills
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors cursor-default font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Languages Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Globe className="text-cyan-600 dark:text-cyan-400" /> Languages
            </div>
            <div className="glass rounded-2xl p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {profile.languages.map((lang, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{lang.language}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Awards Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Award className="text-yellow-600 dark:text-yellow-400" /> Honors & Awards
            </div>
            <div className="space-y-6">
              {profile.awards.map((award, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-black dark:text-white">{award.title}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full font-medium">{award.date}</span>
                  </div>
                  <div className="text-yellow-600 dark:text-yellow-400 font-medium mb-2">{award.issuer}</div>
                  <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed font-medium">{award.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Volunteering Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Heart className="text-red-600 dark:text-red-400" /> Volunteering
            </div>
            <div className="space-y-6">
              {profile.volunteering.map((vol, index) => (
                <div key={index} className="glass-card rounded-xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-black dark:text-white">{vol.role}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full font-medium">{vol.date}</span>
                  </div>
                  <div className="text-red-600 dark:text-red-400 font-medium mb-2">{vol.organization}</div>
                  <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed font-medium">{vol.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Certificates Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <FileCheck className="text-blue-600 dark:text-blue-400" /> Certificates
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert, index) => (
                <a key={index} href={cert.link} target="_blank" rel="noopener noreferrer" className="glass-card rounded-xl p-6 flex items-center justify-between group">
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cert.title}</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{cert.issuer} &middot; {cert.date}</div>
                  </div>
                  <ExternalLink size={18} className="text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Mail className="text-purple-600 dark:text-purple-400" /> Contact Me
            </div>
            <div className="glass rounded-2xl p-8">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Feel free to reach out to me via email:
              </p>
              <div className="space-y-4">
                <a href="mailto:amirrezaalasti@gmail.com" className="flex items-center gap-3 text-gray-900 dark:text-white hover:text-blue-500 transition-colors">
                  <Mail size={20} className="text-blue-400" />
                  amirrezaalasti@gmail.com
                </a>
                <a href="mailto:amirreza.alasti@stud.uni-hannover.de" className="flex items-center gap-3 text-gray-900 dark:text-white hover:text-blue-500 transition-colors">
                  <Mail size={20} className="text-blue-400" />
                  amirreza.alasti@stud.uni-hannover.de
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
