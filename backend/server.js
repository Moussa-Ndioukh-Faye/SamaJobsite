require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const authRoutes        = require('./src/routes/auth');
const userRoutes        = require('./src/routes/users');
const missionRoutes     = require('./src/routes/missions');
const candidatureRoutes = require('./src/routes/candidatures');
const evaluationRoutes  = require('./src/routes/evaluations');
const messageRoutes     = require('./src/routes/messages');
const adminRoutes       = require('./src/routes/admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Sécurité : en-têtes HTTP ─────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ─── Rate limiting ─────────────────────────────────────────────────────────────
// Limite globale : 200 requêtes / 15 min par IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes. Réessayez dans 15 minutes.' },
});

// Limite stricte sur les routes d'authentification : 20 tentatives / 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
});

app.use(globalLimiter);

// ─── Parsing (avec limite de taille) ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         authLimiter, authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/missions',     missionRoutes);
app.use('/api/candidatures', candidatureRoutes);
app.use('/api/evaluations',  evaluationRoutes);
app.use('/api/messages',     messageRoutes);
app.use('/api/admin',        adminRoutes);

// ─── Route santé ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SamaJob API opérationnelle' });
});

// ─── Seed admin (usage unique) ────────────────────────────────────────────────
app.get('/api/seed-admin-x7k2', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const prisma = require('./src/db');
    const hashed = await bcrypt.hash('Admin1234', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@samajob.sn' },
      update: {},
      create: { nom: 'Administrateur SamaJob', email: 'admin@samajob.sn', motDePasse: hashed, role: 'ADMIN', statut: 'VALIDE' },
    });
    res.json({ ok: true, id: admin.id, email: admin.email });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Route 404 ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable.' });
});

// ─── Gestion erreurs globale ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'Cette valeur existe déjà. Vérifiez les données saisies.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'L\'enregistrement recherché n\'existe pas ou a été supprimé.' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ message: 'Référence invalide : une ressource liée est introuvable.' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Le corps de la requête contient du JSON invalide.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Données trop volumineuses (limite 10 ko).' });
  }

  // Ne jamais exposer la stack en production
  const isDev = process.env.NODE_ENV === 'development';
  console.error(`[${new Date().toISOString()}] ❌ ${req.method} ${req.path}:`, err.message);

  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Erreur interne du serveur. Réessayez dans quelques instants.',
    ...(isDev && { stack: err.stack }),
  });
});

// Démarrage local uniquement (pas serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ SamaJob API démarrée sur http://localhost:${PORT}`);
  });
}

module.exports = app;
