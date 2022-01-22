import { UserFromJwt } from '../src/types';

declare global {
  namespace Express {
    interface User extends UserFromJwt {}
  }
}
