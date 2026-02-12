import clientPromise from './mongodb';

/**
 * IMPROVED CHATBOT WITH SMART FALLBACKS
 * Works intelligently with or without AI API
 */

export async function processMessage(message, history = [], userContext = {}) {
  try {
    // Get product context first (this always works)
    const productContext = await getProductContext(message);
    
    // Try AI first if API key exists and has credits
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
      try {
        const conversationHistory = buildConversationHistory(history);
        const aiResponse = await callClaudeAPI(message, conversationHistory, productContext, userContext);
        return aiResponse;
      } catch (apiError) {
        console.log('AI unavailable, using smart fallback:', apiError.message);
        // Fall through to smart fallback
      }
    }
    
    // Smart fallback - actually helpful responses based on message analysis
    return getSmartFallbackResponse(message, productContext);
    
  } catch (error) {
    console.error('Chatbot processing error:', error);
    return getEmergencyResponse();
  }
}

/**
 * SMART FALLBACK - Analyzes message and gives relevant responses
 */
function getSmartFallbackResponse(message, productContext) {
  const lowerMessage = message.toLowerCase();
  
  // Product search queries
  if (lowerMessage.match(/\b(find|search|looking for|show me|need|want)\b/)) {
    return handleProductSearchFallback(message, productContext);
  }
  
  // Greetings
  if (lowerMessage.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)) {
    return {
      response: "Hey there! 👋 Welcome to our store! I can help you:\n\n✨ Find specific products\n🔥 Discover deals and sales\n📦 Browse by category\n🎁 Get recommendations\n\nWhat are you shopping for today?",
      products: productContext.products.slice(0, 3).map(formatProduct),
      action: null
    };
  }
  
  // Deals/Sales queries
  if (lowerMessage.match(/\b(deal|sale|discount|cheap|bargain|offer)\b/)) {
    return handleDealsFallback(productContext);
  }
  
  // Cart queries
  if (lowerMessage.match(/\b(cart|checkout|buy|purchase)\b/)) {
    return {
      response: "Ready to checkout? 🛒\n\nClick the cart icon in the top right to view your items. You can:\n• Update quantities\n• Apply promo codes\n• See shipping options\n• Complete your purchase securely\n\nNeed help finding something to add?",
      products: [],
      action: 'cart'
    };
  }
  
  // Order tracking
  if (lowerMessage.match(/\b(order|track|shipping|delivery)\b/)) {
    return {
      response: "To track your order:\n\n📦 Go to 'My Account' → 'Orders'\n🔍 Enter your order number\n📧 Check your email for tracking link\n\nNeed help with a specific order? Let me know your order number!",
      products: [],
      action: 'orders'
    };
  }
  
  // Categories/Browse
  if (lowerMessage.match(/\b(category|categories|browse|section)\b/)) {
    return handleCategoriesFallback(productContext);
  }
  
  // Help/Support
  if (lowerMessage.match(/\b(help|support|contact|question|problem)\b/)) {
    return {
      response: "I'm here to help! 💪\n\nI can assist with:\n• Finding products\n• Checking prices and deals\n• Order information\n• Store policies\n• Product recommendations\n\nWhat do you need help with?",
      products: productContext.products.slice(0, 2).map(formatProduct),
      action: null
    };
  }
  
  // Price queries
  if (lowerMessage.match(/\b(price|cost|how much|expensive|budget|under|below)\b/)) {
    return handlePriceFallback(message, productContext);
  }
  
  // Specific product types (electronics, clothing, etc.)
  const productTypes = extractProductTypes(lowerMessage);
  if (productTypes.length > 0) {
    return handleProductTypeFallback(productTypes, productContext);
  }
  
  // Default - show popular products
  return {
    response: "I'd love to help you find something! Here are some of our popular items:\n\nLooking for something specific? Try:\n• 'Show me headphones under $200'\n• 'I need a gift for my mom'\n• 'What deals do you have?'",
    products: productContext.products.slice(0, 3).map(formatProduct),
    action: null
  };
}

/**
 * Handle product search fallback
 */
function handleProductSearchFallback(message, productContext) {
  const searchTerms = extractSearchTerms(message);
  
  if (productContext.products.length > 0) {
    const responseIntro = searchTerms.length > 0 
      ? `Great! I found ${productContext.products.length} products for "${searchTerms.join(' ')}":`
      : `Here are some popular products you might like:`;
    
    return {
      response: `${responseIntro}\n\n${productContext.products.slice(0, 3).map((p, i) => 
        `${i + 1}. **${p.name}** - ${p.formattedPrice}${p.isOnSale ? ' 🔥 ON SALE!' : ''}`
      ).join('\n')}\n\nWant to see more details or compare options?`,
      products: productContext.products.slice(0, 3).map(formatProduct),
      action: null
    };
  }
  
  return {
    response: `Hmm, I didn't find exact matches. But check out these popular items instead!\n\nTry being more specific like:\n• "wireless headphones"\n• "blue sneakers size 10"\n• "laptop under $1000"`,
    products: productContext.products.slice(0, 3).map(formatProduct),
    action: null
  };
}

