import { RequestHandler } from 'express';
import { UserDocument, UsersModel } from '../data/users';
import { NotFoundErr } from '../errors';

type Params = {
  id: string;
};

type GetUserResponseBody = {
  id: string;
} & Pick<UserDocument, 'role' | 'userName'>;
export const getUser: RequestHandler<Params, GetUserResponseBody> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;

  try {
    const userDoc = await UsersModel.findById(id).lean();
    if (!userDoc) {
      return next(new NotFoundErr('Cannot find user'));
    }
    return res.json({
      id: userDoc.id,
      role: userDoc.role,
      userName: userDoc.userName,
    });
  } catch (err) {
    next(err);
  }
};

type DeleteUserResponseBody = {
  message: string;
};
export const deleteUser: RequestHandler<
  Params,
  DeleteUserResponseBody
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { deletedCount } = await UsersModel.deleteOne({ _id: id }).lean();
    if (deletedCount) {
      return res.json({ message: `User with ${id} deleted.` });
    } else {
      throw new NotFoundErr('Failed to delete. User not found');
    }
  } catch (err) {
    next(err);
  }
};

type UpdateUserRequestBody = Pick<UserDocument, 'userName' | 'role'>;
type UpdateUserResponseBody = {
  message: string;
};
export const updateUser: RequestHandler<
  Params,
  UpdateUserResponseBody,
  UpdateUserRequestBody
> = async (req, res, next) => {
  const { id } = req.params;
  const { userName, role } = req.body;
  try {
    const userDoc = await UsersModel.findByIdAndUpdate(id, {
      $set: { userName, role },
    }).lean();
    if (!userDoc) {
      throw new NotFoundErr('Failed to update. User not found');
    }
    return res.json({
      message: `User with id ${id} updated.`,
    });
  } catch (err) {
    next(err);
  }
};
