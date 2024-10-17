import { Request, Response } from 'express';
import MatchingCard from '../models/matching_card.model';
import Session from '../models/session.model';
import { JwtPayload, verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const createCard = async (req: Request, res: Response) => {
  try {
    const { token, ...cardInfo } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    const payload = verify(token, SECRET_KEY) as JwtPayload;

    const newCard = await MatchingCard.create({
      ...cardInfo,
      userId: new mongoose.mongo.ObjectId(payload.id as string),
    });

    res.status(200).json({
      ...newCard.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const readCard = async (req: Request, res: Response) => {
  try {
    const { token, _id } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    // use lean() option so it returns a Js Object only, not a Mongoose Document (which contains extra stuff we dont care)
    const card = await MatchingCard.findById(_id).lean();

    if (!card) {
      return res.status(401).json({ message: 'Card does not exist' });
    }

    res.status(200).json({
      ...card,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const readAllCard = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    const payload = verify(token, SECRET_KEY) as JwtPayload;

    // use lean() option so it returns a Js Object only, not a Mongoose Document (which contains extra stuff we dont care)
    const cards = await MatchingCard.find({
      userId: payload.id,
    }).lean();

    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCard = async (req: Request, res: Response) => {
  try {
    const { token, _id, ...newCardInfo } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    // use lean() option so it returns a Js Object only, not a Mongoose Document (which contains extra stuff we dont care)
    const existingCard = await MatchingCard.findByIdAndUpdate(_id, {
      ...newCardInfo,
    }).lean();

    if (!existingCard) {
      return res.status(401).json({ message: 'Card does not exist' });
    }

    const updatedCard = await MatchingCard.findById(_id).lean();

    res.status(200).json({
      ...updatedCard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteCard = async (req: Request, res: Response) => {
  try {
    const { token, _id } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    // use lean() option so it returns a Js Object only, not a Mongoose Document (which contains extra stuff we dont care)
    const existingCard = await MatchingCard.findByIdAndDelete(_id).lean();

    if (!existingCard) {
      return res.status(401).json({ message: 'Card does not exist' });
    }

    res.status(200).json({
      message: 'Card deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createCard, readCard, readAllCard, updateCard, deleteCard };
