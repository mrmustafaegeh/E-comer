# AI Chatbot Setup Guide

## 🎉 Your E-Commerce AI Chatbot is Ready!

Your chatbot has been enhanced with Claude AI for intelligent, context-aware shopping assistance. Follow these steps to complete the setup.

---

## 📋 Setup Steps

### 1. Get Your Anthropic API Key

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** in the left sidebar
4. Click **Create Key**
5. Give it a name (e.g., "E-commerce Chatbot")
6. Copy the generated API key

### 2. Configure Environment Variables

Open your `.env.local` file and replace the placeholder:

```bash
ANTHROPIC_API_KEY=your_actual_api_key_here
```

**Important:** Keep this key secret! Never commit it to version control.

### 3. Restart Your Development Server

After updating the `.env.local` file, restart your Next.js server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

---

## ✅ What's Been Implemented

### 🤖 Intelligent AI Features
- **Claude AI Integration** - Powered by Anthropic's Claude Sonnet for natural conversations
- **Product Search** - Smart product recommendations based on user queries
- **Context Awareness** - Remembers conversation history (last 6 messages)
- **User Personalization** - Adapts responses based on cart items and browsing history
- **Smart Fallbacks** - Gracefully handles API errors with helpful fallback responses

### 🎨 Premium UI/UX
- **Modern Design** - Gradient backgrounds, smooth animations, glassmorphism effects
- **Quick Actions** - One-click suggestions (Surprise me, Find deals, New arrivals)
- **Product Cards** - Beautiful product previews with images and prices right in chat
- **Character Counter** - Shows remaining characters (500 max)
- **Loading Animations** - Smooth bouncing dots while AI thinks
- **Auto-focus** - Input focuses automatically when chatbot opens

### 🔧 Advanced Capabilities
- **Product Context** - AI has real-time access to your product catalog
- **Category Awareness** - Knows all your product categories
- **Deal Detection** - Highlights sales and discounts
- **Action Intents** - Detects when users want to view cart, track orders, etc.
- **Analytics Logging** - Tracks chatbot interactions for improvement

---

## 🧪 Testing Your Chatbot

Try these test queries:

### Product Search
- "Show me wireless headphones under $200"
- "I need a gift for my tech-savvy friend"
- "Looking for laptops with good battery life"

### Deals & Sales
- "What deals do you have?"
- "Show me products on sale"
- "Any discounts available?"

### Navigation
- "What's in my cart?"
- "Track my order"
- "Browse electronics category"

### Conversational
- "I'm looking for something special"
- "What's popular right now?"
- "Surprise me with something cool"

---

## 🎯 How It Works

### 1. User Message Flow
```
User types message → Frontend sends to API → API processes with Claude AI → 
Response parsed → Product cards generated → Response displayed
```

### 2. Context Building
The AI receives:
- **Product Context**: Relevant products from your database
- **User Context**: Cart items, purchase history, browsing patterns
- **Conversation History**: Last 6 messages for continuity
- **System Prompt**: Comprehensive instructions on being a helpful shopping assistant

### 3. Response Generation
Claude AI:
- Analyzes user intent
- Searches relevant products
- Generates natural, friendly responses
- Suggests specific products with details
- Provides actionable next steps

---

## 🛠️ Database Schema (Optional Enhancements)

### Current Collections Used
- `products` - Product catalog with search fields
- `categories` - Product categories
- `carts` - User shopping carts
- `orders` - Order history

### Recommended: Add User Analytics Collection

```javascript
// Collection: userAnalytics
{
  _id: ObjectId,
  userId: ObjectId,
  recentCategories: ["Electronics", "Home & Garden"],
  recentProducts: [ObjectId, ObjectId],
  averagePurchaseValue: 150.00,
  totalPurchases: 12,
  preferredBrands: ["Sony", "Apple"],
  lastVisit: ISODate,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

This enables better personalization!

### Recommended: Add Chatbot Logs Collection

```javascript
// Collection: chatbot_logs
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: "unique-session-id",
  userMessage: "I'm looking for wireless headphones",
  aiResponse: "...",
  productsShown: [ObjectId, ObjectId],
  action: "product_search",
  timestamp: ISODate
}
```

This helps improve the chatbot over time!

---

## 🚀 Advanced Features (Optional)

### 1. Streaming Responses
Make responses appear word-by-word for better UX:
```javascript
// Use Claude's streaming API
const stream = await anthropic.messages.stream({...});
```

### 2. Multi-language Support
Detect and respond in user's language:
```javascript
const language = detectLanguage(message);
systemPrompt += `\nRespond in ${language}.`;
```

### 3. Sentiment Analysis
Detect frustrated users and escalate:
```javascript
if (sentiment === 'frustrated') {
  escalateToHuman();
}
```

### 4. Product Comparison
Enhanced comparisons with side-by-side features:
```javascript
"Compare the **iPhone 15** vs **Samsung S24**:

