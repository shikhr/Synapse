import express from 'express';
import { search } from '../controllers/searchController.js';

const router: express.Router = express.Router();

router.route('/').get(search);

export default router;
