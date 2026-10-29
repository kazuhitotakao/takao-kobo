import type { MetadataRoute } from 'next';
import { siteDescription, siteName } from '@/lib/metadata';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: siteDescription,
    lang: 'ja',
    start_url: '/',
    display: 'browser',
    icons: [{ src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  };
}
