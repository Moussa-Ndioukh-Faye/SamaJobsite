# SamaJob – Plateforme de micro-missions sénégalaise

> Plateforme de mise en relation entre étudiants/prestataires et clients (entreprises ou particuliers) pour des micro-missions locales rémunérées au Sénégal.

---

## Stack technique

| Couche       | Technologies                                         |
|-------------|------------------------------------------------------|
| **Frontend** | React.js (Vite), Tailwind CSS, React Router, Axios  |
| **Backend**  | Node.js, Express.js, Prisma ORM, PostgreSQL          |
| **Auth**     | JWT + bcrypt                                         |
| **Design**   | Bleu marine `#1B2A5E` + Vert `#27AE60` (logo officiel) |

---

## Prérequis

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 (installé et démarré)
- **npm** ou **yarn**

---

## Installation et lancement

### 1. Cloner / Préparer

```bash
cd samajobsite
```

### 2. Backend

```bash
cd backend

# Copier et configurer l'environnement
cp .env.example .env
# Éditez .env : mettez votre DATABASE_URL, JWT_SECRET, etc.

# Installer les dépendances
npm install

# Générer le client Prisma + migrations (crée la base)
npx prisma migrate dev --name init

# (Optionnel) Visualiser la base dans un navigateur
npx prisma studio

# Lancer en développement
npm run dev
# → API disponible sur http://localhost:5000
```

### 3. Frontend

```bash
cd ../frontend

# Copier et configurer l'environnement
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api (par défaut)

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
# → Application disponible sur http://localhost:5173
```

---

## Configuration `.env` backend

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/samajob?schema=public"
JWT_SECRET="samajob_secret_key_super_securisee_2024"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

---

## Créer un compte Admin

Après la migration, créez un admin directement via Prisma Studio ou SQL :

```sql
-- Dans psql ou pgAdmin
UPDATE users SET role = 'ADMIN', statut = 'VALIDE' WHERE email = 'admin@samajob.sn';
```

Ou inscrivez-vous via l'interface puis modifiez le rôle en base.

---

## Structure du projet

```
samajobsite/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        ← Modèles de données
│   ├── src/
│   │   ├── controllers/         ← Logique métier
│   │   │   ├── authController.js
│   │   │   ├── missionController.js
│   │   │   ├── candidatureController.js
│   │   │   ├── evaluationController.js
│   │   │   ├── messageController.js
│   │   │   ├── userController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js          ← Vérification JWT
│   │   │   ├── roleCheck.js     ← Contrôle des rôles
│   │   │   └── validate.js      ← Validation express-validator
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── missions.js
│   │       ├── candidatures.js
│   │       ├── evaluations.js
│   │       ├── messages.js
│   │       ├── users.js
│   │       └── admin.js
│   ├── server.js                ← Point d'entrée
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── MissionCard.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  ← État d'authentification global
    │   ├── services/
    │   │   └── api.js           ← Client Axios configuré
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Missions.jsx
    │   │   ├── MissionDetail.jsx
    │   │   ├── CreateMission.jsx
    │   │   ├── DashboardClient.jsx
    │   │   ├── DashboardPrestataire.jsx
    │   │   ├── DashboardAdmin.jsx
    │   │   ├── AdminValidation.jsx
    │   │   ├── Profile.jsx
    │   │   └── CommentCaMarche.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## API Routes

### Auth
| Méthode | Route              | Description                  |
|---------|-------------------|------------------------------|
| POST    | `/api/auth/register` | Inscription               |
| POST    | `/api/auth/login`    | Connexion                 |
| GET     | `/api/auth/me`       | Profil connecté (JWT)     |

### Missions
| Méthode | Route                     | Rôle requis    |
|---------|--------------------------|----------------|
| GET     | `/api/missions`           | Public          |
| GET     | `/api/missions/:id`       | Public          |
| GET     | `/api/missions/mes-missions` | CLIENT       |
| POST    | `/api/missions`           | CLIENT          |
| PUT     | `/api/missions/:id`       | CLIENT/ADMIN    |
| PATCH   | `/api/missions/:id/terminer` | CLIENT       |
| DELETE  | `/api/missions/:id`       | CLIENT/ADMIN    |

### Candidatures
| Méthode | Route                              | Rôle requis         |
|---------|------------------------------------|---------------------|
| POST    | `/api/candidatures`                | PRESTATAIRE (validé)|
| GET     | `/api/candidatures/mes-candidatures` | PRESTATAIRE       |
| GET     | `/api/candidatures/mission/:id`    | CLIENT              |
| PATCH   | `/api/candidatures/:id/statut`     | CLIENT              |

### Admin
| Méthode | Route                              | Rôle requis |
|---------|-----------------------------------|-------------|
| GET     | `/api/admin/stats`                 | ADMIN       |
| GET     | `/api/admin/users`                 | ADMIN       |
| GET     | `/api/admin/missions`              | ADMIN       |
| GET     | `/api/admin/prestataires/en-attente` | ADMIN     |
| PATCH   | `/api/admin/users/:id/statut`      | ADMIN       |

---

## Cas d'utilisation (selon diagramme)

| Acteur             | Fonctionnalité                                      |
|-------------------|-----------------------------------------------------|
| **Prestataire**    | Postuler, Réaliser mission, Voir historique, Chat  |
| **Client**         | Publier, Consulter candidatures, Sélectionner, Valider fin, Noter |
| **Admin**          | Statistiques, Suspendre compte, Modérer, Gérer missions/users |
| **Tous**           | S'inscrire, Se connecter, Gérer profil, Chat       |

---

## Débogage fréquent

**Prisma: "Can't reach database"** → Vérifiez que PostgreSQL tourne et que `DATABASE_URL` est correcte.

**CORS error** → Vérifiez que `FRONTEND_URL` dans le `.env` backend correspond à l'URL du frontend.

**401 Unauthorized** → Le token JWT a expiré. Reconnectez-vous.
"# SamaJob" 
