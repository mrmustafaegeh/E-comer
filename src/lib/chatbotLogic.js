import clientPromise from '@/lib/mongodb';

// ============================================
// COMPREHENSIVE CUSTOMER SUPPORT SYSTEM
// ============================================

// System prompt for Claude AI
function buildSystemPrompt(productContext, userContext) {
  return `You are an expert customer support assistant for QuickCart, a premium electronics e-commerce store. 

AVAILABLE PRODUCTS:
${productContext.products.map(p => `- ${p.name}: ${p.formattedPrice}${p.isOnSale ? ' (ON SALE!)' : ''} [Category: ${p.category}]`).join('\n')}

${productContext.categories && productContext.categories.length > 0 ? `CATEGORIES: ${productContext.categories.map(c => c.name).join(', ')}` : ''}

USER CONTEXT:
- Cart: ${userContext.cartItemCount || 0} items
- Logged in: ${userContext.isLoggedIn ? 'Yes' : 'No'}

YOUR CAPABILITIES:
1. Product Search & Recommendations
2. Order Tracking & Status
3. Returns & Refunds
4. Shipping Information
5. Payment Help
6. Account Assistance
7. Product Comparison
8. Size & Compatibility Guide
9. Technical Support
10. General FAQ

Be friendly, professional, and solution-oriented. Provide specific product names and prices. If you can't help directly, guide users to the right resource.`;
}

// Call Claude API with enhanced error handling
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
      max_tokens: 1500,
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
  return {
    response: data.content[0].text,
    products: productContext.products.slice(0, 4).map(formatProduct),
    action: null,
    suggestedActions: []
  };
}

// Build conversation history
function buildConversationHistory(history) {
  return history.slice(-8).map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

// ============================================
// INTENT DETECTION SYSTEM
// ============================================

function detectIntent(message) {
  const lower = message.toLowerCase();
  
  const intents = {
    // Product-related
    PRODUCT_SEARCH: /\b(find|search|looking for|show me|need|want|buy|get)\b/,
    PRODUCT_COMPARE: /\b(compare|difference|vs|versus|better|which)\b/,
    SIZE_GUIDE: /\b(size|fit|dimension|measurement|compatibility)\b/,
    
    // Shopping
    DEALS: /\b(deal|sale|discount|offer|promo|cheap|coupon|save)\b/,
    CART: /\b(cart|basket|checkout|purchase)\b/,
    CATEGORIES: /\b(category|categories|browse|section|type)\b/,
    PRICE: /\b(price|cost|how much|\$\d+|under|budget|afford)\b/,
    
    // Orders & Shipping
    ORDER_TRACK: /\b(track|order|where is|status|shipped|delivery date)\b/,
    SHIPPING_INFO: /\b(shipping|delivery|ship|arrive|how long|when)\b/,
    RETURNS: /\b(return|refund|exchange|cancel|wrong|defective)\b/,
    
    // Account
    ACCOUNT_HELP: /\b(account|profile|password|sign in|log in|register)\b/,
    PAYMENT_HELP: /\b(payment|pay|credit card|paypal|billing)\b/,
    
    // Support
    HELP: /\b(help|support|question|how|assist|problem|issue)\b/,
    CONTACT: /\b(contact|call|email|chat|talk|speak|representative)\b/,
    FAQ: /\b(faq|frequently|common question)\b/,
    
    // Greetings/Conversation
    GREETING: /\b(hi|hello|hey|good morning|good afternoon|good evening)\b/,
    THANKS: /\b(thank|thanks|appreciate|grateful)\b/,
  };
  
  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(lower)) {
      return intent;
    }
  }
  
  return 'GENERAL';
}

// ============================================
// DATABASE & PRODUCT FUNCTIONS
// ============================================

async function getProductContext(message) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const searchTerms = extractSearchTerms(message);
    
    let query = {};
    if (searchTerms.length > 0) {
      query = {
        $or: [
          { name: { $regex: searchTerms.join('|'), $options: 'i' } },
          { description: { $regex: searchTerms.join('|'), $options: 'i' } },
          { category: { $regex: searchTerms.join('|'), $options: 'i' } },
          { tags: { $in: searchTerms } }
        ]
      };
    }
    
    const products = await db.collection('products')
      .find(query)
      .limit(12)
      .toArray();
    
    const categories = await db.collection('categories')
      .find({})
      .toArray();
    
    const formattedProducts = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      isOnSale: p.salePrice && p.salePrice < p.price,
      formattedPrice: `$${p.price.toFixed(2)}`,
      formattedSalePrice: p.salePrice ? `$${p.salePrice.toFixed(2)}` : null,
      category: p.category,
      image: p.image,
      description: p.description,
      stock: p.stock || 0,
      rating: p.rating || 0
    }));
    
    return {
      products: formattedProducts,
      categories: categories.map(c => ({
        name: c.name,
        productCount: c.productCount || 0,
        slug: c.slug
      }))
    };
    
  } catch (error) {
    console.error('Error fetching product context:', error);
    return { products: [], categories: [] };
  }
}

