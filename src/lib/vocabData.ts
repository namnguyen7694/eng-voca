import { VocabWord, TopicInfo } from "@/types/vocab";
import chap1 from "../../data/chap_1.json";
import chap2 from "../../data/chap_2.json";
import chap3 from "../../data/chap_3.json";
import chap4 from "../../data/chap_4.json";
import chap5 from "../../data/chap_5.json";

const ALL_WORDS = [...chap1, ...chap2, ...chap3, ...chap4, ...chap5];

const dataMap: Record<string, VocabWord[]> = {
  business_office: chap1 as VocabWord[],
  tech_innovation: chap2 as VocabWord[],
  daily_life_abstract: chap3 as VocabWord[],
  travel_culture: chap4 as VocabWord[],
  finance_economy: chap5 as VocabWord[],
};

export function getTopicNameById(topicId: string): string {
  return topicId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export function getTopicKeyFromName(topicName: string): string {
  return topicName.toLowerCase().replaceAll(" & ", "_").replaceAll(" ", "_");
}
export function getTopics(): TopicInfo[] {
  const topics: TopicInfo[] = [];

  for (const [key, words] of Object.entries(dataMap)) {
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

export function getWordsByTopic(topicId: string): VocabWord[] {
  console.log("getWordsByTopic topicId", topicId);
  return dataMap[topicId] || [];
}

export function getVocabData(topicId?: string): VocabWord[] {
  if (topicId) return getWordsByTopic(topicId);
  return ALL_WORDS;
}

export interface QuizQuestion {
  word: VocabWord;
  options: string[];
  correctAnswer: string;
}

export function generateQuizQuestions(wordsToQuiz: VocabWord[], allWords: VocabWord[], amount: number): QuizQuestion[] {
  // 1. Pick random words for questions
  const shuffledWords = [...wordsToQuiz].sort(() => Math.random() - 0.5);
  const selectedWords = shuffledWords.slice(0, amount);

  // 2. Generate options for each question
  return selectedWords.map((word) => {
    // Lọc các từ khác nhưng cùng chung topic
    const topicKey = getTopicKeyFromName(word.topic);
    let distractorsPool = getWordsByTopic(topicKey).filter((w) => w.id !== word.id && w.meaning_vi !== word.meaning_vi);
    console.log("generateQuizQuestions word", word);
    console.log("generateQuizQuestions topicKey", topicKey);
    console.log("generateQuizQuestions distractorsPool", distractorsPool);
    // Đề phòng trường hợp topic có quá ít từ (ít khi xảy ra với data hiện tại)
    if (distractorsPool.length < 3) {
      console.log("generateQuizQuestions less than 3");
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
