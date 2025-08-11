import express from 'express';
import {
  addRemoveBookmark,
  getBookmarkList,
} from '../controllers/bookmarkController.js';

const router: express.Router = express.Router();

router.route('/').get(getBookmarkList);

router.route('/:postId').post(addRemoveBookmark);

export default router;
