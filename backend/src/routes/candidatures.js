const router = require('express').Router();
const { authenticate }               = require('../middleware/auth');
const { authorize, requireValidated } = require('../middleware/roleCheck');
const { validate }                   = require('../middleware/validate');
const {
  createCandidature, getMesCandidatures,
  getCandidaturesByMission, updateStatutCandidature,
  candidatureValidation,
} = require('../controllers/candidatureController');

router.post(
  '/',
  authenticate, authorize('PRESTATAIRE'), requireValidated,
  candidatureValidation, validate,
  createCandidature
);

router.get('/mes-candidatures', authenticate, authorize('PRESTATAIRE'), getMesCandidatures);
router.get('/mission/:missionId', authenticate, getCandidaturesByMission);
router.patch('/:id/statut', authenticate, authorize('CLIENT'), updateStatutCandidature);

module.exports = router;
