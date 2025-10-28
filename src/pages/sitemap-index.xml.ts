import type { APIContext } from 'astro';

export async function GET({ site }: APIContext) {
  const origin = (site ? site.toString() : 'https://www.gencoser.com').replace(/\/$/, '');
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <sitemap>\n` +
    `    <loc>${origin}/sitemap-pages.xml</loc>\n` +
    `    <lastmod>${now}</lastmod>\n` +
    `  </sitemap>\n` +
    `  <sitemap>\n` +
    `    <loc>${origin}/sitemap-posts.xml</loc>\n` +
    `    <lastmod>${now}</lastmod>\n` +
    `  </sitemap>\n` +
    `</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate'
    }
  });
}

