import { Request, Response } from 'express';
import MatchingCard from '../models/matching_card.model';
import AuthHelper from './helpers/auth.helper';
import Session from '../models/session.model';

const createCard = async (req: Request, res: Response) => {
  try {
    const { token, ...cardInfo } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    const newCard = await MatchingCard.create({
      ...cardInfo,
    });

    res.status(200).json({
      ...cardInfo,
      match_card_id: newCard._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const readCard = (req: Request, res: Response) => {};
// const updateCard = (req: Request, res: Response) => {};
// const deleteCard = (req: Request, res: Response) => {};

export { createCard };
