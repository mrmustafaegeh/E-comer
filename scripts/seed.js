// seed.mjs
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

// --------------------
// CATEGORIES (as you sent)
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

// --------------------
// PRODUCTS (exactly as you sent)
// --------------------
const legacyProducts = [
  {
    name: "Apple AirPods Pro 2nd gen",
    title: "Apple AirPods Pro 2nd gen",
    slug: "apple-airpods-pro-2nd-gen",
    description:
      "Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C) provide excellent sound, active noise cancellation, and a comfortable fit.",
    price: 499.99,
    salePrice: 399.99,
    oldPrice: 499.99,
    discount: "-20%",
    rating: 4.5,
    category: "electronics",
    image: "/image/apple_earphone_image.png",
    stock: 25,
    numReviews: 150,
    featured: true,
    isFeatured: true,
    featuredOrder: 6,
    gradient: "from-blue-500 to-purple-600",
    emoji: "🎧",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Bose QuietComfort 45",
    title: "Bose QuietComfort 45",
    slug: "bose-quietcomfort-45",
    description:
      "The Bose QuietComfort 45 headphones are engineered for exceptional sound quality and unparalleled noise cancellation.",
    price: 429.99,
    salePrice: 329.99,
    oldPrice: 429.99,
    discount: "-23%",
    rating: 3,
    category: "electronics",
    image: "/image/bose_headphone_image.png",
    stock: 18,
    numReviews: 89,
    featured: false,
    isFeatured: false,
    gradient: "from-gray-500 to-black",
    emoji: "🎧",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Samsung Galaxy S23",
    title: "Samsung Galaxy S23",
    slug: "samsung-galaxy-s23",
    description:
      "The Samsung Galaxy S23 offers an all-encompassing mobile experience with its advanced AMOLED display.",
    price: 899.99,
    salePrice: 799.99,
    oldPrice: 899.99,
    discount: "-11%",
    rating: 3.5,
    category: "electronics",
    image: "/image/samsung_s23phone_image.png",
    stock: 12,
    numReviews: 203,
    featured: true,
    isFeatured: true,
    featuredOrder: 7,
    gradient: "from-blue-500 to-green-600",
    emoji: "📱",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Garmin Venu 2",
    title: "Garmin Venu 2",
    slug: "garmin-venu-2",
    description:
      "The Garmin Venu 2 smartwatch blends advanced fitness tracking with sophisticated design.",
    price: 399.99,
    salePrice: 349.99,
    oldPrice: 399.99,
    discount: "-13%",
    rating: 2,
    category: "electronics",
    image: "/image/venu_watch_image.png",
    stock: 30,
    numReviews: 67,
    featured: false,
    isFeatured: false,
    gradient: "from-green-500 to-blue-600",
    emoji: "⌚",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "PlayStation 5",
    title: "PlayStation 5",
    slug: "playstation-5",
    description:
      "The PlayStation 5 takes gaming to the next level with ultra-HD graphics.",
    price: 599.99,
    salePrice: 499.99,
    oldPrice: 599.99,
    discount: "-17%",
    rating: 4.7,
    category: "electronics",
    image: "/image/playstation_image.png",
    stock: 8,
    numReviews: 421,
    featured: true,
    isFeatured: true,
    featuredOrder: 8,
    gradient: "from-blue-500 to-indigo-600",
    emoji: "🎮",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Canon EOS R5",
    title: "Canon EOS R5",
    slug: "canon-eos-r5",
    description:
      "The Canon EOS R5 is a game-changing mirrorless camera with a 45MP full-frame sensor.",
    price: 4199.99,
    salePrice: 3899.99,
    oldPrice: 4199.99,
    discount: "-7%",
    rating: 3,
    category: "electronics",
    image: "/image/cannon_camera_image.png",
    stock: 5,
    numReviews: 92,
    featured: false,
    isFeatured: false,
    gradient: "from-red-500 to-black",
    emoji: "📷",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "MacBook Pro 16",
    title: "MacBook Pro 16",
    slug: "macbook-pro-16",
    description:
      "The MacBook Pro 16, powered by Apple's M2 Pro chip, offers outstanding performance.",
    price: 2799.99,
    salePrice: 2499.99,
    oldPrice: 2799.99,
    discount: "-11%",
    rating: 4.5,
    category: "electronics",
    image: "/image/macbook_image.png",
    stock: 15,
    numReviews: 234,
    featured: true,
    isFeatured: true,
    featuredOrder: 9,
    gradient: "from-gray-500 to-silver",
    emoji: "💻",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sony WF-1000XM5",
    title: "Sony WF-1000XM5",
    slug: "sony-wf-1000xm5",
    description:
      "Sony WF-1000XM5 true wireless earbuds deliver immersive sound with Hi-Res Audio.",
    price: 349.99,
    salePrice: 299.99,
    oldPrice: 349.99,
    discount: "-14%",
    rating: 3.9,
    category: "electronics",
    image: "/image/sony_airbuds_image.png",
    stock: 40,
    numReviews: 178,
    featured: false,
    isFeatured: false,
    gradient: "from-black-500 to-white",
    emoji: "🎧",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Samsung Projector 4k",
    title: "Samsung Projector 4k",
    slug: "samsung-projector-4k",
    description:
      "The Samsung 4K Projector offers an immersive cinematic experience.",
    price: 1699.99,
    salePrice: 1499.99,
    oldPrice: 1699.99,
    discount: "-12%",
    rating: 3,
    category: "electronics",
    image: "/image/projector_image.png",
    stock: 7,
    numReviews: 45,
    featured: false,
    isFeatured: false,
    gradient: "from-blue-500 to-gray-600",
    emoji: "📽️",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "ASUS ROG Zephyrus G16",
    title: "ASUS ROG Zephyrus G16",
    slug: "asus-rog-zephyrus-g16",
    description:
      "The ASUS ROG Zephyrus G16 gaming laptop is powered by the Intel Core i9 processor.",
    price: 2199.99,
    salePrice: 1999.99,
    oldPrice: 2199.99,
    discount: "-9%",
    rating: 3,
    category: "electronics",
    image: "/image/asus_laptop_image.png",
    stock: 10,
    numReviews: 112,
    featured: false,
    isFeatured: false,
    gradient: "from-red-500 to-black-600",
    emoji: "💻",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Google Pixel 7",
    title: "Google Pixel 7",
    slug: "google-pixel-7",
    description: "Advanced Camera, Tensor Chip",
    rating: 4.3,
    price: 599.99,
    salePrice: 599.99,
    oldPrice: 699.99,
    discount: "-14%",
    category: "electronics",
    image: "/image/Google Pixel 7.jpg",
    stock: 22,
    numReviews: 189,
    featured: false,
    isFeatured: false,
    gradient: "from-green-500 to-blue-600",
    emoji: "📱",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "DJI Mini 3 Pro",
    title: "DJI Mini 3 Pro",
    slug: "dji-mini-3-pro",
    description: "Compact Drone, 4K Video",
    rating: 3,
    price: 759.99,
    salePrice: 759.99,
    oldPrice: 899.99,
    discount: "-16%",
    category: "electronics",
    image: "/image/DJI Mini 3 Pro.jpg",
    stock: 14,
    numReviews: 78,
    featured: false,
    isFeatured: false,
    gradient: "from-gray-500 to-white",
    emoji: "🚁",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Fitbit Charge 5",
    title: "Fitbit Charge 5",
    slug: "fitbit-charge-5",
    description: "Health Metrics, Built-in GPS",
    rating: 2,
    price: 179.99,
    salePrice: 179.99,
    oldPrice: 199.99,
    discount: "-10%",
    category: "electronics",
    image: "/image/Fitbit Charge.jpeg",
    stock: 35,
    numReviews: 256,
    featured: false,
    isFeatured: false,
    gradient: "from-purple-500 to-pink-600",
    emoji: "⌚",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Apple Watch Series 8",
    title: "Apple Watch Series 8",
    slug: "apple-watch-series-8",
    description: "Advanced Health Tracking",
    rating: 4.6,
    price: 399.99,
    salePrice: 399.99,
    oldPrice: 449.99,
    discount: "-11%",
    category: "electronics",
    image: "/image/apple_watch8_image.jpg",
    stock: 28,
    numReviews: 312,
    featured: true,
    isFeatured: true,
    featuredOrder: 10,
    gradient: "from-gray-500 to-silver",
    emoji: "⌚",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Nintendo Switch OLED",
    title: "Nintendo Switch OLED",
    slug: "nintendo-switch-oled",
    description: "7-inch OLED Screen, Portable Gaming",
    rating: 3,
    price: 349.99,
    salePrice: 349.99,
    oldPrice: 399.99,
    discount: "-13%",
    category: "electronics",
    image: "/image/Nintendo Switch.png",
    stock: 19,
    numReviews: 167,
    featured: false,
    isFeatured: false,
    gradient: "from-red-500 to-white-600",
    emoji: "🎮",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "JBL Flip 6",
    title: "JBL Flip 6",
    slug: "jbl-flip-6",
    description: "Portable Bluetooth Speaker",
    rating: 3.2,
    price: 129.99,
    salePrice: 129.99,
    oldPrice: 149.99,
    discount: "-13%",
    category: "electronics",
    image: "/image/JBL Flip 6.png",
    stock: 45,
    numReviews: 134,
    featured: false,
    isFeatured: false,
    gradient: "from-blue-500 to-black",
    emoji: "🔊",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Logitech MX Master 3",
    title: "Logitech MX Master 3",
    slug: "logitech-mx-master-3",
    description: "Advanced Wireless Mouse",
    rating: 2.4,
    price: 99.99,
    salePrice: 99.99,
    oldPrice: 129.99,
    discount: "-23%",
    category: "electronics",
    image: "/image/Logitech MX.jpg",
    stock: 50,
    numReviews: 98,
    featured: false,
    isFeatured: false,
    gradient: "from-gray-500 to-black",
    emoji: "🖱️",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Kindle Paperwhite",
    title: "Kindle Paperwhite",
    slug: "kindle-paperwhite",
    description: "Waterproof, High-resolution Display",
    rating: 3.2,
    price: 139.99,
    salePrice: 139.99,
    oldPrice: 159.99,
    discount: "-13%",
    category: "books",
    image: "/image/Kindle Paperwh.jpg",
    stock: 32,
    numReviews: 421,
    featured: false,
    isFeatured: false,
    gradient: "from-black-500 to-white",
    emoji: "📖",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Razer BlackWidow V4",
    title: "Razer BlackWidow V4",
    slug: "razer-blackwidow-v4",
    description: "Mechanical Gaming Keyboard",
    rating: 1.4,
    price: 169.99,
    salePrice: 169.99,
    oldPrice: 199.99,
    discount: "-15%",
    category: "electronics",
    image: "/image/Razer BlackWi.jpg",
    stock: 27,
    numReviews: 67,
    featured: false,
    isFeatured: false,
    gradient: "from-green-500 to-black",
    emoji: "⌨️",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Samsung Galaxy Tab S8",
    title: "Samsung Galaxy Tab S8",
    slug: "samsung-galaxy-tab-s8",
    description: "11-inch Display, S Pen Included",
    rating: 3,
    price: 699.99,
    salePrice: 699.99,
    oldPrice: 799.99,
    discount: "-13%",
    category: "electronics",
    image: "/image/Samsung Galaxy Tab S8.jpg",
    stock: 16,
    numReviews: 145,
    featured: false,
    isFeatured: false,
    gradient: "from-blue-500 to-silver",
    emoji: "📱",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const newProducts = [
  {
    name: "Wireless Headphones Pro",
    title: "Wireless Headphones Pro",
    slug: "wireless-headphones-pro",
    description:
      "Premium wireless headphones with active noise cancellation and 30-hour battery life",
    price: 199.99,
    salePrice: 199.99,
    oldPrice: 299.99,
    discount: "-33%",
    rating: 4.9,
    numReviews: 245,
    emoji: "🎧",
    category: "electronics",
    image:
      "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/wirrless-MnXsxlsfgdhpRlrcjPY7ug2xAxts74.jpg",
    stock: 50,
    featured: true,
    isFeatured: true,
    featuredOrder: 1,
    gradient: "from-blue-500 to-purple-600",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Smart Watch Ultra",
    title: "Smart Watch Ultra",
    slug: "smart-watch-ultra",
    description:
      "Advanced smartwatch with health tracking, GPS, and water resistance",
    price: 349.99,
    salePrice: 349.99,
    oldPrice: 499.99,
    discount: "-30%",
    rating: 4.8,
    numReviews: 189,
    emoji: "⌚",
    category: "electronics",
    image:
      "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/smart%20watch%20-KJr0JSFqheZxqyWmMu8P66S3aV4gqe.webp",
    stock: 35,
    featured: true,
    isFeatured: true,
    featuredOrder: 2,
    gradient: "from-purple-500 to-pink-600",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Premium Camera 4K",
    title: "Premium Camera 4K",
    slug: "premium-camera-4k",
    description:
      "Professional 4K camera with advanced stabilization for content creators",
    price: 899.99,
    salePrice: 899.99,
    oldPrice: 1299.99,
    discount: "-31%",
    rating: 5.0,
    numReviews: 156,
    emoji: "📷",
    category: "electronics",
    image:
      "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/soney%20camera-43aoGLKQjpCa0RpLxrmhyqBaAhVg8F.jpg",
    stock: 20,
    featured: true,
    isFeatured: true,
    featuredOrder: 3,
    gradient: "from-pink-500 to-orange-600",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Designer Sunglasses",
    title: "Designer Sunglasses",
    slug: "designer-sunglasses",
    description: "Stylish UV protection sunglasses with polarized lenses",
    price: 149.99,
    salePrice: 149.99,
    oldPrice: 249.99,
    discount: "-40%",
    rating: 4.7,
    numReviews: 312,
    emoji: "🕶️",
    category: "fashion",
    image:
      "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/glasses-ZS7FEhvU3PZGDowpGBmtIqAPjFwK5m.webp",
    stock: 100,
    featured: true,
    isFeatured: true,
    featuredOrder: 4,
    gradient: "from-blue-500 to-purple-600",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Luxury Backpack",
    title: "Luxury Backpack",
    slug: "luxury-backpack",
    description:
      "Premium leather backpack with laptop compartment for professionals",
    price: 89.99,
    salePrice: 89.99,
    oldPrice: 149.99,
    discount: "-40%",
    rating: 4.6,
    numReviews: 278,
    emoji: "🎒",
    category: "fashion",
    image:
      "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/BackPack-w9r5BAHqeIbIpQUWrjkABZbZ978wsY.jpeg",
    stock: 75,
    featured: true,
    isFeatured: true,
    featuredOrder: 5,
    gradient: "from-purple-500 to-pink-600",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Running Shoes Pro",
    title: "Running Shoes Pro",
    slug: "running-shoes-pro",
    description:
      "Professional running shoes with advanced cushioning technology",
    price: 129.99,
    salePrice: 99.99,
    oldPrice: 179.99,
    discount: "-45%",
    rating: 4.8,
    numReviews: 421,
    emoji: "👟",
    category: "sports",
    image:
      "https://lv4ihdf4sxac4yjo.public.blob.vercel-storage.com/Adizero_EVO_SL_Shoes_Black_JP7149_HM1-L1QVQ2IQRuvbjKjebuRNEDaYgeGv5B.jpg",
    stock: 120,
    featured: false,
    isFeatured: false,
    gradient: "from-green-500 to-blue-600",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// --------------------
// Seed logic + HERO INIT FIX
// --------------------
function countByCategory(products, slug) {
  return products.filter((p) => p.category === slug).length;
}

async function seed() {
  console.log("🌱 Starting MongoDB seeding...");

  if (!uri) {
    console.error("❌ MONGODB_URI not found in .env.local");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(process.env.MONGODB_DBame);
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
    await db
      .collection("products")
      .createIndex({ isFeatured: 1, featuredOrder: 1 });
    await db
      .collection("categories")
      .createIndex({ slug: 1 }, { unique: true });
    await db
      .collection("categories")
      .createIndex({ isActive: 1, displayOrder: 1 });
    console.log("✅ Indexes created");

    // Seed categories
    console.log("📁 Seeding categories...");
    await db.collection("categories").insertMany(categories);
    console.log(`✅ ${categories.length} categories seeded`);

    // Combine and seed products
    const allProducts = [...newProducts, ...legacyProducts];

    console.log("📦 Seeding products...");
    await db.collection("products").insertMany(allProducts);
    console.log(`✅ ${allProducts.length} products seeded`);

    // Update category counts
    console.log("🔢 Updating category product counts...");
    const electronicsCount = countByCategory(allProducts, "electronics");
    const fashionCount = countByCategory(allProducts, "fashion");
    const sportsCount = countByCategory(allProducts, "sports");
    const booksCount = countByCategory(allProducts, "books");
    const homeCount = countByCategory(allProducts, "home");

    await Promise.all([
      db
        .collection("categories")
        .updateOne(
          { slug: "electronics" },
          { $set: { productCount: electronicsCount } }
        ),
      db
        .collection("categories")
        .updateOne(
          { slug: "fashion" },
          { $set: { productCount: fashionCount } }
        ),
      db
        .collection("categories")
        .updateOne({ slug: "sports" }, { $set: { productCount: sportsCount } }),
      db
        .collection("categories")
        .updateOne({ slug: "books" }, { $set: { productCount: booksCount } }),
      db
        .collection("categories")
        .updateOne({ slug: "home" }, { $set: { productCount: homeCount } }),
    ]);

    console.log("✅ Category counts updated");

    // --------------------
    // ✅ HERO INIT FIX
    // Ensure hero query ALWAYS finds products:
    // Hero API uses: { $or: [{ isFeatured: true }, { featured: true }] }
    // If (for any reason) none exist, force first 5 to be featured.
    // --------------------
    const featuredCount = await db.collection("products").countDocuments({
      $or: [{ isFeatured: true }, { featured: true }],
    });

    if (featuredCount === 0) {
      console.log(
        "⚠️ No featured products found. Forcing first 5 products to featured for hero..."
      );
      const firstFive = await db
        .collection("products")
        .find({})
        .sort({ createdAt: -1, _id: -1 })
        .limit(5)
        .project({ _id: 1 })
        .toArray();

      const ids = firstFive.map((p) => p._id);

      // set featured flags + featuredOrder
      await db
        .collection("products")
        .updateMany(
          { _id: { $in: ids } },
          { $set: { isFeatured: true, featured: true } }
        );

      // give them a stable featuredOrder 1..5
      for (let i = 0; i < ids.length; i++) {
        await db
          .collection("products")
          .updateOne({ _id: ids[i] }, { $set: { featuredOrder: i + 1 } });
      }
    }

    const featuredCountAfter = await db.collection("products").countDocuments({
      $or: [{ isFeatured: true }, { featured: true }],
    });

    const sampleFeatured = await db
      .collection("products")
      .find({ $or: [{ isFeatured: true }, { featured: true }] })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .project({
        title: 1,
        name: 1,
        isFeatured: 1,
        featured: 1,
        featuredOrder: 1,
      })
      .limit(5)
      .toArray();

    // Summary
    console.log("\n📊 Seeding Summary:");
    console.log("─────────────────────");
    console.log(`📁 Categories: ${categories.length}`);
    console.log(`📦 Products: ${allProducts.length}`);
    console.log(`   ├─ Electronics: ${electronicsCount}`);
    console.log(`   ├─ Fashion: ${fashionCount}`);
    console.log(`   ├─ Sports: ${sportsCount}`);
    console.log(`   ├─ Books: ${booksCount}`);
    console.log(`   └─ Home: ${homeCount}`);
    console.log(`⭐ Featured products (hero): ${featuredCountAfter}`);
    console.log("Sample featured:", sampleFeatured);
    console.log("─────────────────────");
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("👋 Connection closed");
  }
}

seed();
