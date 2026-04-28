import { getWordsByTopic, getTopicNameById } from "@/lib/vocabData";
import FlashcardDeck from "@/components/FlashcardDeck";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const words = getWordsByTopic(resolvedParams.id);
  const topicName = getTopicNameById(resolvedParams.id);

  if (words.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Topic not found</h2>
        <Link href="/" className="text-primary-500 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex items-center space-x-4">
        <Link
          href="/"
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{topicName}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{words.length} words to master</p>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center py-8">
        <FlashcardDeck words={words} />
      </div>
    </div>
  );
}
