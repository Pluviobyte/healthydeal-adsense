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

  // Load all posts across sections
  const collections = await Promise.all(SECTIONS.map((s) => getCollection(s)));
  const allPosts = collections.flat();

  const sm = new SitemapStream({ hostname: origin });

  for (const post of allPosts) {
    const url = `/${post.collection}/${post.slug}/`;
    const lastmod = toDate(post.data.updated) || toDate(post.data.date) || undefined;

    let imgAbs: string | undefined;
    const cover = post.data.coverImage as string | undefined;
    if (cover) {
      try {
        imgAbs = cover.startsWith('http') ? cover : new URL(cover, origin).toString();
      } catch {
        // ignore bad URLs
      }
    }

    sm.write({
      url,
      lastmod,
      changefreq: 'weekly',
      priority: 0.7,
      ...(imgAbs ? { img: [{ url: imgAbs }] } : {})
    });
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

