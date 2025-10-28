import type { CollectionEntry } from 'astro:content';
import type { Section } from './content';

type ContentEntry = CollectionEntry<
  'healthy-eating' | 'clean-eating' | 'meal-prep' | 'healthy-recipes' | 'resources'
>;

interface SeoResult {
  title: string;
  description: string;
  canonical: string;
  meta: Record<string, string>[];
}

interface BaseSeoInput {
  title: string;
  description: string;
  url: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'recipe';
  keywords?: string[];
}

export function buildSeoMeta({
  title,
  description,
  url,
  canonical,
  image,
  type = 'website',
  keywords = []
}: BaseSeoInput): SeoResult {
  const canonicalUrl = canonical ?? url;

  const meta: Record<string, string>[] = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: type },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description }
  ];

  if (image) {
    meta.push({ property: 'og:image', content: image });
    meta.push({ name: 'twitter:image', content: image });
  }

  if (keywords.length) {
    meta.push({ name: 'keywords', content: keywords.join(', ') });
  }

  return {
    title,
    description,
    canonical: canonicalUrl,
    meta
  };
}

export function buildListingMeta({
  title,
  description,
  url,
  keywords = []
}: {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
}): SeoResult {
  return buildSeoMeta({
    title,
    description,
    url,
    type: 'website',
    keywords
  });
}

export function buildHomeMeta(site: string): SeoResult {
  const baseUrl = site.endsWith('/') ? site.slice(0, -1) : site;
  return buildSeoMeta({
    title: 'Healthy Meal Hub — Clean Eating, Meal Prep, and Wholesome Recipes',
    description:
      'Weekly meal prep plans, clean eating grocery lists, and healthy recipes to help you build a sustainable, delicious routine.',
    url: site,
    image: `${baseUrl}/images/og/home.jpg`
  });
}

export function buildSectionMeta(section: Section, site: string): SeoResult {
  const sectionTitles = {
    'healthy-eating': 'Healthy Eating - Evidence-Based Nutrition Guides',
    'clean-eating': 'Clean Eating - Whole Food Recipes & Meal Plans',
    'meal-prep': 'Meal Prep - Batch Cooking & Weekly Planning',
    'healthy-recipes': 'Healthy Recipes - Nutrient-Dense Meal Ideas',
    'resources': 'Resources - Meal Planners & Shopping Lists'
  };

  const sectionDescriptions = {
    'healthy-eating': 'Expert-backed nutrition advice, balanced meal frameworks, and sustainable eating habits for long-term health.',
    'clean-eating': 'Whole ingredient-focused recipes, clean grocery swaps, and meal plans for a wholesome kitchen routine.',
    'meal-prep': 'Efficient batch cooking systems, container reviews, and prep-ahead strategies to simplify busy weeks.',
    'healthy-recipes': 'Delicious, nutrient-packed recipes organized by meal type, dietary needs, and cooking method.',
    'resources': 'Downloadable meal planners, shopping checklists, and cheat sheets to support your healthy lifestyle.'
  };

  const title = sectionTitles[section];
  const description = sectionDescriptions[section];
  const url = `${site}${section}/`;

  return buildSeoMeta({
    title,
    description,
    url,
    type: 'website'
  });
}

export function buildPostMeta(post: ContentEntry, site: string): SeoResult & { structuredData?: any } {
  const url = `${site}${post.collection}/${post.slug}/`;
  const image = post.data.coverImage
    ? post.data.coverImage.startsWith('http')
      ? post.data.coverImage
      : new URL(post.data.coverImage, site).toString()
    : undefined;

  // Sanitize frontmatter canonical: only trust same-host canonicals; otherwise fall back to auto URL
  let canonicalFromFrontmatter = post.data.canonical;
  try {
    if (canonicalFromFrontmatter) {
      const siteHost = new URL(site).host;
      const canonHost = new URL(canonicalFromFrontmatter).host;
      if (canonHost !== siteHost) {
        canonicalFromFrontmatter = undefined;
      }
    }
  } catch {
    canonicalFromFrontmatter = undefined;
  }

  const baseSeo = buildSeoMeta({
    title: post.data.title,
    description: post.data.description,
    url,
    canonical: canonicalFromFrontmatter,
    image,
    type: post.data.schemaType === 'Recipe' ? 'recipe' : 'article',
    keywords: post.data.keywords ?? []
  });

  // Add structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': post.data.schemaType || 'Article',
    headline: post.data.title,
    description: post.data.description,
    url: url,
    datePublished: post.data.date.toISOString(),
    dateModified: (post.data.updated || post.data.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: post.data.author || 'Healthy Meal Hub'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Healthy Meal Hub',
      url: site
    },
    ...(image && { image: image }),
    ...(post.data.schemaType === 'Recipe' && post.data.recipe && {
      recipe: {
        '@type': 'Recipe',
        name: post.data.title,
        description: post.data.description,
        ...(post.data.recipe.cookTime && { cookTime: post.data.recipe.cookTime }),
        ...(post.data.recipe.prepTime && { prepTime: post.data.recipe.prepTime }),
        ...(post.data.recipe.totalTime && { totalTime: post.data.recipe.totalTime }),
        ...(post.data.recipe.servings && { recipeYield: post.data.recipe.servings.toString() }),
        ...(post.data.recipe.ingredients && { recipeIngredient: post.data.recipe.ingredients }),
        ...(post.data.recipe.nutrition && { nutrition: post.data.recipe.nutrition })
      }
    })
  };

  return {
    ...baseSeo,
    structuredData
  };
}

export function canonicalFromPath(site: string, path: string) {
  const base = site.endsWith('/') ? site.slice(0, -1) : site;
  return `${base}${path}`;
}
