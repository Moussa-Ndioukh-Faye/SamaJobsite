const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');
const {
  getPrestataires, getUserById,
  updateProfile, changePassword, updateProfileValidation,
} = require('../controllers/userController');

router.get('/prestataires',  getPrestataires);
router.get('/:id',           getUserById);
router.put('/profil',        authenticate, updateProfileValidation, validate, updateProfile);
router.put('/mot-de-passe',  authenticate, changePassword);

module.exports = router;
