import { Strategy } from 'passport-local';
import { UsersModel } from '../data/users';
import * as bcrypt from 'bcrypt';
import * as ResponseErrors from '../errors';
import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { config } from '../config';
import { Role, UserFromJwt } from '../types';

export type RegisterUserResponse = {
  userName: string;
  id: string;
  managerId: string;
  role: Role;
};
const registerRegistrationStrategy = (passport: PassportStatic) => {
  passport.use(
    'register',
    new Strategy(
      {
        usernameField: 'user',
        passwordField: 'password',
      },
      async (userName: string, password: string, done) => {
        const createSuccess = (json: RegisterUserResponse) => done(null, json);
        const createError = (json: any) => done(json, false);

        // if production, default to employee. Otherwise, allow user to register an account with a given role via the username.
        // e.g, a user with the name AdminSeth will have a role of "admin"
        const role = config.isProduction
          ? Role.Employee
          : new RegExp(Role.Admin, 'i').test(userName)
          ? Role.Admin
          : new RegExp(Role.Supervisor, 'i').test(userName)
          ? Role.Supervisor
          : Role.Employee;

        console.log(`Registering user ${userName} with role: ${role}`);

        // for development: get the IDs of all new registrations and assign them a random supervisor
        const allManagers: string[] = (
          await UsersModel.find({
            role: Role.Supervisor,
          }).distinct('_id')
        ).map((id) => id.toString());
        const randomIdx = Math.floor(Math.random() * allManagers.length);
        const randomManagerId = allManagers[randomIdx];

        try {
          const data = {
            userName: userName,
            password: password,
            role,
            managerId: randomManagerId,
          };
          const doc = await UsersModel.create(data);

          createSuccess({
            managerId: data.managerId,
            id: doc.id,
            userName,
            role: role,
          });
        } catch (err) {
          createError(err);
        }
      }
    )
  );
};
const fields = {
  usernameField: 'userName',
  passwordField: 'password',
};
export type UserLoginCtx = {
  id: string;
  role: Role;
};
const registerLoginStrategy = (passport: PassportStatic) => {
  passport.use(
    'login',
    new Strategy(fields, async (userName: string, password: string, done) => {
      const createSuccess = (json: UserLoginCtx) => done(null, json);
      const createError = (json: any) => done(json, false);
      try {
        if (!password || !userName) {
          return createError(
            new ResponseErrors.ValidationErr('missing user and/or password')
          );
        }
        const doc = await UsersModel.findOne({
          userName,
        });
        if (!doc) {
          return createError(
            new ResponseErrors.AuthErr(`No user by name of ${userName} found.`)
          );
        }
        const isValidPassword = await bcrypt.compare(password, doc.password);
        if (isValidPassword === false) {
          return createError(new ResponseErrors.AuthErr('Invalid login.'));
        }
        createSuccess({ id: doc.id, role: doc.role });
      } catch (err) {
        return createError(err);
      }
    })
  );
};

const registerVerifyStrategy = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: config.getPrivateKey(),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (jwt, done) => {
        return done(null, {
          userName: jwt.userName,
          role: jwt.role,
          id: jwt.id,
        } as UserFromJwt);
      }
    )
  );
};

export const registerPassportStrategies = (passport: PassportStatic) =>
  [
    registerLoginStrategy,
    registerRegistrationStrategy,
    registerVerifyStrategy,
  ].forEach((fn) => fn(passport));
