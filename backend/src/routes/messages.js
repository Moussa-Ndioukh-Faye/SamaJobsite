const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');
const {
  sendMessage, getMessagesByMission, messageValidation,
} = require('../controllers/messageController');

router.post('/', authenticate, messageValidation, validate, sendMessage);
router.get('/mission/:missionId', authenticate, getMessagesByMission);

module.exports = router;
