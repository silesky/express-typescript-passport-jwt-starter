import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

type LoginUserResponseBody = { message: string; token: string; id: string };

export const login: RequestHandler<never, LoginUserResponseBody> = async (
  req,
  res,
  next
) => {
  // after activating the "login strategy", perform additional work to create the jwt
  const user = req.user;
  if (!user) {
    return next(new Error('Invariant: no user found'));
  } else {
    req.logIn(user, { session: false }, async (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign(
        { role: user.role, id: user.id },
        config.getPrivateKey()
      );
      res.json({
        message:
          'Login success! Now you can make calls with this bearer token by including it in your request header.',
        id: user.id,
        token: token,
      });
    });
  }
};
