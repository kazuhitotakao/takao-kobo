import 'server-only';
import { createClient } from 'microcms-js-sdk';

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error('microCMSの環境変数が設定されていません。');
}

export const microcmsClient = createClient({
  serviceDomain,
  apiKey,
});
