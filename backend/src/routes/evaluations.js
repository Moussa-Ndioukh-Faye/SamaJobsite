const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize }    = require('../middleware/roleCheck');
const { validate }     = require('../middleware/validate');
const {
  createEvaluation, getEvaluationsByMission, evaluationValidation,
} = require('../controllers/evaluationController');

router.post(
  '/',
  authenticate, authorize('CLIENT'),
  evaluationValidation, validate,
  createEvaluation
);

router.get('/mission/:missionId', getEvaluationsByMission);

module.exports = router;
