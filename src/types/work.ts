import type { MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk';

export type WorkCategory = '個人開発' | '学習課題';

export type Work = {
  title: string;
  summary?: string;
  // セレクトフィールドなので、1つだけ選んでも配列で返ってくる
  category: WorkCategory[];
  // リッチエディタの HTML
  description?: string;
  // 担当した範囲。複数行に分けて、制作協力なども補足できる
  role?: string;
  // 工夫した点。リッチエディタで見出し3と説明文を組み合わせる
  highlights?: string;
  // 1行目に「 / 」区切りで技術名、2行目以降に「用途：説明」や補足を書く
  technologies?: string;
  features?: string;
  background?: string;
  thumbnail?: MicroCMSImage;
  demoUrl?: string;
  githubUrl?: string;
  displayOrder?: number;
} & MicroCMSListContent;
