# 🚀 Deployment Guide

This guide covers deploying your e-commerce platform to production environments.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Deploy to Vercel (Recommended)](#deploy-to-vercel-recommended)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Stripe Configuration](#stripe-configuration)
- [Cloudinary Setup](#cloudinary-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Alternative Platforms](#alternative-platforms)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- [ ] GitHub account with your code pushed
- [ ] MongoDB Atlas account (free tier available)
- [ ] Stripe account (test and live keys)
- [ ] Cloudinary account (for image hosting)
- [ ] Upstash account (for rate limiting)
- [ ] Domain name (optional but recommended)

---

## Deploy to Vercel (Recommended)

Vercel is the recommended platform as it's built by the Next.js team and offers the best performance.

### Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Ensure `.env.local` is in `.gitignore`:**
   ```bash
   # Should already be there
   echo ".env.local" >> .gitignore
   ```

### Step 2: Import to Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Select your repository
   - Click "Import"

3. **Configure Build Settings:**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables** (see [Environment Variables](#environment-variables) section)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)

### Step 3: Configure Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

---

## MongoDB Atlas Setup

### Step 1: Create Cluster

1. **Go to MongoDB Atlas:**
   - Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in

2. **Create New Cluster:**
   - Click "Build a Database"
   - Choose "Shared" (Free tier)
   - Select a cloud provider and region (choose closest to your users)
   - Click "Create Cluster"

3. **Configure Security:**
   - Database Access → Add New Database User
   - Username: `ecommerce-app`
   - Password: Generate secure password (save it!)
   - Database User Privileges: `Read and write to any database`

4. **Network Access:**
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel's IP ranges for better security

### Step 2: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://ecommerce-app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add this to your environment variables as `MONGODB_URI`

### Step 3: Seed Production Database

```bash
# Update .env.local with production MongoDB URI
MONGODB_URI=mongodb+srv://...
MONGODB_DB=ecommerce

# Run seeding script
node scripts/seed-full-products.js
```

---

## Stripe Configuration

### Step 1: Get API Keys

1. **Go to Stripe Dashboard:**
   - Visit [dashboard.stripe.com](https://dashboard.stripe.com)
   - Sign up or log in

2. **Get Test Keys (for testing):**
   - Go to Developers → API keys
   - Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy "Secret key" → `STRIPE_SECRET_KEY`

3. **Get Live Keys (for production):**
   - Toggle "Test mode" OFF
   - Copy new keys from API keys page
   - ⚠️ Keep secret key secure!

### Step 2: Configure Webhooks

1. **Create Webhook Endpoint:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://yoursite.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

2. **Get Webhook Secret:**
   - After creating, click on the webhook
   - Reveal signing secret
   - Copy to `STRIPE_WEBHOOK_SECRET`

### Step 3: Test Payments

Use these test cards in test mode:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Any future expiry date, any CVC

---

## Cloudinary Setup

### Step 1: Create Account

1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Verify email

### Step 2: Get Credentials

1. Go to Dashboard
2. Copy these values:
   - Cloud Name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

### Step 3: Configure Upload Preset (Optional)

1. Go to Settings → Upload
2. Create upload preset:
   - Name: `ecommerce-products`
   - Signing Mode: Unsigned
   - Folder: `products`
   - Transformations: Auto quality and format

---

## Upstash Redis Setup

### Step 1: Create Database

1. Visit [console.upstash.com](https://console.upstash.com)
2. Create new Redis database
3. Choose region closest to Vercel region

### Step 2: Get Credentials

1. Go to database details
2. Copy REST API credentials:
   - REST URL → `UPSTASH_REDIS_REST_URL`
   - REST Token → `UPSTASH_REDIS_REST_TOKEN`

---

## Environment Variables

### Production Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://yoursite.com
NEXT_PUBLIC_SITE_NAME=Your Store Name
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=ecommerce

# Authentication
NEXTAUTH_SECRET=your-production-secret-here
NEXTAUTH_URL=https://yoursite.com

# Stripe (LIVE KEYS)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

---

## Post-Deployment

### Step 1: Verify Deployment

1. **Check Build Logs:**
   - Ensure no build errors
   - Check for warnings

2. **Test Core Features:**
   - [ ] Homepage loads
   - [ ] Product listing works
   - [ ] Product details page works
   - [ ] Search functionality
   - [ ] Category filtering
   - [ ] Add to cart
   - [ ] Checkout process
   - [ ] Payment (with test card)

3. **Test Admin Panel:**
   - [ ] Login works
   - [ ] Product management
   - [ ] Order management

### Step 2: Performance Optimization

1. **Run Lighthouse Audit:**
   - Open DevTools
   - Go to Lighthouse tab
   - Run audit
   - Fix any issues

2. **Check Image Optimization:**
   - Verify images load correctly
   - Check image sizes
   - Ensure proper caching

3. **Monitor Core Web Vitals:**
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

### Step 3: Set Up Monitoring

1. **Vercel Analytics:**
   - Enable in project settings
   - Monitor real user metrics

2. **Error Tracking** (Optional):
   - Set up Sentry for error tracking
   - Monitor production errors

3. **Uptime Monitoring:**
   - Use UptimeRobot or similar
   - Get alerts for downtime

---

## Alternative Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build for production
npm run build

# Deploy
netlify deploy --prod
```

Add environment variables in Netlify dashboard.

### Railway

1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### DigitalOcean App Platform

1. Import from GitHub
2. Configure build settings:
   ```
   Build Command: npm run build
   Run Command: npm start
   ```
3. Add environment variables
4. Deploy

### AWS Amplify

1. Connect repository
2. Configure build settings
3. Add environment variables
4. Deploy

---

## SSL/HTTPS Configuration

### On Vercel (Automatic)
SSL certificates are automatically provisioned and renewed.

### On Custom Server

1. **Get SSL Certificate:**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d yoursite.com
   ```

2. **Auto-renewal:**
   ```bash
   # Test renewal
   sudo certbot renew --dry-run
   ```

---

## Database Backup

### Automated Backups (MongoDB Atlas)

1. Go to Clusters → Backup tab
2. Enable Cloud Backups
3. Configure retention policy
4. Set up automated snapshots

### Manual Backup

```bash
# Export database
mongodump --uri="mongodb+srv://..." --out=./backup

# Restore database
mongorestore --uri="mongodb+srv://..." ./backup
```

---

## Troubleshooting

### Build Fails

**Issue:** Build fails with errors

**Solutions:**
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Verify environment variables are set
- Test build locally: `npm run build`

### Database Connection Fails

**Issue:** Can't connect to MongoDB

**Solutions:**
- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure user has correct permissions
- Test connection string locally

### Images Not Loading

**Issue:** Product images don't display

**Solutions:**
- Check `next.config.js` image domains
- Verify Cloudinary credentials
- Check image URLs are valid
- Clear browser cache

### Stripe Webhooks Not Working

**Issue:** Orders not updating after payment

**Solutions:**
- Verify webhook URL is correct
- Check webhook signing secret
- View webhook logs in Stripe dashboard
- Test webhook with Stripe CLI

### Slow Performance

**Issue:** Site loads slowly

**Solutions:**
- Enable CDN caching
- Optimize images (use WebP format)
- Enable ISR for static pages
- Check database query performance
- Use Redis caching

### Rate Limiting Issues

**Issue:** "Too many requests" errors

**Solutions:**
- Verify Upstash Redis is configured
- Check rate limit settings
- Monitor Redis usage
- Adjust limits if needed

---

## Rollback Strategy

### In Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Manual Rollback

```bash
# Rollback to previous commit
git revert HEAD
git push origin main
```

---

## Security Checklist

Before going live:

- [ ] All API routes have authentication
- [ ] Rate limiting is enabled
- [ ] CSRF protection is active
- [ ] Input validation on all forms
- [ ] SQL injection protection (using MongoDB ODM)
- [ ] XSS protection enabled
- [ ] HTTPS enforced
- [ ] Secure headers configured
- [ ] Secrets are not in code
- [ ] `.env.local` is gitignored
- [ ] Admin routes are protected
- [ ] File upload security
- [ ] CORS configured correctly

---

## Performance Checklist

- [ ] Images are optimized
- [ ] Lazy loading implemented
- [ ] Code splitting enabled
- [ ] Bundle size analyzed
- [ ] Caching configured
- [ ] Database indexes created
- [ ] API responses cached
- [ ] CDN configured
- [ ] Compression enabled
- [ ] Critical CSS inlined

---

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor error logs
- Check analytics
- Review performance metrics

**Monthly:**
- Update dependencies: `npm update`
- Review security advisories
- Backup database
- Check SSL expiry

**Quarterly:**
- Performance audit
- Security audit
- User testing
- Feature updates

---

## Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **MongoDB Atlas:** [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)
- **Stripe Docs:** [stripe.com/docs](https://stripe.com/docs)

---

**Your e-commerce platform is now ready for production! 🎉**

For questions or issues, refer to the main [README.md](../README.md) or open an issue on GitHub.
