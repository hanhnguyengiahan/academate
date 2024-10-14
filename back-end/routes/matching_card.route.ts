import express from 'express';
import {
  createCard,
  readCard,
  updateCard,
} from '../controllers/matching_card.controller';

const router = express.Router();

router.post('/', createCard);
router.get('/', readCard);
router.put('/', updateCard);
// router.delete('/', logout);

export default router;
