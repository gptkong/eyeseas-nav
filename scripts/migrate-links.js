/**
 * Migration script to convert existing links from category-based to dual-URL structure
 * 
 * This script will:
 * 1. Read all existing links from Redis
 * 2. Convert them to the new structure with internalUrl and externalUrl
 * 3. For existing links, duplicate the URL to both internal and external
 * 4. Remove the category field
 * 
 * Run this script after updating the code but before using the new structure
 */

const { createClient } = require('redis');

async function migrateLinks() {
  const redis = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  try {
    await redis.connect();
    console.log('Connected to Redis');

    // Get all link keys
    const linkKeys = await redis.keys('link:*');
    console.log(`Found ${linkKeys.length} links to migrate`);

    for (const key of linkKeys) {
      const linkData = await redis.hGetAll(key);
      
      if (linkData && linkData.url && linkData.category) {
        console.log(`Migrating link: ${linkData.title}`);
        
        // Create new structure
        const migratedLink = {
          ...linkData,
          internalUrl: linkData.url, // Use existing URL as both internal and external
          externalUrl: linkData.url,
          // Remove category field
        };
        
        // Remove the old category field
        delete migratedLink.category;
        delete migratedLink.url;
        
        // Update the link in Redis
        await redis.hSet(key, migratedLink);
        console.log(`✓ Migrated: ${linkData.title}`);
      }
    }

    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await redis.disconnect();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateLinks();
}

module.exports = { migrateLinks };
