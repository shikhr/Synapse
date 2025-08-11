import express from 'express';
import {
  getComment,
  addComment,
  removeComment,
  getCommentList,
  likeComment,
  getUserComments,
} from '../controllers/commentController.js';

const router: express.Router = express.Router();

router.route('/post/:postId').get(getCommentList).post(addComment);
router.route('/:commentId').get(getComment).delete(removeComment);
router.route('/user/:userId').get(getUserComments);
router.route('/like').put(likeComment);

export default router;
