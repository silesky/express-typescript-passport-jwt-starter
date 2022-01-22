import { RequestHandler } from 'express';

export const registerNewUser: RequestHandler = async (req, res) => {
  res.status(201).json(req.user);
};
