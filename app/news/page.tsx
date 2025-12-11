import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsFeed from "@/components/NewsFeed";

export default function News() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">News & Updates</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Latest updates from my professional journey.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 md:p-12">
            <NewsFeed />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
