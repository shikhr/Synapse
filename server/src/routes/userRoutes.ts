import express from 'express';
import multer, { memoryStorage } from 'multer';
import {
  deleteAvatar,
  followUser,
  getFollowers,
  getFollowing,
  getFollowSuggestions,
  getProfile,
  postAvatar,
  unfollowUser,
  updateProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/follow/:followId').put(followUser);

router.route('/unfollow/:unfollowId').put(unfollowUser);

router.route('/followsuggest').get(getFollowSuggestions);

router.route('/followers/:id').get(getFollowers);
router.route('/following/:id').get(getFollowing);

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!/^image\/(jpe?g|png)$/.test(file.mimetype)) {
      return callback(new Error('Not an image file'));
    }
    callback(null, true);
  },
  storage: memoryStorage(),
});

router.route('/profile/:id').get(getProfile);
router.route('/profile').patch(upload.single('avatar'), updateProfile);

router
  .route('/avatar')
  .post(upload.single('avatar'), postAvatar)
  .delete(deleteAvatar);

export default router;
