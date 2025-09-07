import express from 'express';
import { sendIdToEmp } from '../controllers/mailController.js';
const router = express.Router();

//super admins
router.post('/sendEmpId', sendIdToEmp);

//sub admins

//employees

//customers
export default router;