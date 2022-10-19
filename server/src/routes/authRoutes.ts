import express from 'express';
import { signin, signup, refresh } from '../controllers/authController.js';

const router = express.Router();

router.route('/signin').post(signin);

router.route('/signup').post(signup);

router.route('/refresh').get(refresh);

export default router;
