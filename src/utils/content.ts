import { getCollection, type CollectionEntry } from 'astro:content';

export const SECTIONS = [
  'healthy-eating',
  'clean-eating',
  'meal-prep',
  'healthy-recipes',
  'resources'
] as const;

export type Section = (typeof SECTIONS)[number];

export const SECTION_COPY: Record<
  Section,
  {
    title: string;
    description: string;
    hero: string;
    related: string[];
  }
> = {
  'healthy-eating': {
    title: 'Healthy Eating',
    description: 'Foundations, grocery lists, and plate-building frameworks for sustainable healthy eating.',
    hero: 'Evidence-based nutrition guides, shopping lists, and habit builders to help you eat well every day.',
    related: ['clean-eating', 'meal-prep', 'healthy-recipes']
  },
  'clean-eating': {
    title: 'Clean Eating',
    description: 'Ingredient-focused swaps, meal plans, and pantry staples for a cleaner kitchen.',
    hero: 'Wholesome meal ideas, clean grocery lists, and fuss-free recipes built around whole ingredients.',
    related: ['healthy-eating', 'meal-prep', 'healthy-recipes']
  },
  'meal-prep': {
    title: 'Meal Prep',
    description: 'Batch cooking playbooks, grocery lists, and high-protein meal prep strategies.',
    hero: 'Weekly meal prep systems, container reviews, and make-ahead recipes to simplify busy weeks.',
    related: ['healthy-eating', 'clean-eating', 'healthy-recipes']
  },
  'healthy-recipes': {
    title: 'Healthy Recipes',
    description: 'Meal-type, diet, and cooking-method collections covering every healthy craving.',
    hero: 'Nutrient-dense recipes sorted by meal, ingredient, diet, and cooking method so you never run out of ideas.',
    related: ['meal-prep', 'healthy-eating', 'clean-eating']
  },
  resources: {
    title: 'Resources',
    description: 'Downloadable PDFs, meal planners, and cheat sheets to support your routine.',
    hero: 'Workbooks, templates, and printable guides that keep your healthy eating habits on track.',
    related: ['meal-prep', 'healthy-eating', 'clean-eating']
  }
};

type ContentEntry = CollectionEntry<Section>;

export function getSectionTitle(section: string) {
  if (SECTION_COPY[section as Section]) {
    return SECTION_COPY[section as Section].title;
  }
  return section
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

export function formatDisplayDate(input?: Date | string | null) {
  if (!input) return '';
  const date = input instanceof Date ? input : new Date(input);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export async function getSectionPosts(section: Section) {
  const entries = await getCollection(section);
  return sortByDate(entries);
}

export async function getFeaturedPosts(section: Section) {
  const entries = await getCollection(section, ({ data }) => data.featured === true);
  return sortByDate(entries);
}

export async function getLatestPosts(limit = 6) {
  const collections = await Promise.all(SECTIONS.map((section) => getCollection(section)));
  const combined = collections.flat();
  return sortByDate(combined).slice(0, limit);
}

export async function loadRelatedPosts({
  section,
  slug,
  tags = [],
  limit = 4
}: {
  section: Section;
  slug: string;
  tags?: string[];
  limit?: number;
}): Promise<ContentEntry[]> {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());
  const entries = await getCollection(section);
  const filtered = entries
    .filter((entry) => entry.slug !== slug)
    .sort((a, b) => {
      const sharedA = countSharedTags(normalizedTags, a.data.tags ?? []);
      const sharedB = countSharedTags(normalizedTags, b.data.tags ?? []);
      if (sharedA === sharedB) {
        return b.data.date.getTime() - a.data.date.getTime();
      }
      return sharedB - sharedA;
    });

  return filtered.slice(0, limit);
}

export function getTagFilters(posts: ContentEntry[], limit = 12) {
  const tagCounter = new Map<string, number>();
  posts.forEach((post) => {
    (post.data.tags ?? []).forEach((tag) => {
      const key = tag.toLowerCase();
      tagCounter.set(key, (tagCounter.get(key) ?? 0) + 1);
    });
  });
  return Array.from(tagCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => capitalizeTag(tag));
}

export function capitalizeTag(tag: string) {
  return tag
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sortByDate(entries: ContentEntry[]) {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

function countSharedTags(sourceTags: string[], compareTags: string[]) {
  if (!sourceTags.length || !compareTags.length) return 0;
  const compare = new Set(compareTags.map((tag) => tag.toLowerCase()));
  return sourceTags.reduce((total, tag) => (compare.has(tag) ? total + 1 : total), 0);
}
