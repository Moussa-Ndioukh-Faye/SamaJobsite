const router = require('express').Router();
const prisma = require('../db');
const { authenticate } = require('../middleware/auth');
const { authorize }    = require('../middleware/roleCheck');
const {
  getAllUsers, getPrestatairesEnAttente,
  updateUserStatut, getStats, getAllMissions,
} = require('../controllers/adminController');

// Toutes les routes admin nécessitent authentification + rôle ADMIN
router.use(authenticate, authorize('ADMIN'));

router.get('/stats',                   getStats);
router.get('/users',                   getAllUsers);
router.get('/missions',                getAllMissions);
router.get('/prestataires/en-attente', getPrestatairesEnAttente);
router.patch('/users/:id/statut',      updateUserStatut);

// Modérer une mission (supprimer ou changer statut)
router.delete('/missions/:id', async (req, res, next) => {
  try {
    await prisma.mission.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Mission supprimée par l\'administrateur' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
