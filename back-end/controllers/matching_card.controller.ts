import { Request, Response } from 'express';
import MatchingCard from '../models/matching_card.model';
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
      newCard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const readCard = async (req: Request, res: Response) => {
  try {
    const { token, match_card_id } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    // use lean() option so it returns a Js Object only, not a Mongoose Document (which contains extra stuff we dont care)
    const { _id, ...other } = await MatchingCard.findOne({
      match_card_id,
    }).lean();

    res.status(200).json({
      match_card_id: _id,
      ...other,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCard = async (req: Request, res: Response) => {
  try {
    const { token, match_card_id, ...newCardInfo } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    // use lean() option so it returns a Js Object only, not a Mongoose Document (which contains extra stuff we dont care)
    await MatchingCard.findByIdAndUpdate(match_card_id, {
      ...newCardInfo,
    }).lean();

    const { _id, ...other } = await MatchingCard.findById(match_card_id).lean();

    res.status(200).json({
      match_card_id: _id,
      ...other,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const deleteCard = (req: Request, res: Response) => {};

export { createCard, readCard, updateCard };
