import { VocabWord, TopicInfo } from "@/types/vocab";
import chap1 from "../../data/chap_1.json";
import chap2 from "../../data/chap_2.json";
import chap3 from "../../data/chap_3.json";
import chap4 from "../../data/chap_4.json";
import chap5 from "../../data/chap_5.json";

const dataMap: Record<string, VocabWord[]> = {
  business_office: chap1 as VocabWord[],
  daily_life_abstract: chap2 as VocabWord[],
  tech_innovation: chap3 as VocabWord[],
  finance_economy: chap4 as VocabWord[],
  science_nature: chap5 as VocabWord[],
};

export function getTopicNameById(topicId: string): string {
  return topicId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
  return dataMap[topicId] || [];
}

export function getVocabData(): VocabWord[] {
  let allWords: VocabWord[] = [];
  for (const words of Object.values(dataMap)) {
    allWords = allWords.concat(words);
  }
  return allWords;
}
