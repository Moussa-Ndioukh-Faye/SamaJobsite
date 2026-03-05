-- ============================================================
--  SamaJob – Script SQL complet pour Supabase
--  À coller dans : Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- ─── 0. NETTOYAGE (supprime l'existant proprement) ──────────

DROP TABLE IF EXISTS messages      CASCADE;
DROP TABLE IF EXISTS evaluations   CASCADE;
DROP TABLE IF EXISTS candidatures  CASCADE;
DROP TABLE IF EXISTS missions      CASCADE;
DROP TABLE IF EXISTS users         CASCADE;

DROP TYPE IF EXISTS "Role"              CASCADE;
DROP TYPE IF EXISTS "StatutCompte"      CASCADE;
DROP TYPE IF EXISTS "StatutMission"     CASCADE;
DROP TYPE IF EXISTS "StatutCandidature" CASCADE;

-- ─── 1. TYPES ENUM ──────────────────────────────────────────

CREATE TYPE "Role"              AS ENUM ('CLIENT', 'PRESTATAIRE', 'ADMIN');
CREATE TYPE "StatutCompte"      AS ENUM ('EN_ATTENTE', 'VALIDE', 'REJETE', 'SUSPENDU');
CREATE TYPE "StatutMission"     AS ENUM ('OUVERTE', 'ATTRIBUEE', 'TERMINEE');
CREATE TYPE "StatutCandidature" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- ─── 2. TABLE USERS ─────────────────────────────────────────

CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  nom            TEXT            NOT NULL,
  email          TEXT            NOT NULL UNIQUE,
  "motDePasse"   TEXT            NOT NULL,
  role           "Role"          NOT NULL DEFAULT 'CLIENT',
  statut         "StatutCompte"  NOT NULL DEFAULT 'EN_ATTENTE',
  telephone      TEXT,
  domaine        TEXT,
  competences    TEXT[]          NOT NULL DEFAULT '{}',
  bio            TEXT,
  photo          TEXT,
  "dateCreation" TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ─── 3. TABLE MISSIONS ──────────────────────────────────────

CREATE TABLE missions (
  id             SERIAL PRIMARY KEY,
  titre          TEXT             NOT NULL,
  description    TEXT             NOT NULL,
  domaine        TEXT             NOT NULL,
  budget         DOUBLE PRECISION NOT NULL,
  lieu           TEXT             NOT NULL,
  "dateMission"  TIMESTAMPTZ      NOT NULL,
  statut         "StatutMission"  NOT NULL DEFAULT 'OUVERTE',
  "clientId"     INTEGER          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt"    TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ─── 4. TABLE CANDIDATURES ──────────────────────────────────

CREATE TABLE candidatures (
  id                 SERIAL PRIMARY KEY,
  "missionId"        INTEGER              NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  "prestataireId"    INTEGER              NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  message            TEXT                 NOT NULL,
  "propositionPrix"  DOUBLE PRECISION     NOT NULL,
  statut             "StatutCandidature"  NOT NULL DEFAULT 'EN_ATTENTE',
  "createdAt"        TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  UNIQUE ("missionId", "prestataireId")
);

-- ─── 5. TABLE EVALUATIONS ───────────────────────────────────

CREATE TABLE evaluations (
  id           SERIAL PRIMARY KEY,
  "missionId"  INTEGER     NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  note         INTEGER     NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire  TEXT,
  "auteurId"   INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 6. TABLE MESSAGES ──────────────────────────────────────

CREATE TABLE messages (
  id              SERIAL PRIMARY KEY,
  "missionId"     INTEGER     NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  "expediteurId"  INTEGER     NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  contenu         TEXT        NOT NULL,
  date            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 7. INDEX (performances) ────────────────────────────────

CREATE INDEX idx_missions_client     ON missions("clientId");
CREATE INDEX idx_missions_statut     ON missions(statut);
CREATE INDEX idx_candidatures_mission    ON candidatures("missionId");
CREATE INDEX idx_candidatures_prestataire ON candidatures("prestataireId");
CREATE INDEX idx_evaluations_mission ON evaluations("missionId");
CREATE INDEX idx_messages_mission    ON messages("missionId");

-- ─── 8. TRIGGER updatedAt automatique ───────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER missions_updated_at
  BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER candidatures_updated_at
  BEFORE UPDATE ON candidatures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── 9. COMPTE ADMIN DE DÉMONSTRATION ───────────────────────
--  Email    : admin@samajob.sn
--  Mot de passe : Admin1234

INSERT INTO users (nom, email, "motDePasse", role, statut)
VALUES (
  'Admin SamaJob',
  'admin@samajob.sn',
  '$2b$12$HwT8OowHFJg1HfyFzMYkL.d7s5pUKULwi9bsxJ706kBZcgwkCasdi',
  'ADMIN',
  'VALIDE'
);

-- ─── 10. DONNÉES DE TEST (optionnel) ────────────────────────
--  Décommente ce bloc si tu veux des données d'exemple

/*
-- Client test (mot de passe : Test1234)
INSERT INTO users (nom, email, "motDePasse", role, statut)
VALUES ('Fatou Diallo', 'fatou@test.sn',
  '$2b$12$HwT8OowHFJg1HfyFzMYkL.d7s5pUKULwi9bsxJ706kBZcgwkCasdi',
  'CLIENT', 'VALIDE');

-- Prestataire test (mot de passe : Test1234)
INSERT INTO users (nom, email, "motDePasse", role, statut, domaine, competences)
VALUES ('Moussa Ndiaye', 'moussa@test.sn',
  '$2b$12$HwT8OowHFJg1HfyFzMYkL.d7s5pUKULwi9bsxJ706kBZcgwkCasdi',
  'PRESTATAIRE', 'VALIDE', 'Informatique', ARRAY['React', 'Node.js']);

-- Mission test
INSERT INTO missions (titre, description, domaine, budget, lieu, "dateMission", "clientId")
VALUES ('Développement site web', 'Créer un site vitrine responsive',
  'Informatique', 150000, 'Dakar', NOW() + INTERVAL '30 days', 2);
*/

-- ============================================================
--  FIN DU SCRIPT
-- ============================================================
