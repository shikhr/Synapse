import express from 'express';
import multer from 'multer';
import {
  addPost,
  deletePost,
  getExplore,
  getFeed,
  getPost,
  getUserPosts,
  likePost,
} from '../controllers/postController.js';

const router = express.Router();

const upload = multer();

router.route('/').post(upload.array('media'), addPost);

router.route('/feed').get(getFeed);
router.route('/explore').get(getExplore);
router.route('/user/:userId').get(getUserPosts);
router.route('/:postId').get(getPost).delete(deletePost);

router.route('/like').put(likePost);

export default router;
