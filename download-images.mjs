/**
 * Automatic Image Downloader using Unsplash API
 *
 * This script downloads high-quality, royalty-free images from Unsplash
 * for all blog articles based on their content.
 *
 * Usage: UNSPLASH_ACCESS_KEY=your_key node download-images.mjs
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image mapping: filename -> Unsplash search query
const IMAGE_MAP = {
  // Healthy Recipes
  'healthy-breakfast-recipes.jpg': 'healthy breakfast bowl colorful nutritious',
  'healthy-smoothie-recipes.jpg': 'colorful smoothie bowls fruits vegetables',
  'healthy-tuna-salad.jpg': 'tuna salad bowl fresh vegetables',
  'healthy-chicken-and-rice.jpg': 'grilled chicken rice vegetables meal',
  'healthy-snack-recipes.jpg': 'healthy snacks nuts fruits vegetables',
  'healthy-dinner-recipes.jpg': 'healthy dinner plate balanced meal',
  'healthy-pasta-recipes.jpg': 'whole grain pasta vegetables healthy',
  'healthy-dessert-recipes.jpg': 'healthy dessert fruit yogurt',
  'healthy-air-fryer-recipes.jpg': 'air fryer cooking healthy food',
  'healthy-crockpot-recipes.jpg': 'slow cooker healthy meal',
  'healthy-banana-bread.jpg': 'banana bread sliced healthy',
  'healthy-chicken-recipes.jpg': 'grilled chicken breast herbs',

  // Meal Prep
  'high-protein-meal-prep.jpg': 'meal prep containers protein chicken',
  'meal-prep-for-beginners.jpg': 'meal prep containers organized kitchen',
  'meal-prep-ideas.jpg': 'multiple meal prep containers colorful',
  'meal-prep-grocery-list.jpg': 'grocery shopping fresh vegetables',
  'meal-prep-for-weight-loss.jpg': 'healthy portion meal prep containers',
  'vegan-meal-prep.jpg': 'vegan meal prep plant based',
  'meal-prep-containers.jpg': 'glass meal prep containers organized',

  // Clean Eating
  'clean-simple-eats-products.jpg': 'clean eating healthy ingredients',
  'clean-eating-snacks.jpg': 'healthy snacks vegetables hummus',
  'clean-eating-meal-plan.jpg': 'meal planning notebook fresh food',
  'what-is-clean-eating.jpg': 'fresh vegetables whole foods market',
  'clean-eating-food-list.jpg': 'variety fresh vegetables fruits',

  // Healthy Eating
  'healthy-eating-for-skin.jpg': 'woman healthy skin fresh fruits',
  'healthy-eating-for-beginners.jpg': 'healthy eating balanced plate',
  'healthy-eating-for-pcos.jpg': 'balanced meal hormonal health',
  'harvard-healthy-eating-plate.jpg': 'balanced plate vegetables protein',
  'eating-healthy-on-a-budget.jpg': 'affordable vegetables grocery shopping',
  'healthy-eating-grocery-list.jpg': 'grocery list fresh produce',

  // Resources
  'meal-planner.jpg': 'weekly meal planner notebook pen'
};

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'covers');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✅ Created directory: ${OUTPUT_DIR}`);
}

/**
 * Search Unsplash for an image
 */
function searchUnsplash(query) {
  return new Promise((resolve, reject) => {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

    const options = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            resolve(json.results[0]);
          } else {
            reject(new Error('No images found'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download image from URL
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Download image and save attribution
 */
async function downloadImageWithAttribution(filename, query) {
  try {
    const result = await searchUnsplash(query);
    const imageUrl = result.urls.regular;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Download image
    await downloadImage(imageUrl, filepath);

    // Save attribution info
    const attribution = {
      photographer: result.user.name,
      photographer_url: result.user.links.html,
      unsplash_url: result.links.html,
      download_date: new Date().toISOString()
    };

    const attrFile = filepath.replace('.jpg', '.json');
    fs.writeFileSync(attrFile, JSON.stringify(attribution, null, 2));

    console.log(`✅ Downloaded: ${filename} (by ${attribution.photographer})`);

    // Rate limiting: Unsplash allows 50 requests per hour for free tier
    await new Promise(resolve => setTimeout(resolve, 2000));

    return attribution;
  } catch (error) {
    console.error(`❌ Failed to download ${filename}:`, error.message);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error('❌ Error: UNSPLASH_ACCESS_KEY environment variable not set');
    console.log('\nTo get started:');
    console.log('1. Visit https://unsplash.com/developers');
    console.log('2. Create a new application (free)');
    console.log('3. Copy your Access Key');
    console.log('4. Run: UNSPLASH_ACCESS_KEY=your_key_here node download-images.mjs');
    process.exit(1);
  }

  console.log(`🚀 Starting image download for ${Object.keys(IMAGE_MAP).length} images...\n`);

  const attributions = {};
  let successCount = 0;
  let failCount = 0;

  for (const [filename, query] of Object.entries(IMAGE_MAP)) {
    const result = await downloadImageWithAttribution(filename, query);

    if (result) {
      attributions[filename] = result;
      successCount++;
    } else {
      failCount++;
    }
  }

  // Save master attribution file
  const masterAttrFile = path.join(OUTPUT_DIR, '_attributions.json');
  fs.writeFileSync(masterAttrFile, JSON.stringify(attributions, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${successCount} images downloaded`);
  console.log(`❌ Failed: ${failCount} images`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📝 Attributions saved to: ${masterAttrFile}`);
  console.log('='.repeat(60));
}

// Run the script
main().catch(console.error);
