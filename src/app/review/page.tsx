import { getVocabData } from "@/lib/vocabData";
import ReviewContent from "@/components/ReviewContent";

export default async function ReviewPage() {
  const allWords = await getVocabData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Review & <span className="text-warning-500">Master</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          Focus on the words you found difficult or saved for later.
        </p>
      </header>

      <ReviewContent allWords={allWords} />
    </div>
  );
}
