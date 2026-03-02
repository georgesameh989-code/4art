import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('4art.db');
const JWT_SECRET = process.env.JWT_SECRET || '4art-secret-key-123';
const ADMIN_EMAIL = 'gogosameh257@gmail.com';

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ar TEXT,
    name_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    price REAL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Initial Settings
const initialSettings = {
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  logo: 'https://picsum.photos/200/50?text=4art',
  siteName_ar: '4art للدعاية والإعلان',
  siteName_en: '4art Advertising',
  heroTitle_ar: 'نحن نصنع الإبداع',
  heroTitle_en: 'We Create Creativity',
  heroSub_ar: 'حلول إعلانية مبتكرة لنمو أعمالك',
  heroSub_en: 'Innovative advertising solutions for your business growth',
  aboutText_ar: 'شركة 4art هي الرائدة في مجال الدعاية والإعلان منذ سنوات...',
  aboutText_en: '4art is a leader in the field of advertising for years...',
  contactEmail: 'info@4art.com',
  contactPhone: '+123456789',
  address_ar: 'القاهرة، مصر',
  address_en: 'Cairo, Egypt',
  sliderImages: JSON.stringify([
    'https://picsum.photos/seed/adv1/1200/600',
    'https://picsum.photos/seed/adv2/1200/600',
    'https://picsum.photos/seed/adv3/1200/600'
  ])
};

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [key, value] of Object.entries(initialSettings)) {
  insertSetting.run(key, value);
}

// Seed Admin User
const adminPassword = bcrypt.hashSync('admin123', 10);
db.prepare('INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)').run(ADMIN_EMAIL, adminPassword, 'admin');

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };

  // Auth Routes
  app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const role = email === ADMIN_EMAIL ? 'admin' : 'user';
      db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(email, hashedPassword, role);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { email: user.email, role: user.role } });
  });

  // Settings Routes
  app.get('/api/settings', (req, res) => {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings: any = {};
    rows.forEach((row: any) => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  });

  app.post('/api/settings', authenticate, isAdmin, (req, res) => {
    const updates = req.body;
    const updateStmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    const insertStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    
    db.transaction(() => {
      for (const [key, value] of Object.entries(updates)) {
        insertStmt.run(key, String(value));
      }
    })();
    res.json({ success: true });
  });

  // Product Routes
  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  });

  app.post('/api/products', authenticate, isAdmin, (req, res) => {
    const { name_ar, name_en, description_ar, description_en, price, image } = req.body;
    db.prepare('INSERT INTO products (name_ar, name_en, description_ar, description_en, price, image) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name_ar, name_en, description_ar, description_en, price, image);
    res.json({ success: true });
  });

  app.put('/api/products/:id', authenticate, isAdmin, (req, res) => {
    const { id } = req.params;
    const { name_ar, name_en, description_ar, description_en, price, image } = req.body;
    db.prepare('UPDATE products SET name_ar = ?, name_en = ?, description_ar = ?, description_en = ?, price = ?, image = ? WHERE id = ?')
      .run(name_ar, name_en, description_ar, description_en, price, image, id);
    res.json({ success: true });
  });

  app.delete('/api/products/:id', authenticate, isAdmin, (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Contact Messages
  app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').run(name, email, message);
    res.json({ success: true });
  });

  app.get('/api/messages', authenticate, isAdmin, (req, res) => {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    res.json(messages);
  });

  // AI Translation
  app.post('/api/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Gemini API key missing' });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following text to ${targetLang === 'ar' ? 'Arabic' : 'English'}. Return ONLY the translated text without any extra comments: "${text}"`,
      });
      res.json({ translatedText: response.text?.trim() });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Translation failed' });
    }
  });

  // Vite setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
