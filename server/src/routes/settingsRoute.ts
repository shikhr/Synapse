import express from 'express';
import {
  changePassword,
  deleteAccount,
} from '../controllers/settingsController.js';

const router = express.Router();

router.route('/delete-account').delete(deleteAccount);

router.route('/change-password').patch(changePassword);

export default router;