function extractSearchTerms(message) {
  const stopWords = ['show', 'me', 'find', 'looking', 'for', 'need', 'want', 'buy', 'get', 'a', 'an', 'the', 'some', 'any', 'please', 'can', 'you', 'help'];
  const words = message.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  return words;
}

function formatProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.isOnSale ? product.formattedSalePrice : product.formattedPrice,
    originalPrice: product.isOnSale ? product.formattedPrice : null,
    image: product.image,
    category: product.category,
    badge: product.isOnSale ? 'SALE' : (product.stock < 10 && product.stock > 0 ? 'LOW STOCK' : null),
    inStock: product.stock > 0,
    formattedPrice: product.isOnSale ? product.formattedSalePrice : product.formattedPrice
  };
}

// ============================================
// SMART FALLBACK HANDLERS
// ============================================

function getSmartFallbackResponse(message, productContext, userContext) {
  const intent = detectIntent(message);
  
  const handlers = {
    PRODUCT_SEARCH: () => handleProductSearch(message, productContext),
    PRODUCT_COMPARE: () => handleProductCompare(message, productContext),
    SIZE_GUIDE: () => handleSizeGuide(message),
    DEALS: () => handleDeals(productContext),
    CART: () => handleCart(userContext),
    CATEGORIES: () => handleCategories(productContext),
    PRICE: () => handlePrice(message, productContext),
    ORDER_TRACK: () => handleOrderTracking(),
    SHIPPING_INFO: () => handleShipping(),
    RETURNS: () => handleReturns(),
    ACCOUNT_HELP: () => handleAccountHelp(),
    PAYMENT_HELP: () => handlePaymentHelp(),
    CONTACT: () => handleContact(),
    FAQ: () => handleFAQ(),
    GREETING: () => handleGreeting(productContext),
    THANKS: () => handleThanks(),
    HELP: () => handleHelp(productContext)
  };
  
  const handler = handlers[intent] || (() => handleGeneral(productContext));
  return handler();
}

// ============================================
// INTENT HANDLERS (showing a few examples)
// ============================================

function handleProductSearch(message, productContext) {
  const searchTerms = extractSearchTerms(message);
  
  if (productContext.products.length > 0) {
    const intro = searchTerms.length > 0 
      ? `Perfect! I found **${productContext.products.length} products** matching "${searchTerms.join(' ')}":`
      : `Here are our top picks for you:`;
    
    return {
      response: `${intro}\n\n${productContext.products.slice(0, 4).map((p, i) => 
        `${i + 1}. **${p.name}**\n   ${p.isOnSale ? `~~${p.formattedPrice}~~ **${p.formattedSalePrice}** 🔥` : p.formattedPrice}\n   ${p.stock < 10 ? '⚠️ Only ' + p.stock + ' left!' : '✅ In stock'}`
      ).join('\n\n')}\n\n💡 Need help deciding? Ask me to compare products or get more details!`,
      products: productContext.products.slice(0, 4).map(formatProduct),
      action: null,
      suggestedActions: ['Compare products', 'Show more details', 'Check availability']
    };
  }
  
  return {
    response: `Hmm, no exact matches found. But here are some bestsellers you might love!\n\n💡 **Pro tip:** Try searching by:\n• Product type: "wireless headphones"\n• Brand + type: "Apple AirPods"\n• Price range: "laptops under $1000"`,
    products: productContext.products.slice(0, 4).map(formatProduct),
    action: null
};
}

function handleDeals(productContext) {
  const onSaleProducts = productContext.products.filter(p => p.isOnSale);
  
  if (onSaleProducts.length > 0) {
    const totalSavings = onSaleProducts.reduce((acc, p) => 
      acc + (p.price - (p.salePrice || p.price)), 0
    );
    
    return {
      response: `🔥 **${onSaleProducts.length} HOT DEALS** just for you!\n\n${onSaleProducts.slice(0, 4).map((p, i) => 
        `${i + 1}. **${p.name}**\n   ~~${p.formattedPrice}~~ → **${p.formattedSalePrice}**\n   💰 Save $${(p.price - p.salePrice).toFixed(2)} (${Math.round((p.price - p.salePrice) / p.price * 100)}% OFF)`
      ).join('\n\n')}\n\n⏰ **Limited time!** Total savings: **$${totalSavings.toFixed(2)}**`,
      products: onSaleProducts.slice(0, 4).map(formatProduct),
      action: 'view_deals',
      suggestedActions: ['View all deals', 'Add to cart', 'Set price alert']
    };
  }
  
  return {
    response: "🔔 No active sales right now, but new deals drop daily!\n\n✨ **Check out these value picks:**",
    products: productContext.products.slice(0, 4).map(formatProduct),
    action: null
  };
}

