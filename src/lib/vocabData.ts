import { VocabWord, TopicInfo } from "@/types/vocab";
import chap1 from "../../data/chap_1.json";
import chap2 from "../../data/chap_2.json";
import chap3 from "../../data/chap_3.json";
import chap4 from "../../data/chap_4.json";
import chap5 from "../../data/chap_5.json";
import basicChap1 from "../../data/basic_chap_1.json";
import basicChap2 from "../../data/basic_chap_2.json";
import basicChap3 from "../../data/basic_chap_3.json";
import basicChap4 from "../../data/basic_chap_4.json";
import basicChap5 from "../../data/basic_chap_5.json";

export function getTopicKeyFromName(topicName: string): string {
  return topicName.toLowerCase().replaceAll(" & ", "_").replaceAll(" ", "_");
}

export type VocabLevel = "low" | "high";

const HIGH_LEVEL_WORDS = [...chap1, ...chap2, ...chap3, ...chap4, ...chap5] as VocabWord[];
const LOW_LEVEL_WORDS = [...basicChap1, ...basicChap2, ...basicChap3, ...basicChap4, ...basicChap5] as VocabWord[];

const highDataMap: Record<string, VocabWord[]> = {
  business_office: chap1 as VocabWord[],
  tech_innovation: chap2 as VocabWord[],
  daily_life_abstract: chap3 as VocabWord[],
  travel_culture: chap4 as VocabWord[],
  finance_economy: chap5 as VocabWord[],
};

// Map for low level, fixed keys for the 5 topics
const lowDataMap: Record<string, VocabWord[]> = {
  professional_communication: basicChap1 as VocabWord[],
  workplace_dynamics_culture: basicChap2 as VocabWord[],
  business_strategy_markets: basicChap3 as VocabWord[],
  productivity_professional_growth: basicChap4 as VocabWord[],
  analysis_critical_thinking: basicChap5 as VocabWord[],
};

export function getTopicNameById(topicId: string): string {
  return topicId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
