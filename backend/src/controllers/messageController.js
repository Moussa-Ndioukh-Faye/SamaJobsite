const prisma = require('../db');
const { body } = require('express-validator');

const messageValidation = [
  body('missionId').isInt({ min: 1 }).withMessage('ID de mission invalide'),
  body('contenu').trim().notEmpty().withMessage('Le message ne peut pas être vide'),
];

/**
 * POST /api/messages
 * Envoyer un message lié à une mission
 */
const sendMessage = async (req, res, next) => {
  try {
    const { missionId, contenu } = req.body;

    const mission = await prisma.mission.findUnique({ where: { id: parseInt(missionId) } });
    if (!mission) return res.status(404).json({ message: 'Mission introuvable' });

    // Seuls le client propriétaire et le prestataire assigné peuvent envoyer des messages
    if (req.user.role !== 'ADMIN' && mission.clientId !== req.user.id) {
      const candidatureAcceptee = await prisma.candidature.findFirst({
        where: { missionId: parseInt(missionId), prestataireId: req.user.id, statut: 'ACCEPTEE' },
      });
      if (!candidatureAcceptee) {
        return res.status(403).json({ message: 'Accès refusé : vous n\'êtes pas autorisé à envoyer des messages sur cette mission' });
      }
    }

    const message = await prisma.message.create({
      data: {
        missionId: parseInt(missionId),
        expediteurId: req.user.id,
        contenu,
      },
      include: {
        expediteur: { select: { id: true, nom: true, photo: true } },
      },
    });

    res.status(201).json({ message: 'Message envoyé', data: message });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/messages/mission/:missionId
 * Messages d'une mission
 */
const getMessagesByMission = async (req, res, next) => {
  try {
    const missionId = parseInt(req.params.missionId);

    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) return res.status(404).json({ message: 'Mission introuvable' });

    // Seuls le client et le prestataire assigné peuvent voir les messages
    const candidatureAcceptee = await prisma.candidature.findFirst({
      where: { missionId, statut: 'ACCEPTEE', prestataireId: req.user.id },
    });

    if (mission.clientId !== req.user.id && !candidatureAcceptee && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const messages = await prisma.message.findMany({
      where: { missionId },
      include: {
        expediteur: { select: { id: true, nom: true, photo: true } },
      },
      orderBy: { date: 'asc' },
    });

    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessagesByMission, messageValidation };
