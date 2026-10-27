import type { MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk';

export type BlogArticle = {
  title: string;
  body: string;
  summary?: string;
  thumbnail?: MicroCMSImage;
} & MicroCMSListContent;