/**
 * Handle deals fallback
 */
function handleDealsFallback(productContext) {
  const onSaleProducts = productContext.products.filter(p => p.isOnSale);
  
  if (onSaleProducts.length > 0) {
    return {
      response: `🔥 Hot Deals Right Now!\n\n${onSaleProducts.slice(0, 3).map((p, i) => 
        `${i + 1}. **${p.name}**\n   Was: ${p.formattedPrice} → Now: ${p.formattedSalePrice || p.formattedPrice}`
      ).join('\n\n')}\n\nGrab them before they're gone! 🏃♂️`,
      products: onSaleProducts.slice(0, 3).map(formatProduct),
      action: null
    };
  }
  
  return {
    response: "No active sales right now, but we add new deals daily! 📅\n\nIn the meantime, check out these popular items at great prices:",
    products: productContext.products.slice(0, 3).map(formatProduct),
    action: null
  };
}

/**
 * Handle categories fallback
 */
function handleCategoriesFallback(productContext) {
  if (productContext.categories && productContext.categories.length > 0) {
    const categoryList = productContext.categories
      .slice(0, 6)
      .map(c => `• ${c.name} (${c.productCount || 0} items)`)
      .join('\n');
    
    return {
      response: `Browse our categories:\n\n${categoryList}\n\nWhich category interests you?`,
      products: [],
      action: 'browse'
    };
  }
  
  return {
    response: "Browse our store using the navigation menu at the top! You can filter by category, price, or search for specific items. What are you looking for?",
    products: productContext.products.slice(0, 3).map(formatProduct),
    action: null
  };
}

/**
 * Handle price queries fallback
 */
function handlePriceFallback(message, productContext) {
  // Extract price range if mentioned
  const priceMatch = message.match(/\$?(\d+)/);
  const budget = priceMatch ? parseInt(priceMatch[1]) : null;
  
  let filteredProducts = productContext.products;
  
  if (budget) {
    filteredProducts = productContext.products.filter(p => {
      const price = p.salePrice || p.price;
      return price <= budget * 1.2; // Allow 20% over budget
    });
  }
  
  if (filteredProducts.length > 0) {
    const intro = budget 
      ? `Here are options around $${budget}:`
      : `Here are some products at different price points:`;
    
    return {
      response: `${intro}\n\n${filteredProducts.slice(0, 3).map((p, i) => 
        `${i + 1}. ${p.name} - ${p.isOnSale ? p.formattedSalePrice : p.formattedPrice}`
      ).join('\n')}\n\nWant to see more in your price range?`,
      products: filteredProducts.slice(0, 3).map(formatProduct),
      action: null
    };
  }
  
  return {
    response: "Tell me your budget and what you're looking for, and I'll find the best options! For example: 'headphones under $100'",
    products: productContext.products.slice(0, 3).map(formatProduct),
    action: null
  };
}

/**
 * Handle product type queries
 */
function handleProductTypeFallback(productTypes, productContext) {
  const matchedProducts = productContext.products.filter(p => {
    const productText = `${p.name} ${p.category} ${p.description || ''}`.toLowerCase();
    return productTypes.some(type => productText.includes(type));
  });
  
  if (matchedProducts.length > 0) {
    return {
      response: `Found ${matchedProducts.length} ${productTypes.join(', ')} for you!\n\nTop picks:\n${matchedProducts.slice(0, 3).map((p, i) => 
        `${i + 1}. ${p.name} - ${p.formattedPrice}`
      ).join('\n')}\n\nNeed help choosing?`,
      products: matchedProducts.slice(0, 3).map(formatProduct),
      action: null
    };
  }
  
  return {
    response: `Looking for ${productTypes.join(', ')}? Let me show you what we have:\n\nCheck out these popular items:`,
    products: productContext.products.slice(0, 3).map(formatProduct),
    action: null
  };
}

/**
 * Extract product types from message
 */
function extractProductTypes(message) {
  const commonTypes = [
    'headphone', 'earphone', 'earbud',
    'laptop', 'computer', 'tablet',
    'phone', 'smartphone', 'iphone', 'android',
    'shoe', 'sneaker', 'boot',
    'shirt', 't-shirt', 'jacket', 'pants',
    'watch', 'smartwatch',
    'camera', 'lens',
    'speaker', 'bluetooth',
    'charger', 'cable',
    'bag', 'backpack',
    'glasses', 'sunglasses'
  ];
  
  return commonTypes.filter(type => message.includes(type));
}

