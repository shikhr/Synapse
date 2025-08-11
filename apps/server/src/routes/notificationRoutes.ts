import { Router } from 'express';
import { getNotifications } from '../controllers/notificationController.js';

const router: Router = Router();

// GET /api/v1/notifications
router.get('/', getNotifications);

export default router;
