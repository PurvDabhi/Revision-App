# 🔄 Restart Instructions

The frontend is using cached API calls. To fix:

## 1. Stop Both Servers
- Close both terminal windows
- Or press Ctrl+C in each terminal

## 2. Clear Browser Cache
- Press Ctrl+Shift+R (hard refresh)
- Or open DevTools → Network → Disable cache
- Or use incognito/private window

## 3. Restart Servers
```bash
# Method 1: Use batch file
RUN.bat

# Method 2: Manual
# Terminal 1
cd server && npm run dev

# Terminal 2  
cd frontend && npm run dev
```

## 4. Open Fresh Browser
- Go to http://localhost:3000
- The API should now connect to port 5173

The issue is browser cache - a fresh restart will fix it!