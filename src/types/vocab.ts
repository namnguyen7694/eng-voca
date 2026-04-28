export interface VocabWord {
  id: number;
  word: string;
  phonetic: string;
  pos: string;
  meaning_vi: string;
  example_en: string;
  example_vi: string;
  topic: string;
  level: string;
}

export interface TopicInfo {
  id: string;
  name: string;
  totalWords: number;
  previewWords: string[];
  wordIds: number[];
}
