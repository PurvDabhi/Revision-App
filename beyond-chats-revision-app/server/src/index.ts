import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, '../../data/uploads') });

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.get('/api/pdfs', (req, res) => {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) return res.json([]);
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.pdf'));
  res.json(files);
});

app.post('/api/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

app.listen(5173, () => console.log('Server running on http://localhost:5173'));
