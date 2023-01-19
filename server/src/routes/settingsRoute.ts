import express from 'express';
import { deleteAccount } from '../controllers/settingsController.js';

const router = express.Router();

router.route('/delete-account').delete(deleteAccount);

export default router;