| Feature | iPhone 15 | Samsung S24 |
|---------|-----------|-------------|
| Price   | $799      | $749        |
| Camera  | 48MP      | 50MP        |
..."
```

---

## 💰 Cost Optimization

### Claude API Pricing (as of 2024)
- **Input**: ~$3 per million tokens
- **Output**: ~$15 per million tokens

### Estimated Costs
- Average conversation: 500-1000 tokens
- Cost per conversation: $0.01 - $0.02
- 1000 conversations/month: ~$10-20

### Tips to Reduce Costs
1. **Limit context window** (currently set to last 6 messages)
2. **Cache frequent queries** in Redis
3. **Use fallback responses** for simple queries
4. **Rate limiting** to prevent abuse
5. **Use Claude Haiku** for simple queries (cheaper model)

---

## 📊 Monitoring & Analytics

Track these metrics in your analytics:

### Key Metrics
- **Conversion rate** from chatbot users
- **Average conversation length**
- **Product click-through rate** from chatbot recommendations
- **Most common queries**
- **Error rates**
- **Response times**

### Implementation
The API route already logs interactions:
```javascript
logChatbotInteraction(userId, message, result);
```

Extend this to send to your analytics platform!

---

## 🐛 Troubleshooting

### Chatbot not responding
1. Check `.env.local` has valid `ANTHROPIC_API_KEY`
2. Restart development server
3. Check browser console for errors
4. Verify MongoDB connection

### Error: "AI service temporarily unavailable"
- API key might be invalid
- Rate limit reached (check Anthropic dashboard)
- Network connectivity issues

### Products not showing in responses
- Ensure products exist in MongoDB `products` collection
- Check product fields have searchable content (name, description, category)
- Verify product images are accessible URLs

### Responses are too generic
- Add more products to your database
- Increase product detail in descriptions
- Train AI with more specific product attributes

---

## 🎨 Customization Guide

### Change Chatbot Colors
In `src/Chatbot/AIChatbot.jsx`:
```jsx
// Header gradient
className="bg-gradient-to-r from-blue-900 to-purple-900"

// Quick action colors
color: 'from-green-500 to-teal-500'
```

### Modify System Prompt
In `src/lib/chatbotLogic.js`, function `buildSystemPrompt()`:
- Adjust tone and personality
- Add/remove capabilities
- Change response guidelines
- Add store-specific policies

### Adjust Product Limit
```javascript
.limit(10) // Change to show more/fewer products
```

---

## 🔐 Security Best Practices

1. **Never expose API key** in frontend code
2. **Validate user input** (max 500 chars implemented)
3. **Rate limiting** on API route
4. **Sanitize database queries** to prevent injection
5. **HTTPS only** in production

---

## 📚 Next Steps

1. **Get API Key** from Anthropic Console
2. **Add to .env.local**
3. **Restart server**
4. **Test chatbot** with various queries
5. **Monitor usage** in Anthropic dashboard
6. **Iterate and improve** based on user feedback

---

## 🤝 Support Resources

- **Anthropic Documentation**: https://docs.anthropic.com/
- **Claude API Reference**: https://docs.anthropic.com/en/api/
- **Rate Limits & Pricing**: https://docs.anthropic.com/en/api/rate-limits

---

## 🎉 You're All Set!

Your AI-powered shopping assistant is ready to help customers find products, answer questions, and boost conversions!

**Pro Tip:** Monitor the chatbot interactions in your console logs to see what users are asking. Use this data to improve your product descriptions and add more relevant products!

---

Made with ❤️ using Claude AI and Next.js
