# 🔑 How to Get Your Anthropic API Key

## Step-by-Step Visual Guide

### Step 1: Visit Anthropic Console
1. Go to: **https://console.anthropic.com/**
2. You'll see the Anthropic Console homepage

### Step 2: Sign Up or Log In
- If you don't have an account:
  - Click **"Sign Up"**
  - Enter your email address
  - Verify your email
  - Complete the registration
  
- If you already have an account:
  - Click **"Log In"**
  - Enter your credentials

### Step 3: Navigate to API Keys
Once logged in:
1. Look for **"API Keys"** in the left sidebar
2. Click on it to open the API Keys page

### Step 4: Create a New API Key
1. Click the **"Create Key"** button (usually orange/prominent)
2. A dialog will appear asking for:
   - **Name**: Give it a descriptive name (e.g., "E-commerce Chatbot")
   - **Workspace**: Select your workspace (usually "Personal")
3. Click **"Create Key"**

### Step 5: Copy Your API Key
⚠️ **IMPORTANT**: The API key will only be shown ONCE!

1. Your key will appear on screen (starts with `sk-ant-`)
2. Click the **"Copy"** button
3. The key should look like:
   ```
   sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Step 6: Save to .env.local
1. Open your project's `.env.local` file
2. Find the line:
   ```bash
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
3. Replace `your_anthropic_api_key_here` with your actual key:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. **Save the file**

### Step 7: Restart Your Dev Server
```bash
# Stop your server (Ctrl + C in terminal)
# Then restart:
npm run dev
```

---

## 🎉 You're Done!

Your chatbot is now connected to Claude AI!

---

## 💳 Billing & Credits

### Free Credits
- New accounts typically get **$5 in free credits**
- This is enough for approximately:
  - **500-1000 conversations**
  - Perfect for testing and development!

### Monitor Usage
1. In Anthropic Console, go to **"Usage"** or **"Billing"**
2. You can see:
   - Current credit balance
   - Token usage
   - API call statistics
   - Spending over time

### Set Up Billing (Optional)
1. Go to **"Billing"** in the console
2. Add a payment method to continue after free credits
3. Set monthly spending limits to control costs

---

## 🔒 Security Rules

### ✅ DO:
- Store API key in `.env.local` file
- Keep `.env.local` in `.gitignore`
- Use environment variables
- Regenerate key if exposed

### ❌ DON'T:
- Commit API key to Git
- Share your API key publicly
- Use it in frontend/client-side code
- Hardcode it in your application

---

## 🔄 Key Management

### Regenerate a Key
If your key is compromised:
1. Go to **API Keys** in console
2. Find your key in the list
3. Click **"Regenerate"** or **"Delete"**
4. Create a new key
5. Update `.env.local` with new key
6. Restart your server

### Multiple Keys
You can create multiple keys for:
- **Development**: For local testing
- **Staging**: For staging environment
- **Production**: For live website

Track which key is used where by naming them clearly!

---

## 🐛 Troubleshooting

### "Invalid API Key" Error
✅ Check:
- Key is correctly copied (no extra spaces)
- Starts with `sk-ant-`
- `.env.local` file saved
- Server restarted after adding key

### "Rate Limit Exceeded" Error
✅ Solutions:
- Wait a few minutes
- Check your usage in console
- Upgrade your plan if needed
- Implement caching to reduce calls

### "Insufficient Credits" Error
✅ Solutions:
- Check credit balance in console
- Add billing information
- Purchase more credits
- Free tier credits may be depleted

---

## 📊 API Key Dashboard

In your Anthropic Console, you can:
- **View all API keys** with names and creation dates
- **See usage statistics** per key
- **Disable/enable keys** without deleting them
- **Set permissions** (if available)
- **Monitor spending** in real-time

---

## 💡 Pro Tips

1. **Name Your Keys Clearly**
   - "Local Dev - Chatbot"
   - "Production - E-commerce AI"
   - "Testing - Feature X"

2. **Rotate Keys Regularly**
   - Regenerate every 3-6 months
   - Especially before deploying to production

3. **Use Different Keys per Environment**
   - Easier to track usage
   - Better security
   - Easier to disable if needed

4. **Set Up Alerts**
   - Get notified when credits are low
   - Monitor for unusual usage patterns

5. **Test Before Going Live**
   - Use free credits for development
   - Only add billing when ready for production

---

## 📞 Need Help?

- **Anthropic Support**: https://support.anthropic.com/
- **API Documentation**: https://docs.anthropic.com/
- **Community**: Anthropic Discord or forums

---

## ✅ Final Checklist

Before testing your chatbot:

- [ ] Created Anthropic account
- [ ] Generated API key
- [ ] Copied key to `.env.local`
- [ ] Saved the file
- [ ] Restarted dev server
- [ ] Tested with a simple message
- [ ] Checked console for errors
- [ ] Confirmed API key is working

---

**🎊 Ready to Chat!**

Your AI chatbot should now be responding with intelligent, context-aware messages powered by Claude AI!

Try asking it: "Show me your best products" or "Help me find a gift"

---

## 🔗 Quick Links

- **Get API Key**: https://console.anthropic.com/settings/keys
- **View Usage**: https://console.anthropic.com/settings/usage
- **Manage Billing**: https://console.anthropic.com/settings/billing
- **Documentation**: https://docs.anthropic.com/en/api/getting-started

---

*Last Updated: February 2026*
