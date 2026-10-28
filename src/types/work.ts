import type { MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk';

export type WorkCategory = '個人開発' | '学習課題';

export type Work = {
  title: string;
  summary?: string;
  // セレクトフィールドなので、1つだけ選んでも配列で返ってくる
  category: WorkCategory[];
  // リッチエディタの HTML
  description?: string;
  // 1行目に「 / 」区切りで技術名、2行目以降に補足を書く
  technologies?: string;
  features?: string;
  background?: string;
  thumbnail?: MicroCMSImage;
  demoUrl?: string;
  githubUrl?: string;
  displayOrder?: number;
} & MicroCMSListContent;