/**
 * Emergency response when everything fails
 */
function getEmergencyResponse() {
  return {
    response: "I'm having trouble right now, but I'm still here to help! 😊\n\nTry:\n• Browsing our categories above\n• Using the search bar\n• Refreshing the page\n\nWhat are you looking for?",
    products: [],
    action: null
  };
}

/**
 * Format product for response
 */
function formatProduct(product) {
  return {
    name: product.name,
    slug: product.slug,
    formattedPrice: product.isOnSale ? product.formattedSalePrice : product.formattedPrice,
    image: product.image,
    category: product.category
  };
}

// ============= AI FUNCTIONS =============

async function callClaudeAPI(message, history, productContext, userContext) {
  const systemPrompt = buildSystemPrompt(productContext, userContext);
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...history,
        { role: "user", content: message }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const aiMessage = data.content[0].text;
  
  return parseAIResponse(aiMessage, productContext);
}

function buildSystemPrompt(productContext, userContext) {
  return `You are an expert e-commerce shopping assistant. Be friendly, helpful, and conversational.

PRODUCT CONTEXT:
${formatProductContext(productContext)}

USER CONTEXT:
${formatUserContext(userContext)}

GUIDELINES:
- Recommend 2-3 specific products when relevant
- Be enthusiastic but not pushy
- Keep responses concise (2-4 sentences)
- Use emojis sparingly (🛍️, ✨, 🎁, 💫)
- Help users make decisions

OUTPUT FORMAT:
When recommending products, list them like:
PRODUCT: Exact Product Name 1
PRODUCT: Exact Product Name 2

Remember: Make shopping easy and fun!`;
}

function formatProductContext(productContext) {
  if (!productContext || productContext.products.length === 0) {
    return "No specific products in context.";
  }
  
  let context = `Available Products (${productContext.products.length}):\n`;
  productContext.products.slice(0, 10).forEach((product, index) => {
    context += `${index + 1}. ${product.name} - ${product.category} - ${product.formattedPrice}`;
    if (product.isOnSale) context += ` (SALE!)`;
    context += '\n';
  });
  
  return context;
}

function formatUserContext(userContext) {
  if (!userContext || Object.keys(userContext).length === 0) {
    return 'New customer.';
  }
  
  let context = '';
  if (userContext.cartItems > 0) {
    context += `${userContext.cartItems} items in cart. `;
  }
  return context || 'New customer.';
}

async function getProductContext(message) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'ecommerce');
    
    const searchTerms = extractSearchTerms(message);
    let products = [];
    
    if (searchTerms.length > 0) {
      products = await db.collection('products')
        .find({
          $or: [
            { name: { $regex: searchTerms.join('|'), $options: 'i' } },
            { description: { $regex: searchTerms.join('|'), $options: 'i' } },
            { category: { $regex: searchTerms.join('|'), $options: 'i' } }
          ]
        })
        .limit(10)
        .toArray();
    }
    
    if (products.length === 0) {
      products = await db.collection('products')
        .find({ isFeatured: true })
        .limit(6)
        .toArray();
    }
    
    const categories = await db.collection('categories')
      .find({ isActive: true })
      .toArray();
    
    return { products, categories };
    
  } catch (error) {
    console.error('Error getting product context:', error);
    return { products: [], categories: [] };
  }
}

function extractSearchTerms(message) {
  const stopWords = new Set([
    'find', 'search', 'looking', 'for', 'show', 'me', 'the', 'a', 'an', 
    'i', 'want', 'need', 'can', 'you', 'help', 'with', 'some', 'any',
    'what', 'where', 'how', 'when', 'is', 'are'
  ]);
  
  return message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

function buildConversationHistory(history) {
  return history
    .slice(-6)
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }));
}

function parseAIResponse(aiMessage, productContext) {
  const lines = aiMessage.split('\n');
  const productNames = [];
  const responseLines = [];
  
  lines.forEach(line => {
    if (line.trim().startsWith('PRODUCT:')) {
      productNames.push(line.replace('PRODUCT:', '').trim());
    } else {
      responseLines.push(line);
    }
  });
  
  const products = productNames
    .map(name => {
      return productContext.products.find(p => 
        p.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(p.name.toLowerCase())
      );
    })
    .filter(Boolean)
    .slice(0, 3)
    .map(formatProduct);
  
  return {
    response: responseLines.join('\n').trim(),
    products: products,
    action: null
  };
}

export async function getUserContext(userId) {
  if (!userId) return {};
  
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'ecommerce');
    
    const cart = await db.collection('carts').findOne({ userId });
    
    return {
      cartItems: cart?.items?.length || 0
    };
  } catch (error) {
    console.error('Error getting user context:', error);
    return {};
  }
}
