/**
 * Quick Placeholder Image Solution
 *
 * This script generates placeholder images using Unsplash Source
 * No API key required - perfect for quick testing!
 *
 * Usage: node download-placeholder-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Image mapping with search terms
const IMAGES = [
  { file: 'healthy-breakfast-recipes.jpg', query: 'healthy-breakfast' },
  { file: 'healthy-smoothie-recipes.jpg', query: 'smoothie-bowl' },
  { file: 'healthy-tuna-salad.jpg', query: 'tuna-salad' },
  { file: 'healthy-chicken-and-rice.jpg', query: 'chicken-rice' },
  { file: 'healthy-snack-recipes.jpg', query: 'healthy-snacks' },
  { file: 'healthy-dinner-recipes.jpg', query: 'healthy-dinner' },
  { file: 'healthy-pasta-recipes.jpg', query: 'healthy-pasta' },
  { file: 'healthy-dessert-recipes.jpg', query: 'healthy-dessert' },
  { file: 'healthy-air-fryer-recipes.jpg', query: 'air-fryer' },
  { file: 'healthy-crockpot-recipes.jpg', query: 'slow-cooker' },
  { file: 'healthy-banana-bread.jpg', query: 'banana-bread' },
  { file: 'healthy-chicken-recipes.jpg', query: 'grilled-chicken' },
  { file: 'high-protein-meal-prep.jpg', query: 'meal-prep' },
  { file: 'meal-prep-for-beginners.jpg', query: 'meal-prep-kitchen' },
  { file: 'meal-prep-ideas.jpg', query: 'meal-containers' },
  { file: 'meal-prep-grocery-list.jpg', query: 'grocery-shopping' },
  { file: 'meal-prep-for-weight-loss.jpg', query: 'healthy-portions' },
  { file: 'vegan-meal-prep.jpg', query: 'vegan-food' },
  { file: 'meal-prep-containers.jpg', query: 'food-containers' },
  { file: 'clean-simple-eats-products.jpg', query: 'whole-foods' },
  { file: 'clean-eating-snacks.jpg', query: 'vegetable-platter' },
  { file: 'clean-eating-meal-plan.jpg', query: 'meal-planning' },
  { file: 'what-is-clean-eating.jpg', query: 'fresh-vegetables' },
  { file: 'clean-eating-food-list.jpg', query: 'organic-food' },
  { file: 'healthy-eating-for-skin.jpg', query: 'salmon-avocado' },
  { file: 'healthy-eating-for-beginners.jpg', query: 'balanced-meal' },
  { file: 'healthy-eating-for-pcos.jpg', query: 'leafy-greens' },
  { file: 'harvard-healthy-eating-plate.jpg', query: 'balanced-plate' },
  { file: 'eating-healthy-on-a-budget.jpg', query: 'budget-groceries' },
  { file: 'healthy-eating-grocery-list.jpg', query: 'grocery-list' },
  { file: 'meal-planner.jpg', query: 'meal-planner' }
];

const OUTPUT_DIR = path.join(__dirname, 'public', 'images', 'covers');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Download image using Unsplash Source (no API key needed!)
 */
function downloadImage(filename, query) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(OUTPUT_DIR, filename);

    // Unsplash Source URL - free, no API key required
    const url = `https://source.unsplash.com/1200x630/?${query}`;

    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ Downloaded: ${filename}`);
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting placeholder image download...\n');
  console.log('📝 Using Unsplash Source (no API key required)\n');
  console.log('⚠️  Note: Images are random and may vary each time\n');
  console.log('=' .repeat(60));

  let successCount = 0;
  let failCount = 0;

  for (const img of IMAGES) {
    try {
      await downloadImage(img.file, img.query);
      successCount++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed: ${img.file} - ${error.message}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${successCount} images`);
  console.log(`❌ Failed: ${failCount} images`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
  console.log('\n💡 Tip: For better quality and consistency, use download-images.js with an Unsplash API key');
}

main().catch(console.error);
