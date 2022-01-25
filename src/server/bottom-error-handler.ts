import { Error as MongooseError } from 'mongoose';
import express from 'express';
import * as ResponseError from '../errors';

export const registerBottomErrorHandler = (app: express.Application) => {
  const handler: express.ErrorRequestHandler = (err, _req, res, next) => {
    if (
      err instanceof ResponseError.ValidationErr ||
      err instanceof MongooseError.ValidationError
    ) {
      res.status(400).json({ message: err.message });
    } else if (err instanceof MongooseError.CastError) {
      res.status(400).json({ message: `${err.stringValue} is malformed.` });
    } else if (err instanceof ResponseError.AuthErr) {
      res.status(401).json({ message: err.message });
    } else if (
      err instanceof ResponseError.NotFoundErr ||
      err instanceof MongooseError.DocumentNotFoundError
    ) {
      res.status(404).json({ message: err.message });
    } else if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'an unknown error occurred' });
    }
    return next();
  };
  return app.use(handler);
};
