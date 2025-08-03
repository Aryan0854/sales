@echo off
echo 🚀 Starting Sales Analytics Platform Deployment...

echo 📦 Installing dependencies...
npm install

echo 🔨 Building project...
npm run build

echo 📤 Adding files to git...
git add .

echo 💾 Committing changes...
git commit -m "Deploy: Sales Analytics Platform update"

echo 🚀 Pushing to GitHub...
git push origin main

echo ✅ Deployment complete!
echo 🌐 Your site will be available at: https://aryan0854.github.io/sales
echo ⏱️  Please wait 2-5 minutes for GitHub Pages to update

pause 