function handleOrderTracking() {
  return {
    response: `📦 **Track Your Order**\n\n**How to track:**\n1. Go to **My Account → Orders**\n2. Find your order number\n3. Click "Track Package"\n4. Get real-time updates\n\n📧 **Order emails** also contain tracking links!\n\n**Shipping times:**\n• Standard: 5-7 business days\n• Express: 2-3 business days\n• Next Day: Guaranteed next day\n\n❓ **Can't find your order?** Contact support with your order number.`,
    products: [],
    action: 'track_order',
    suggestedActions: ['View my orders', 'Contact support', 'Shipping info']
  };
}

function handleShipping() {
  return {
    response: `🚚 **Shipping Information**\n\n**Delivery Options:**\n• **FREE Standard** - Orders over $50 (5-7 days)\n• **Standard** - $5.99 (5-7 days)\n• **Express** - $12.99 (2-3 days)\n• **Next Day** - $24.99 (Guaranteed next day)\n\n📦 **Track your package** in real-time!`,
    products: [],
    action: null,
    suggestedActions: ['Calculate shipping', 'Track order']
  };
}

function handleReturns() {
  return {
    response: `🔄 **Returns & Refunds**\n\n**Easy returns within 30 days!**\n\n**To start a return:**\n1. Go to **My Account → Orders**\n2. Select the item\n3. Click "Request Return"\n4. Choose reason\n5. Print return label\n\n**Refund timeline:**\n• Return processed: 2-3 days\n• Refund issued: 5-7 business days`,
    products: [],
    action: 'start_return',
    suggestedActions: ['Start return', 'Exchange policy', 'Contact support']
  };
}

function handleAccountHelp() {
  return {
    response: `👤 **Account Help**\n\n🔐 **Password Reset:** Click "Forgot Password"\n📧 **Update Info:** Go to My Account → Profile\n🆕 **Create Account:** Quick registration available\n🔒 **Security:** Enable 2FA for protection`,
    products: [],
    action: 'account_help',
    suggestedActions: ['Reset password', 'Update profile', 'Contact support']
  };
}

function handlePaymentHelp() {
  return {
    response: `💳 **Payment Help**\n\n**Accepted payments:**\n✅ Visa, Mastercard, Amex\n✅ PayPal\n✅ Apple Pay\n✅ Google Pay\n\n🚫 **Payment declined?** Check card details or contact your bank`,
    products: [],
    action: null,
    suggestedActions: ['Try payment again', 'Contact support']
  };
}

function handleContact() {
  return {
    response: `📞 **Contact Us**\n\n💬 **Live Chat:** Available now\n📧 **Email:** support@quickcart.com\n📞 **Phone:** 1-800-QUICK-CART\n\n**Hours:** Mon-Fri 9AM-9PM EST`,
    products: [],
    action: 'start_chat',
    suggestedActions: ['Start live chat', 'Email us']
  };
}

function handleFAQ() {
  return {
    response: `❓ **FAQ**\n\n**Shipping:** 5-7 days standard\n**Returns:** 30 days, no questions asked\n**Warranty:** 1-year manufacturer warranty\n**Payment:** All major cards accepted`,
    products: [],
    action: 'view_faq',
    suggestedActions: ['Shipping info', 'Returns policy']
  };
}

function handleGreeting(productContext) {
  return {
    response: `Hey! 👋 Welcome to **QuickCart**!\n\nI can help you with:\n🛍️ Finding products\n💰 Deals & discounts\n📦 Order tracking\n🔄 Returns & refunds\n\n**What brings you here today?**`,
    products: productContext.products.slice(0, 4).map(formatProduct),
    action: null,
    suggestedActions: ['Browse products', 'Check deals', 'Track order']
  };
}

function handleThanks() {
  return {
    response: `You're very welcome! 😊\n\nHappy to help anytime! Need anything else?`,
    products: [],
    action: null
  };
}

