import { VocabWord, TopicInfo } from "@/types/vocab";
import chap1 from "../../data/chap_1.json";
import chap2 from "../../data/chap_2.json";
import chap3 from "../../data/chap_3.json";
import chap4 from "../../data/chap_4.json";
import chap5 from "../../data/chap_5.json";
import basicLevel from "../../data/basic_level.json";

export type VocabLevel = "low" | "high";

const HIGH_LEVEL_WORDS = [...chap1, ...chap2, ...chap3, ...chap4, ...chap5] as VocabWord[];
const LOW_LEVEL_WORDS = basicLevel as VocabWord[];

const highDataMap: Record<string, VocabWord[]> = {
  business_office: chap1 as VocabWord[],
  tech_innovation: chap2 as VocabWord[],
  daily_life_abstract: chap3 as VocabWord[],
  travel_culture: chap4 as VocabWord[],
  finance_economy: chap5 as VocabWord[],
};

// Map for low level, grouping by topic from the flat basic_level.json
const lowDataMap: Record<string, VocabWord[]> = {};
LOW_LEVEL_WORDS.forEach((word) => {
  const topicKey = word.topic.toLowerCase().replaceAll(" & ", "_").replaceAll(" ", "_");
  if (!lowDataMap[topicKey]) {
    lowDataMap[topicKey] = [];
  }
  lowDataMap[topicKey].push(word);
});

export function getTopicNameById(topicId: string): string {
  return topicId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getTopicKeyFromName(topicName: string): string {
  return topicName.toLowerCase().replaceAll(" & ", "_").replaceAll(" ", "_");
}

export function getTopics(level: VocabLevel = "high"): TopicInfo[] {
  const topics: TopicInfo[] = [];
  const currentMap = level === "high" ? highDataMap : lowDataMap;

  for (const [key, words] of Object.entries(currentMap)) {
    topics.push({
      id: key,
      name: getTopicNameById(key),
      totalWords: words.length,
      previewWords: words.slice(0, 3).map((w) => w.word),
      wordIds: words.map((w) => w.id),
    });
  }

  return topics;
}

export function getVocabData(topicId?: string, level: VocabLevel = "high"): VocabWord[] {
  const currentMap = level === "high" ? highDataMap : lowDataMap;
  if (topicId) return currentMap[topicId] || [];
  return level === "high" ? HIGH_LEVEL_WORDS : LOW_LEVEL_WORDS;
}

export interface QuizQuestion {
  word: VocabWord;
  options: string[];
  correctAnswer: string;
}

export function generateQuizQuestions(
  wordsToQuiz: VocabWord[],
  allWords: VocabWord[],
  amount: number,
  level: VocabLevel = "high",
): QuizQuestion[] {
  // 1. Pick random words for questions
  const shuffledWords = [...wordsToQuiz].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(0, amount);

  // 2. Generate options for each question
  return selectedWords.map((word) => {
    // Lọc các từ khác nhưng cùng chung topic
    const topicKey = getTopicKeyFromName(word.topic);
    let distractorsPool = getVocabData(topicKey, level).filter(
      (w) => w.id !== word.id && w.meaning_vi !== word.meaning_vi,
    );

    // Đề phòng trường hợp topic có quá ít từ (ít khi xảy ra với data hiện tại)
    if (distractorsPool.length < 3) {
      const otherWords = allWords.filter((w) => w.id !== word.id && w.meaning_vi !== word.meaning_vi);
      distractorsPool = [...distractorsPool, ...otherWords];
    }

    const distractors = [...distractorsPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.meaning_vi);

    // Combine correct and distractors, then shuffle
    const options = [word.meaning_vi, ...distractors].sort(() => Math.random() - 0.5);

    return {
      word,
      options,
      correctAnswer: word.meaning_vi,
    };
  });
}
