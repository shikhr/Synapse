import express from 'express';
import { followUser, unfollowUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/follow/:followId').put(followUser);

router.route('/unfollow/:unfollowId').put(unfollowUser);

export default router;
