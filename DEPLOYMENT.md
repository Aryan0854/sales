# GitHub Deployment Guide

This guide will help you deploy the Sales Analytics Platform to GitHub Pages.

## 🚀 Quick Deployment

### 1. **Push to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Sales Analytics Platform"

# Add remote repository
git remote add origin https://github.com/Aryan0854/sales.git

# Push to main branch
git push -u origin main
```

### 2. **Enable GitHub Pages**

1. Go to your repository: https://github.com/Aryan0854/sales
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Select **gh-pages** branch
6. Click **Save**

### 3. **Automatic Deployment**

The GitHub Actions workflow will automatically:
- Build the project
- Run type checking and linting
- Deploy to GitHub Pages
- Make it available at: https://aryan0854.github.io/sales

## 🔧 Manual Deployment

### **Option 1: Using GitHub Actions (Recommended)**

The `.github/workflows/deploy.yml` file is already configured. Just push to main branch:

```bash
git push origin main
```

### **Option 2: Manual Build and Deploy**

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Export for static hosting
npm run export

# The static files will be in the 'out' directory
```

## 📁 Repository Structure

```
sales/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── app/                        # Next.js App Router
├── components/                 # React components
├── hooks/                      # Custom hooks
├── lib/                        # Utilities
├── public/                     # Static assets
│   └── data/                   # CSV data
├── scripts/                    # Python scripts
├── .gitignore                  # Git ignore rules
├── next.config.mjs            # Next.js config
├── package.json               # Dependencies
├── README.md                  # Documentation
└── DEPLOYMENT.md             # This file
```

## ⚙️ Configuration Files

### **package.json**
```json
{
  "name": "sales-analytics-platform",
  "homepage": "https://aryan0854.github.io/sales",
  "scripts": {
    "build": "next build",
    "export": "next build && next export",
    "deploy": "npm run build && npm run export"
  }
}
```

### **next.config.mjs**
```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

## 🔍 Troubleshooting

### **Build Errors**

1. **TypeScript Errors**
   ```bash
   npm run type-check
   ```

2. **Linting Errors**
   ```bash
   npm run lint
   ```

3. **Dependency Issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### **Deployment Issues**

1. **GitHub Actions Not Running**
   - Check if the workflow file is in `.github/workflows/`
   - Ensure you're pushing to main/master branch

2. **Pages Not Updating**
   - Check the Actions tab for build status
   - Verify gh-pages branch exists
   - Check Pages settings in repository

3. **Static Export Issues**
   - Ensure `output: 'export'` is in next.config.mjs
   - Remove any server-side features

## 📊 Performance Optimization

### **For GitHub Pages**

1. **Optimize Images**
   ```bash
   # Use WebP format
   # Compress images
   # Use appropriate sizes
   ```

2. **Minimize Bundle Size**
   ```bash
   # Analyze bundle
   npm run build
   # Check .next/analyze/ for bundle analysis
   ```

3. **Enable Compression**
   - GitHub Pages automatically serves gzipped files
   - Ensure proper caching headers

## 🔒 Security Considerations

1. **Environment Variables**
   - Don't commit `.env` files
   - Use GitHub Secrets for sensitive data

2. **CSV Data**
   - Large files are handled with sampling
   - Consider data privacy requirements

3. **Dependencies**
   - Regular security updates
   - Audit dependencies: `npm audit`

## 📈 Monitoring

### **GitHub Actions**
- Monitor build status in Actions tab
- Check for failed deployments
- Review build logs for errors

### **Performance**
- Use browser dev tools for performance
- Monitor Core Web Vitals
- Check mobile responsiveness

## 🚀 Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to repository Settings > Pages
   - Add custom domain
   - Update DNS settings

2. **SSL Certificate**
   - GitHub provides automatic SSL
   - Force HTTPS in settings

## 📝 Maintenance

### **Regular Updates**
```bash
# Update dependencies
npm update

# Check for security issues
npm audit

# Update Next.js
npm install next@latest
```

### **Backup Strategy**
- Repository serves as backup
- Consider data backup for CSV files
- Document configuration changes

## 🆘 Support

If you encounter issues:

1. **Check GitHub Actions logs**
2. **Review build output**
3. **Verify configuration files**
4. **Test locally first**

## 📚 Additional Resources

- [GitHub Pages Documentation](https://pages.github.com/)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Your application will be available at: https://aryan0854.github.io/sales** 