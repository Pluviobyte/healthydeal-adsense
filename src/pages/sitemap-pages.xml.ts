import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SitemapStream, streamToPromise } from 'sitemap';
import { SECTIONS } from '../utils/content';

function toDate(input: unknown): Date | null {
  if (!input) return null;
  try {
    if (input instanceof Date) return input;
    return new Date(String(input));
  } catch {
    return null;
  }
}

export async function GET({ site }: APIContext) {
  const origin = (site ? site.toString() : 'https://www.gencoser.com').replace(/\/$/, '');

  // Load all posts to compute lastmod for home/sections
  const collections = await Promise.all(SECTIONS.map((s) => getCollection(s)));
  const allPosts = collections.flat();

  let latestAll = new Date(0);
  const latestBySection: Record<string, Date> = {};
  for (const section of SECTIONS) latestBySection[section] = new Date(0);

  for (const entry of allPosts) {
    const last = toDate(entry.data.updated) || toDate(entry.data.date);
    if (last && last > latestAll) latestAll = last;
    const sec = entry.collection;
    if (last && last > latestBySection[sec]) latestBySection[sec] = last;
  }

  const sm = new SitemapStream({ hostname: origin });

  // Home page (high-value)
  sm.write({
    url: '/',
    lastmod: latestAll > new Date(0) ? latestAll : undefined,
    changefreq: 'daily',
    priority: 0.9,
    img: [{ url: `${origin}/images/og/home.jpg` }]
  });

  // Section hubs (high-value)
  for (const section of SECTIONS) {
    sm.write({
      url: `/${section}/`,
      lastmod: latestBySection[section] > new Date(0) ? latestBySection[section] : undefined,
      changefreq: 'weekly',
      priority: 0.8,
      img: [{ url: `${origin}/images/og/home.jpg` }]
    });
  }

  // Static utility pages (lower priority)
  const staticPages = [
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/affiliate-disclosure',
    '/medical-disclaimer',
    '/editorial-policy'
  ];
  for (const path of staticPages) {
    sm.write({ url: path, changefreq: 'yearly', priority: 0.3 });
  }

  sm.end();
  const xml = (await streamToPromise(sm)).toString();
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate'
    }
  });
}