function handleHelp(productContext) {
  return {
    response: `🆘 **How Can I Help?**\n\n🛒 Shopping assistance\n📦 Order tracking\n💳 Account & payment help\n💬 Customer support\n\n**What do you need?**`,
    products: productContext.products.slice(0, 4).map(formatProduct),
    action: null,
    suggestedActions: ['Find products', 'Track order', 'Contact support']
  };
}

function handleGeneral(productContext) {
  return {
    response: `I'm here to help! 🎯\n\n**Try asking:**\n• "Show me wireless headphones"\n• "What deals do you have?"\n• "Track my order"\n• "How do I return an item?"`,
    products: productContext.products.slice(0, 4).map(formatProduct),
    action: null
  };
}

function handleProductCompare(message, productContext) {
  if (productContext.products.length >= 2) {
    const products = productContext.products.slice(0, 2);
    return {
      response: `Let's compare:\n\n**${products[0].name}** - ${products[0].formattedPrice}\n**${products[1].name}** - ${products[1].formattedPrice}\n\n💡 Want detailed specs?`,
      products: products.map(formatProduct),
      action: 'compare',
      suggestedActions: ['Show specs', 'More comparisons']
    };
  }
  
  return handleProductSearch(message, productContext);
}

function handleSizeGuide(message) {
  return {
    response: `📏 **Size Guide**\n\nCheck product descriptions for dimensions and compatibility info!\n\n📞 Need help? Contact support!`,
    products: [],
    action: null,
    suggestedActions: ['Contact support', 'View products']
  };
}

function handleCart(userContext) {
  return {
    response: userContext.cartItemCount > 0 
      ? `🛒 You have **${userContext.cartItemCount} item(s)** in your cart!\n\n✅ Ready to checkout?`
      : `🛒 Your cart is empty. Let's find something amazing!`,
    products: [],
    action: userContext.cartItemCount > 0 ? 'view_cart' : null,
    suggestedActions: userContext.cartItemCount > 0 ? ['View cart', 'Checkout'] : ['Browse products', 'View deals']
  };
}

function handleCategories(productContext) {
  if (productContext.categories && productContext.categories.length > 0) {
    return {
      response: `📂 **Categories**\n\n${productContext.categories.slice(0, 6).map(c => `• ${c.name} (${c.productCount || 0} items)`).join('\n')}`,
      products: [],
      action: 'browse_categories',
      suggestedActions: productContext.categories.slice(0, 3).map(c => c.name)
    };
  }
  
  return handleGeneral(productContext);
}

function handlePrice(message, productContext) {
  const priceMatch = message.match(/\$?(\d+)/);
  const budget = priceMatch ? parseInt(priceMatch[1]) : null;
  
  let filteredProducts = productContext.products;
  
  if (budget) {
    filteredProducts = productContext.products.filter(p => {
      const price = p.salePrice || p.price;
      return price <= budget * 1.15;
    });
  }
  
  if (filteredProducts.length > 0) {
    return {
      response: budget ? `💰 **Options under $${budget}:**` : `💰 **Various price points:**`,
      products: filteredProducts.slice(0, 4).map(formatProduct),
      action: null,
      suggestedActions: ['Show cheaper', 'Premium options']
    };
  }
  
  return handleGeneral(productContext);
}

// Emergency fallback
function getEmergencyResponse() {
  return {
    response: "⚠️ I'm having technical difficulties, but I'm still here!\n\n**Try:**\n• Browsing categories\n• Using search\n• Refreshing",
    products: [],
    action: null
  };
}

// ============================================
// USER CONTEXT
// ============================================

export async function getUserContext(userId) {
  if (!userId) {
    return { cartItemCount: 0, isLoggedIn: false };
  }
  
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const cart = await db.collection('carts').findOne({ userId });
    
    return {
      cartItemCount: cart?.items?.length || 0,
      isLoggedIn: true,
      userId
    };
  } catch (error) {
    console.error('Error fetching user context:', error);
    return { cartItemCount: 0, isLoggedIn: false };
  }
}

// ============================================
// MAIN PROCESSING FUNCTION
// ============================================

export async function processMessage(message, history = [], userContext = {}) {
  try {
    const productContext = await getProductContext(message);
    
    // Try AI first if available
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_api_key_here') {
      try {
        const conversationHistory = buildConversationHistory(history);
        const aiResponse = await callClaudeAPI(message, conversationHistory, productContext, userContext);
        return aiResponse;
      } catch (apiError) {
        console.log('AI unavailable, using intelligent fallback:', apiError.message);
      }
    }
    
    // Use comprehensive fallback system
    return getSmartFallbackResponse(message, productContext, userContext);
    
  } catch (error) {
    console.error('Chatbot processing error:', error);
    return getEmergencyResponse();
  }
}
