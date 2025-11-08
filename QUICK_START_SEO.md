# Quick Start: SEO Checklist for Puranveshana

Follow these steps in order to get your site indexed on Google.

## Step 1: Generate Icons (15 minutes)

1. Open the icon generator:
   ```bash
   open scripts/generate-icons.html
   ```

2. Click each "Download" button and save to `/public` folder:
   - [ ] favicon.ico
   - [ ] apple-touch-icon.png
   - [ ] icon-192.png
   - [ ] icon-512.png
   - [ ] logo.png
   - [ ] og-image.jpg

## Step 2: Deploy to Vercel (5 minutes)

```bash
git add .
git commit -m "Add comprehensive SEO optimization with orange pin icons"
git push
```

Wait for Vercel to deploy (usually 2-3 minutes)

## Step 3: Verify Deployment (2 minutes)

Visit these URLs and make sure they work:

- [ ] https://puranveshana.vercel.app (homepage)
- [ ] https://puranveshana.vercel.app/sitemap.xml
- [ ] https://puranveshana.vercel.app/robots.txt
- [ ] https://puranveshana.vercel.app/manifest.json

## Step 4: Setup Google Search Console (10 minutes)

1. Go to: https://search.google.com/search-console
2. Click "Add Property"
3. Enter: `https://puranveshana.vercel.app`
4. Choose "HTML tag" verification method
5. Copy the verification code (looks like: `abc123xyz`)
6. Update `app/layout.tsx` line 80 with your code
7. Commit and push again
8. Click "Verify" in Search Console

## Step 5: Submit Sitemap (2 minutes)

In Google Search Console:
1. Go to "Sitemaps" (left sidebar)
2. Enter: `sitemap.xml`
3. Click "Submit"
4. Wait for status to show "Success"

## Step 6: Request Indexing (5 minutes)

In Google Search Console:
1. Go to "URL Inspection" (top search bar)
2. Enter: `https://puranveshana.vercel.app`
3. Wait for results
4. Click "Request Indexing"
5. Wait 1-7 days for indexing

## Step 7: Test SEO (10 minutes)

Test your site with these tools:

1. **Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Enter: `https://puranveshana.vercel.app`
   - Should pass ✓

2. **Mobile-Friendly Test**
   - URL: https://search.google.com/test/mobile-friendly
   - Enter: `https://puranveshana.vercel.app`
   - Should pass ✓

3. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Enter: `https://puranveshana.vercel.app`
   - Aim for 90+ score

## Step 8: Share on Social Media (10 minutes)

Share your site to start building awareness:
- [ ] Facebook
- [ ] Twitter
- [ ] LinkedIn
- [ ] WhatsApp groups
- [ ] Reddit (r/India, r/Archaeology)

Use this text:
```
Introducing Puranveshana! 🏛️

Discover and document India's rich heritage sites with EXIF metadata verification.
Upload archaeological images, verify locations, and earn rewards for heritage preservation.

Check it out: https://puranveshana.vercel.app

#HeritageIndia #Archaeology #Puranveshana
```

## ✅ Completion Checklist

After completing all steps:

- [ ] Icons generated and uploaded
- [ ] Deployed to Vercel
- [ ] All URLs working
- [ ] Google Search Console setup
- [ ] Verification code added
- [ ] Sitemap submitted
- [ ] Indexing requested
- [ ] SEO tests passed
- [ ] Shared on social media

## 📅 Follow-up Schedule

| When | Action |
|------|--------|
| **Day 3** | Check if homepage is indexed: search `site:puranveshana.vercel.app` |
| **Day 7** | Search for "puranveshana" - you should appear! |
| **Day 14** | Review Google Search Console performance |
| **Day 30** | Check rankings, add more content |

## 🎉 You're Done!

Once you complete these steps, your site will:
- ✅ Be discoverable on Google
- ✅ Appear when people search "puranveshana" or "puranveshaa"
- ✅ Have beautiful previews on social media
- ✅ Work as a PWA on mobile devices

**Estimated time to appear in Google:** 3-7 days after submitting sitemap

---

## Need Help?

Refer to these detailed guides:
- `SEO_GUIDE.md` - Comprehensive SEO information
- `ICON_GENERATION.md` - How to generate icons
- `SEO_IMPLEMENTATION_SUMMARY.md` - What's been implemented

---

**Start with Step 1 above** ☝️
