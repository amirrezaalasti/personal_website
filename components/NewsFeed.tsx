import news from "@/data/news.json";

export default function NewsFeed() {
  return (
    <div className="space-y-8">
      {news.map((item, index) => (
        <div key={index} className="relative pl-8 border-l border-black/20 dark:border-white/10 last:border-0 pb-8 last:pb-0">
          <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
          <span className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-1 block font-bold">{item.date}</span>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
          <p className="text-gray-700 dark:text-gray-400 text-sm leading-relaxed font-medium">{item.content}</p>
        </div>
      ))}
    </div>
  );
}
