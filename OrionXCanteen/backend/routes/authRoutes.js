import express from 'express';
import {registerCus, registerEmp, login, refresh, checkEmail, forgotPassword, validateOtp, updateUserPassword } from '../controllers/authController.js';
const router = express.Router();

router.post('/register-employees', registerEmp);
router.put('/register-customers', registerCus);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/check-email', checkEmail);
router.post('/forgot-password', forgotPassword);
router.post('/validate-otp', validateOtp);
router.put('/update-password', updateUserPassword);



export default router;
