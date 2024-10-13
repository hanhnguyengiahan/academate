import express from 'express';
import { createCard } from '../controllers/matching_card.controller';

const router = express.Router();

router.post('/', createCard);
// router.get('/', login);
// router.put('/', logout);
// router.delete('/', logout);

export default router;
