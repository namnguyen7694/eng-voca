import { getTopics } from "@/lib/vocabData";
import TopicList from "@/components/TopicList";

export default function Home() {
  const topics = getTopics();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Let&apos;s learn some <span className="text-primary-500">English!</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Select a topic below to start flipping cards and expanding your vocabulary.
        </p>
      </header>

      <TopicList topics={topics} />
    </div>
  );
}
