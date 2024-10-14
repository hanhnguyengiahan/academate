import express from 'express';
import {
  createCard,
  deleteCard,
  readCard,
  updateCard,
} from '../controllers/matching_card.controller';

const router = express.Router();

router.post('/', createCard);
router.post('/read', readCard);
router.put('/', updateCard);
router.post('/delete', deleteCard);

export default router;
