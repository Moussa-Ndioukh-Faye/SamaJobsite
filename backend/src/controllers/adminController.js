const prisma = require('../db');

/**
 * GET /api/admin/users
 * Lister tous les utilisateurs
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, statut } = req.query;

    const users = await prisma.user.findMany({
      where: {
        ...(role   && { role }),
        ...(statut && { statut }),
      },
      select: {
        id: true, nom: true, email: true, role: true, statut: true,
        telephone: true, domaine: true, dateCreation: true,
        _count: {
          select: {
            missionsClient: true,
            candidatures: true,
          },
        },
      },
      orderBy: { dateCreation: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/prestataires/en-attente
 * Prestataires en attente de validation
 */
const getPrestatairesEnAttente = async (req, res, next) => {
  try {
    const prestataires = await prisma.user.findMany({
      where: { role: 'PRESTATAIRE', statut: 'EN_ATTENTE' },
      select: {
        id: true, nom: true, email: true, telephone: true,
        domaine: true, competences: true, bio: true, dateCreation: true,
      },
      orderBy: { dateCreation: 'asc' },
    });

    res.json({ prestataires });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/users/:id/statut
 * Valider, rejeter ou suspendre un compte
 */
const updateUserStatut = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { statut } = req.body;

    const validStatuts = ['VALIDE', 'REJETE', 'SUSPENDU', 'EN_ATTENTE'];
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Un admin ne peut pas se suspendre lui-même
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas modifier votre propre statut' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { statut },
      select: { id: true, nom: true, email: true, role: true, statut: true },
    });

    res.json({ message: `Compte ${statut.toLowerCase()}`, user: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/stats
 * Statistiques globales de la plateforme
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalClients,
      totalPrestataires,
      prestataireEnAttente,
      totalMissions,
      missionsOuvertes,
      totalCandidatures,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'PRESTATAIRE', statut: 'VALIDE' } }),
      prisma.user.count({ where: { role: 'PRESTATAIRE', statut: 'EN_ATTENTE' } }),
      prisma.mission.count(),
      prisma.mission.count({ where: { statut: 'OUVERTE' } }),
      prisma.candidature.count(),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalClients,
        totalPrestataires,
        prestataireEnAttente,
        totalMissions,
        missionsOuvertes,
        totalCandidatures,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/missions
 * Toutes les missions (admin)
 */
const getAllMissions = async (req, res, next) => {
  try {
    const missions = await prisma.mission.findMany({
      include: {
        client: { select: { id: true, nom: true } },
        _count: { select: { candidatures: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ missions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getPrestatairesEnAttente,
  updateUserStatut,
  getStats,
  getAllMissions,
};
