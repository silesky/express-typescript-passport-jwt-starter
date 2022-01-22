import express from 'express';
import * as controllers from '../controllers';
import passport from 'passport';
import * as authMw from './auth';

export const registerRoutes = (app: express.Application) => {
  const jwt = passport.authenticate('jwt', { session: false });
  // register new user
  app.post(
    '/auth/register',
    passport.authenticate('register', { session: false }),
    controllers.registerNewUser
  );

  // login
  app.post(
    '/auth/login',
    passport.authenticate('login', { session: false }),
    controllers.login
  );

  /**
   *  I know you can apply middleware to nested routes, etc,
   *  to make this more DRY, but this is straightforward for the purposes this exercise.
   */

  // get user
  app.get('/user/:id', jwt, authMw.canGetOrUpdateUserAuth, controllers.getUser);

  // update user
  app.patch(
    '/user/:id',
    jwt,
    authMw.canGetOrUpdateUserAuth,
    controllers.updateUser
  );

  // delete user
  app.delete('/user/:id', jwt, authMw.isAdminAuth, controllers.deleteUser);

  return app;
};
