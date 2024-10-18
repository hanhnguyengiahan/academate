import express from 'express';
import {
  createCard,
  deleteCard,
  readAllCard,
  readCard,
  updateCard,
  matchingCards
} from '../controllers/matching_card.controller';

const router = express.Router();

router.post('/', createCard);
router.post('/read', readCard);
router.post('/read_all', readAllCard);
router.put('/', updateCard);
router.post('/delete', deleteCard);

router.post('/matching', matchingCards);

export default router;
