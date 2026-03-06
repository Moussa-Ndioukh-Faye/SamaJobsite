const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');
const {
  register, login, getMe, verifyEmail, resendVerification,
  registerValidation, loginValidation,
} = require('../controllers/authController');

router.post('/register',           registerValidation, validate, register);
router.post('/login',              loginValidation,    validate, login);
router.get('/me',                  authenticate,               getMe);
router.get('/verify-email',                                    verifyEmail);
router.post('/resend-verification', authenticate,              resendVerification);

module.exports = router;
