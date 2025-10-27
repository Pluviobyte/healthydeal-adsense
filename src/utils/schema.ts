import type { CollectionEntry } from 'astro:content';
import type { Section } from './content';

type ContentEntry = CollectionEntry<
  'healthy-eating' | 'clean-eating' | 'meal-prep' | 'healthy-recipes' | 'resources'
>;

export function buildStructuredData({
  frontmatter,
  url
}: {
  frontmatter: ContentEntry['data'];
  url: string;
}) {
  const image = frontmatter.coverImage ? ensureAbsoluteUrl(url, frontmatter.coverImage) : undefined;
  const datePublished = frontmatter.date instanceof Date ? frontmatter.date.toISOString() : new Date(frontmatter.date).toISOString();
  const dateModified = frontmatter.updated
    ? frontmatter.updated instanceof Date
      ? frontmatter.updated.toISOString()
      : new Date(frontmatter.updated).toISOString()
    : datePublished;

  const baseSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': frontmatter.schemaType === 'Article' ? 'Article' : frontmatter.schemaType,
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: frontmatter.author ?? 'Editorial Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Healthy Meal Hub',
      logo: {
        '@type': 'ImageObject',
        url: ensureAbsoluteUrl(url, '/favicon.svg')
      }
    },
    mainEntityOfPage: url
  };

  if (image) {
    baseSchema.image = image;
  }

  const schemas: Record<string, unknown>[] = [baseSchema];

  if (frontmatter.schemaType === 'Recipe' && frontmatter.recipe) {
    const recipe = frontmatter.recipe;
    baseSchema['@type'] = 'Recipe';
    baseSchema['recipeCuisine'] = recipe.cuisine;
    baseSchema['recipeCategory'] = recipe.type;
    baseSchema['recipeYield'] = recipe.servings;
    baseSchema['recipeIngredient'] = recipe.ingredients;
    baseSchema['recipeInstructions'] = recipe.instructions?.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step
    }));
    baseSchema['nutrition'] = recipe.nutrition
      ? {
          '@type': 'NutritionInformation',
          calories: recipe.nutrition.calories,
          proteinContent: recipe.nutrition.protein,
          carbohydrateContent: recipe.nutrition.carbs,
          fatContent: recipe.nutrition.fat
        }
      : undefined;
    baseSchema['totalTime'] = recipe.totalTime;
    baseSchema['prepTime'] = recipe.prepTime;
    baseSchema['cookTime'] = recipe.cookTime;
  }

  if (frontmatter.schemaType === 'HowTo') {
    baseSchema['@type'] = 'HowTo';
    baseSchema['totalTime'] = frontmatter.recipe?.totalTime;
    baseSchema['estimatedCost'] = frontmatter.products?.length
      ? {
          '@type': 'MonetaryAmount',
          currency: 'USD'
        }
      : undefined;
  }

  if (frontmatter.schemaType === 'Product' && frontmatter.products?.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: frontmatter.title,
      description: frontmatter.description,
      itemListElement: frontmatter.products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          brand: product.brand,
          offers: product.price
            ? {
                '@type': 'Offer',
                price: product.price.replace(/[^0-9.]/g, ''),
                priceCurrency: 'USD'
              }
            : undefined,
          url: product.affiliateUrl ?? url,
          image: product.image ? ensureAbsoluteUrl(url, product.image) : undefined,
          review: product.pros?.length
            ? {
                '@type': 'Review',
                reviewBody: product.pros.join(', ')
              }
            : undefined
        }
      }))
    });
  }

  if (frontmatter.faq && frontmatter.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: frontmatter.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a
        }
      }))
    });
  }

  return schemas.filter(Boolean);
}

export function buildListingSchema({
  title,
  description,
  url,
  items,
  site
}: {
  title: string;
  description: string;
  url: string;
  items: ContentEntry[];
  site: string;
}) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: title,
      description,
      url,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: new URL(`/${item.collection}/${item.slug}/`, site).toString(),
        name: item.data.title
      }))
    }
  ];
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function ensureAbsoluteUrl(currentUrl: string, resource: string) {
  if (!resource) return undefined;
  if (resource.startsWith('http')) return resource;
  try {
    const url = new URL(currentUrl);
    return `${url.origin}${resource}`;
  } catch {
    return resource;
  }
}
