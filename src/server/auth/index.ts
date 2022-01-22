import { RequestHandler } from 'express';
import { UsersModel } from '../../data/users';
import { AuthErr } from '../../errors';
import { UserFromJwt, Role } from '../../types';

const _isAdmin = (currentUser: UserFromJwt | undefined) =>
  currentUser?.role === Role.Admin;

export const isAdminAuth: RequestHandler = async (req, _res, next) => {
  if (!req.user) return next(new AuthErr('User is not logged in.'));
  if (_isAdmin(req.user)) {
    return next();
  } else {
    return next(new AuthErr(`User is '${req.user.role}', not admin`));
  }
};

const _isSupervisorOf = async (
  currentUser: UserFromJwt,
  employeeId: string
) => {
  if (currentUser.role !== Role.Supervisor) return false;
  const employee = await UsersModel.findById(employeeId);
  return currentUser.id === employee?.managerId?.toString();
};

const _isAuthorizedToGetUser = async (
  currentUser: UserFromJwt,
  employeeId: string
): Promise<boolean> => {
  // is current user
  if (currentUser.id === employeeId) return true;

  // is admin
  if (_isAdmin(currentUser)) return true;

  // is supervisor
  return _isSupervisorOf(currentUser, employeeId);
};

export const canGetOrUpdateUserAuth: RequestHandler = async (
  req,
  _res,
  next
) => {
  const { id } = req.params;
  const user = req.user as UserFromJwt;
  const isAuthorized: boolean = await _isAuthorizedToGetUser(user, id);
  if (isAuthorized) return next();
  return next(
    new AuthErr(
      `User with role: ${user.role} and id ${user.id} does not have permission to read/update id ${id}`
    )
  );
};
