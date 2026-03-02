const router = require('express').Router();
const prisma = require('../db');
const { authenticate }              = require('../middleware/auth');
const { authorize, requireValidated } = require('../middleware/roleCheck');
const { validate }                  = require('../middleware/validate');
const {
  getMissions, getMissionById, createMission,
  updateMission, deleteMission, getMesMissions,
  missionValidation,
} = require('../controllers/missionController');

// Public
router.get('/',    getMissions);
router.get('/mes-missions', authenticate, authorize('CLIENT'), getMesMissions);
router.get('/:id', getMissionById);

// Protégées
router.post(
  '/',
  authenticate, authorize('CLIENT'),
  missionValidation, validate,
  createMission
);
router.put('/:id',    authenticate, updateMission);
router.delete('/:id', authenticate, deleteMission);

// Valider la fin d'une mission (CLIENT)
router.patch('/:id/terminer', authenticate, authorize('CLIENT'), async (req, res, next) => {
  try {
    const missionId = parseInt(req.params.id);

    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) return res.status(404).json({ message: 'Mission introuvable' });
    if (mission.clientId !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });
    if (mission.statut !== 'ATTRIBUEE') {
      return res.status(400).json({ message: 'La mission doit être attribuée pour être terminée' });
    }

    const updated = await prisma.mission.update({
      where: { id: missionId },
      data: { statut: 'TERMINEE' },
    });

    res.json({ message: 'Mission marquée comme terminée', mission: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
