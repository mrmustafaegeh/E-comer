import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

// --------------------
// CATEGORIES
// --------------------
const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: "💻",
    gradient: "from-blue-500 to-purple-600",
    description: "Latest tech gadgets and devices",
    productCount: 0,
    isActive: true,
    displayOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: "👔",
    gradient: "from-purple-500 to-pink-600",
    description: "Trendy clothing and accessories",
    productCount: 0,
    isActive: true,
    displayOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Home & Living",
    slug: "home",
    icon: "🏠",
    gradient: "from-pink-500 to-orange-600",
    description: "Comfort essentials for your home",
    productCount: 0,
    isActive: true,
    displayOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sports",
    slug: "sports",
    icon: "⚽",
    gradient: "from-green-500 to-blue-600",
    description: "Sports equipment and fitness gear",
    productCount: 0,
    isActive: true,
    displayOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Books",
    slug: "books",
    icon: "📚",
    gradient: "from-yellow-500 to-orange-600",
    description: "Books, e-books and reading materials",
    productCount: 0,
    isActive: true,
    displayOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const adjectives = ["Premium", "Advanced", "Ultra", "Lite", "Pro", "Sleek", "Modern", "Classic", "Durable", "Comfortable", "Stylish", "Essential", "High-Performance", "Compact", "Luxury"];
const nouns = {
  electronics: ["Headphones", "Smartwatch", "Camera", "Laptop", "Phone", "Speaker", "Monitor", "Tablet", "Drone", "Console"],
  fashion: ["Jacket", "Sneakers", "T-Shirt", "Backpack", "Sunglasses", "Watch", "Hoodie", "Jeans", "Boots", "Hat"],
  home: ["Lamp", "Chair", "Desk", "Sofa", "Rug", "Pillow", "Planter", "Mirror", "Clock", "Organizer"],
  sports: ["Yoga Mat", "Dumbbells", "Running Shoes", "Water Bottle", "Gym Bag", "Bike Light", "Tennis Racket", "Gloves", "Tracker", "Jersey"],
  books: ["Novel", "Guide", "Handbook", "Biography", "Journal", "Cookbook", "Thriller", "Design Book", "History Book", "Science Book"]
};

// Base images from existing seed to reuse valid URLs
const baseImages = {
  electronics: [
    "/image/apple_earphone_image.png",
    "/image/bose_headphone_image.png",
    "/image/samsung_s23phone_image.png",
    "/image/venu_watch_image.png",
    "/image/playstation_image.png",
    "/image/cannon_camera_image.png",
    "/image/macbook_image.png",
    "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/wirrless-MnXsxlsfgdhpRlrcjPY7ug2xAxts74.jpg",
    "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/smart%20watch%20-KJr0JSFqheZxqyWmMu8P66S3aV4gqe.webp",
    "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/soney%20camera-43aoGLKQjpCa0RpLxrmhyqBaAhVg8F.jpg"
  ],
  fashion: [
    "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/glasses-ZS7FEhvU3PZGDowpGBmtIqAPjFwK5m.webp",
    "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/BackPack-w9r5BAHqeIbIpQUWrjkABZbZ978wsY.jpeg",
    // Fallbacks
    "https://placehold.co/400x400/550088/FFFFFF/png", 
    "https://placehold.co/400x400/AA0055/FFFFFF/png"
  ],
  sports: [
    "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/Adizero_EVO_SL_Shoes_Black_JP7149_HM1-L1QVQ2IQRuvbjKjebuRNEDaYgeGv5B.jpg",
    "/image/Fitbit Charge.jpeg"
  ],
  books: [
    "/image/Kindle Paperwh.jpg"
  ],
  home: [
      "/image/projector_image.png"
  ]
};

