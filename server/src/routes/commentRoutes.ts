import express from 'express';
import {
  getComment,
  postComment,
  removeComment,
  getCommentList,
  likeComment,
  getUserComments,
} from '../controllers/commentController.js';

const router = express.Router();

router.route('/post/:postId').get(getCommentList).post(postComment);
router.route('/:commentId').get(getComment).delete(removeComment);
router.route('/user/:userId').get(getUserComments);
router.route('/like').put(likeComment);

export default router;
