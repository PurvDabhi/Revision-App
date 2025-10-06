# Deployment Guide

## Quick Deploy to Vercel/Netlify

### Frontend (Vercel/Netlify)
1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting service

### Backend (Railway/Render/Heroku)
1. Set environment variables:
   - `OPENAI_API_KEY`
   - `YOUTUBE_API_KEY` (optional)
   - `NODE_ENV=production`

2. Build and start:
```bash
cd server
npm run build
npm start
```

## Environment Variables for Production

```env
OPENAI_API_KEY=sk-...
YOUTUBE_API_KEY=AIza...
NODE_ENV=production
PORT=5173
```

## Database

The app uses SQLite which creates a local file. For production, consider:
- PostgreSQL for better scalability
- MongoDB for document storage
- Or keep SQLite for simplicity

## File Storage

Currently stores PDFs locally. For production:
- AWS S3 for file storage
- Cloudinary for PDF processing
- Or keep local storage for simplicity