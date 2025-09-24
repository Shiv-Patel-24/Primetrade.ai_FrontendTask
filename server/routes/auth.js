const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getLoggedInUser, updatePassword } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getLoggedInUser);
router.put('/update-password', auth, updatePassword);

module.exports = router;