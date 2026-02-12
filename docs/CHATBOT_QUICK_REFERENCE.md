# AI Chatbot Quick Reference

## 🚀 Quick Start Checklist

- [ ] Get Anthropic API key from https://console.anthropic.com/
- [ ] Add `ANTHROPIC_API_KEY=your_key` to `.env.local`
- [ ] Restart dev server (`npm run dev`)
- [ ] Test chatbot with sample queries
- [ ] Monitor usage in console logs

---

## 📝 Example Test Queries

### Product Search
```
"Show me wireless headphones"
"Looking for laptops under $1000"
"I need running shoes"
"Best smartphones available"
"Show me your electronics"
```

### Deals & Sales
```
"What deals do you have?"
"Any products on sale?"
"Show me discounted items"
"Best bargains right now"
```

### Conversational
```
"Help me find a gift for my mom"
"I'm looking for something special"
"What's popular?"
"Surprise me"
"I need help choosing"
```

### Navigation
```
"What categories do you have?"
"Show me your categories"
"Browse electronics"
"View all products"
```

---

## 🎯 System Prompt Highlights

The AI is trained to:
- Be **friendly and conversational** (not robotic)
- Keep responses **concise** (2-6 sentences)
- Suggest **2-3 products** when relevant
- Use **emojis sparingly** (🛍️ ✨ 🔥)
- **Never say "we don't have"** - always suggest alternatives
- Focus on **value, not just price**
- Guide toward **purchase without being pushy**
- **Reduce friction** in the shopping journey

---

## 🔧 Key Files

| File | Purpose |
|------|---------|
| `src/lib/chatbotLogic.js` | Core AI logic and Claude API integration |
| `src/app/api/chatbot/route.js` | API endpoint for chatbot |
| `src/Chatbot/AIChatbot.jsx` | Frontend chatbot component |
| `docs/AI_CHATBOT_SETUP.md` | Complete setup guide |

---

## 💡 Customization Quick Tips

### Change AI Model
```javascript
// In src/lib/chatbotLogic.js
model: "claude-sonnet-4-20250514" // Current
// Options:
// "claude-3-5-sonnet-20241022" - Most balanced
// "claude-3-haiku-20240307" - Faster, cheaper
// "claude-opus-4-20250514" - Most capable, expensive
```

### Adjust Response Length
```javascript
// In src/lib/chatbotLogic.js
max_tokens: 1024 // Current
// Lower = shorter responses, cheaper
// Higher = longer responses, more expensive
```

### Change Product Limit
```javascript
// In src/lib/chatbotLogic.js, getProductContext()
.limit(10) // Products sent to AI
// More = more context, higher cost
// Less = less context, faster response
```

### Modify Conversation Memory
```javascript
// In src/lib/chatbotLogic.js, buildConversationHistory()
.slice(-6) // Last 6 messages (3 exchanges)
// More = better context, higher cost
// Less = cheaper, may lose context
```

---

## 📊 API Response Structure

```json
{
  "response": "AI-generated text response",
  "products": [
    {
      "name": "Product Name",
      "slug": "product-slug",
      "formattedPrice": "$99.99",
      "image": "https://...",
      "category": "Electronics"
    }
  ],
  "action": "cart|orders|browse|search|null",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "AI service unavailable" | Check API key in `.env.local` |
| No products in response | Add products to MongoDB |
| Generic responses | Improve product descriptions |
| Slow responses | Reduce context window or use Haiku model |
| High costs | Implement caching, reduce token limits |

---

## 💰 Cost Calculator

### Typical Conversation
- **User message**: ~50 tokens
- **System prompt**: ~1500 tokens
- **Product context**: ~500 tokens
- **AI response**: ~200 tokens
- **Total**: ~2250 tokens per exchange

### Pricing (Claude Sonnet)
- **Input**: $3 / 1M tokens
- **Output**: $15 / 1M tokens
- **Cost per conversation**: ~$0.01

### Monthly Estimates
| Conversations | Approximate Cost |
|---------------|------------------|
| 100 | $1 |
| 1,000 | $10 |
| 10,000 | $100 |

---

## 🎨 UI Customization Colors

```jsx
// Quick Action Buttons
'from-purple-500 to-pink-500'    // Purple-Pink gradient
'from-orange-500 to-red-500'     // Orange-Red gradient  
'from-blue-500 to-cyan-500'      // Blue-Cyan gradient
'from-green-500 to-teal-500'     // Green-Teal gradient

// Header
'from-gray-900 via-gray-800 to-gray-900' // Dark gradient

// Messages
'from-gray-900 to-gray-800'      // User messages (dark)
'bg-white'                        // AI messages (light)
```

---

## 📈 Analytics Events to Track

```javascript
// Track these in your analytics platform
{
  event: 'chatbot_message',
  userId: userId,
  message: message,
  productsShown: productsCount,
  action: actionType,
  timestamp: timestamp
}

// Conversion tracking
{
  event: 'chatbot_product_click',
  productId: productId,
  source: 'chatbot'
}

{
  event: 'chatbot_to_purchase',
  userId: userId,
  conversionTime: minutes
}
```

---

## 🔒 Security Checklist

- [x] API key in environment variable (not in code)
- [x] Input validation (500 char limit)
- [x] Server-side API calls only
- [x] Error handling with safe fallbacks
- [ ] Add rate limiting (implement this)
- [ ] Add CORS protection (implement this)
- [ ] Add request logging (implement this)

---

## 🚦 Testing Checklist

- [ ] Product search works
- [ ] Category browsing works
- [ ] Deal detection works
- [ ] Product cards display correctly
- [ ] Loading animation shows
- [ ] Error handling works (try without API key)
- [ ] Responsive on mobile
- [ ] Quick actions work
- [ ] Character counter shows at 400+
- [ ] Links to products work

---

## 📞 Support

For issues with:
- **Claude API**: https://support.anthropic.com/
- **This implementation**: Check `docs/AI_CHATBOT_SETUP.md`
- **MongoDB queries**: Check product schema in database

---

**Remember**: The chatbot learns from your product catalog. The better your product data (names, descriptions, categories), the better the AI recommendations!
