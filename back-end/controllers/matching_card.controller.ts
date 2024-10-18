import { Request, Response } from 'express';
import MatchingCard from '../models/matching_card.model';
import Session from '../models/session.model';
import { JwtPayload, verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "";
const OPENAI_APIKEY = process.env.OPENAI_APIKEY || "";
const DB_URI = process.env.DB_URI || "";

import { MongoClient, ObjectId } from 'mongodb';
//const client = new MongoClient(DB_URI);

const createCard = async (req: Request, res: Response) => {
  try {
    const { token, ...cardInfo } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = verify(token, SECRET_KEY) as JwtPayload;

    // Check if cardInfo has 'objective' attribute and create vector embedding
    if (cardInfo.objective) {
      cardInfo.objectiveEmbedding = await createVectorEmbedding(cardInfo.objective);
    }

    const newCard = await MatchingCard.create({
      ...cardInfo,
      userId: new mongoose.mongo.ObjectId(payload.id as string),
    });
    
    res.status(200).json({
      ...newCard.toObject(),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Function to create vector embedding using OpenAI API
const createVectorEmbedding = async (objective: string): Promise<number[]> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-small',
        input: objective,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_APIKEY}`,
        },
      }
    );

    const embedding = response.data.data[0].embedding;
    return embedding;
  } catch (error) {
    throw new Error('Failed to generate embedding!');
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
    res.status(500).json({ message: (error as Error).message });
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
    res.status(500).json({ message: (error as Error).message });
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
    res.status(500).json({ message: (error as Error).message });
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
    res.status(500).json({ message: (error as Error).message });
  }
};

const matchingCards = async (req: Request, res: Response) => {
  try {
    const { token, _id } = req.body;

    const validSession = await Session.findOne({ token });
    if (!validSession) {
      return res.status(401).json({ message: 'Invalid credentatials' });
    }

    // use lean() option so it returns a Js Object only, not a Mongoose Document (which contains extra stuff we dont care)
    const existingCard = await MatchingCard.findById(_id).lean();

    if (!existingCard) {
      return res.status(401).json({ message: 'Card does not exist' });
    }

    //await client.connect();

    //const db = client.db('test');

    // Generate vector embedding for the objective
    const queryEmbed = existingCard.objectiveEmbedding;

    //const collection = db.collection('matchingcards'); // Ensure this is the correct collection

    // MongoDB vector search pipeline
    const searchPipeline = [
      {
        $vectorSearch: {
          queryVector: queryEmbed,
          path: 'objectiveEmbedding',
          numCandidates: 100,
          limit: 10, // Limit to top 5 similar results
          index: 'vector_index',
        },
      },
      {
        $project: {
          _id: 1,
          course_code: 1,
          grade: 1,
          objective: 1,
          similarity: { $meta: 'searchScore' }, // Get the similarity score
        },
      },
    ];

    // Execute the aggregation pipeline
    //const results = await collection.aggregate(searchPipeline).toArray();

    res.status(200).json({
      message: 'Card deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export { createCard, readCard, readAllCard, updateCard, deleteCard, matchingCards };
