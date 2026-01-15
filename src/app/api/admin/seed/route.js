import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const CACHE_CONTROL = "no-store, max-age=0";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Toys",
  "Books",
  "Beauty",
  "Automotive"
];

const ADJECTIVES = ["Premium", "Deluxe", "Essential", "Modern", "Vintage", "Sleek", "Durable", "Compact", "Professional", "Ultimate"];
const NOUNS = {
  Electronics: ["Headphones", "Smartphone", "Laptop", "Camera", "Speaker", "Smart Watch", "Tablet", "Monitor"],
  Clothing: ["T-Shirt", "Jeans", "Jacket", "Hoodie", "Sneakers", "Dress", "Scarf", "Hat"],
  "Home & Garden": ["Lamp", "Chair", "Table", "Planter", "Rug", "Pillow", "Vase", "Tool Set"],
  Sports: ["Yoga Mat", "Dumbbell", "Running Shoes", "Water Bottle", "Tennis Racket", "Football", "Backpack", "Stopwatch"],
  Toys: ["Action Figure", "Puzzle", "Board Game", "Doll", "Building Blocks", "Remote Car", "Plush Bear", "Art Set"],
  Books: ["Cookbook", "Novel", "Biography", "Textbook", "Art Book", "Travel Guide", "History Book", "Science Journal"],
  Beauty: ["Lipstick", "Face Cream", "Perfume", "Hair Dryer", "Brush Set", "Nail Polish", "Shampoo", "Serum"],
  Automotive: ["Car Wax", "Air Freshener", "Phone Mount", "Seat Cover", "Tire Inflator", "Cleaning Kit", "Oil", "Dash Cam"]
};

// Helper to generate a random product
const generateProduct = (category) => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[category][Math.floor(Math.random() * NOUNS[category].length)];
  const name = `${adj} ${noun}`;
  const price = Math.floor(Math.random() * 200) + 10;
  const hasDiscount = Math.random() > 0.7;
  
  return {
    name: name,
    title: name,
    slug: `${name.toLowerCase().replace(/ /g, "-")}-${Math.floor(Math.random() * 10000)}`,
    description: `This ${name} is the perfect addition to your collection. High quality and durable.`,
    price: price,
    salePrice: hasDiscount ? Math.floor(price * 0.8) : null,
    oldPrice: hasDiscount ? price : null,
    discount: hasDiscount ? 20 : null,
    category: category,
    stock: Math.floor(Math.random() * 100),
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
    numReviews: Math.floor(Math.random() * 500),
    featured: Math.random() > 0.8,
    isFeatured: Math.random() > 0.8,
    image: null, // Placeholder or specific logic if available
    imgSrc: null, 
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    // Optional: Clear existing products? 
    // Let's not delete by default, but maybe add a query param ?clean=true
    const url = new URL(request.url);
    const shouldClean = url.searchParams.get("clean") === "true";

    if (shouldClean) {
      await collection.deleteMany({});
      console.log("Cleared existing products.");
    }

    const products = [];
    
    // Generate 5 products per category
    for (const category of CATEGORIES) {
      for (let i = 0; i < 5; i++) {
        products.push(generateProduct(category));
      }
    }

    if (products.length > 0) {
      await collection.insertMany(products);
    }

    return NextResponse.json(
      { 
        message: `Successfully seeded ${products.length} products`,
        products: products.map(p => p.name)
      },
      { headers: { "Cache-Control": CACHE_CONTROL } }
    );
  } catch (err) {
    console.error("Seeding error:", err);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
