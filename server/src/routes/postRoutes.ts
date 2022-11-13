import express from 'express';
import multer from 'multer';
import {
  addPost,
  getFeed,
  getPost,
  likePost,
} from '../controllers/postController.js';

const router = express.Router();

const upload = multer();

router.route('/').post(upload.array('media'), addPost);

router.route('/feed').get(getFeed);
router.route('/:postId').get(getPost);

router.route('/like').put(likePost);

export default router;