// Also add a generic pool
const genericImages = [
    "https://placehold.co/400x400/png",
    "https://placehold.co/400x400/e6e6e6/black/png"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProduct(index) {
  const category = getRandomItem(categories);
  const catSlug = category.slug;
  
  const adj = getRandomItem(adjectives);
  const noun = getRandomItem(nouns[catSlug] || nouns.electronics);
  
  const name = `${adj} ${noun} ${getRandomInt(1, 999)}`;
  const title = name;
  const slug = `${name.toLowerCase().replace(/ /g, "-")}-${index}`;
  
  const price = getRandomInt(10, 2000) + 0.99;
  const isSale = Math.random() > 0.7;
  const salePrice = isSale ? parseFloat((price * 0.8).toFixed(2)) : price;
  const discount = isSale ? "-20%" : null;
  const oldPrice = isSale ? price : null;
  
  // Pick image
  const catImages = baseImages[catSlug] || [];
  const pool = [...catImages, ...genericImages];
  const image = getRandomItem(pool);

  return {
    name,
    title,
    slug,
    description: `Experience the future of ${noun} with our ${name}. Designed for the modern user.`,
    price,
    salePrice,
    oldPrice,
    discount,
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
    category: catSlug,
    image,
    stock: getRandomInt(5, 200),
    numReviews: getRandomInt(0, 500),
    featured: Math.random() > 0.9,
    isFeatured: Math.random() > 0.9,
    featuredOrder: null,
    gradient: category.gradient,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function seed() {
  console.log("🌱 Starting MongoDB seeding (500 Products)...");

  if (!uri) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(process.env.MONGODB_DB);
    console.log("🧠 Using DB:", process.env.MONGODB_DB);

    // Clear
    console.log("🗑️ Clearing existing data...");
    await db.collection("products").deleteMany({});
    await db.collection("categories").deleteMany({});
    console.log("✅ Existing data cleared");

    // Indexes
    console.log("📊 Creating indexes...");
    await db.collection("products").createIndex({ slug: 1 }, { unique: true });
    await db.collection("products").createIndex({ category: 1 });
    await db.collection("products").createIndex({ featured: 1 });
    await db.collection("products").createIndex({ isFeatured: 1, featuredOrder: 1 });
    await db.collection("categories").createIndex({ slug: 1 }, { unique: true });
    await db.collection("categories").createIndex({ isActive: 1, displayOrder: 1 });
    console.log("✅ Indexes created");

    // Seed categories
    console.log("📁 Seeding categories...");
    await db.collection("categories").insertMany(categories);
    console.log(`✅ ${categories.length} categories seeded`);

    // Generate 500 products
    console.log("🏭 Generating 500 products...");
    const products = [];
    for (let i = 0; i < 500; i++) {
        products.push(generateProduct(i));
    }

    console.log("📦 Seeding products...");
    await db.collection("products").insertMany(products);
    console.log(`✅ ${products.length} products seeded`);

    // Update category counts
    console.log("🔢 Updating category product counts...");
    for (const cat of categories) {
        const count = products.filter(p => p.category === cat.slug).length;
        await db.collection("categories").updateOne(
            { slug: cat.slug },
            { $set: { productCount: count } }
        );
    }
    console.log("✅ Category counts updated");

    // Fix Hero Products
    const featuredCount = await db.collection("products").countDocuments({
      $or: [{ isFeatured: true }, { featured: true }],
    });

    if (featuredCount < 5) {
       console.log("⚠️ Not enough featured products. Forcing some...");
       const toUpdate = await db.collection("products")
         .find({})
         .limit(5)
         .toArray();
       
       const ids = toUpdate.map(p => p._id);
       await db.collection("products").updateMany(
           { _id: { $in: ids } },
           { $set: { isFeatured: true, featured: true } }
       );
    }
    
    // Assign featuredOrder to top featured items
    const featuredItems = await db.collection("products")
        .find({ $or: [{ isFeatured: true }, { featured: true }] })
        .limit(10)
        .toArray();
        
    for(let i=0; i<featuredItems.length; i++) {
        await db.collection("products").updateOne(
            { _id: featuredItems[i]._id },
            { $set: { featuredOrder: i + 1 } }
        );
    }

  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seed();
