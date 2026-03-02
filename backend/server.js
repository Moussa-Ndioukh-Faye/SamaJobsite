require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes        = require('./src/routes/auth');
const userRoutes        = require('./src/routes/users');
const missionRoutes     = require('./src/routes/missions');
const candidatureRoutes = require('./src/routes/candidatures');
const evaluationRoutes  = require('./src/routes/evaluations');
const messageRoutes     = require('./src/routes/messages');
const adminRoutes       = require('./src/routes/admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middlewares globaux ───────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/missions',    missionRoutes);
app.use('/api/candidatures',candidatureRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/messages',    messageRoutes);
app.use('/api/admin',       adminRoutes);

// ─── Route santé ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SamaJob API opérationnelle' });
});

// ─── Route 404 (route inconnue) ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable : ${req.method} ${req.path}` });
});

// ─── Gestion erreurs globale ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  // Erreurs Prisma connues
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: 'Cette valeur existe déjà (doublon). Vérifiez les données saisies.',
    });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'L\'enregistrement recherché n\'existe pas ou a été supprimé.',
    });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({
      message: 'Référence invalide : une ressource liée est introuvable.',
    });
  }

  // Erreur JSON malformé
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Le corps de la requête contient du JSON invalide.' });
  }

  // Payload trop grand
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Données trop volumineuses.' });
  }

  console.error(`[${new Date().toISOString()}] ❌ Erreur ${req.method} ${req.path}:`, err.message);

  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur. Réessayez dans quelques instants.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`✅ SamaJob API démarrée sur http://localhost:${PORT}`);
});
