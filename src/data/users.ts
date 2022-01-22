import mongoose, { Schema, Document, NativeError } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ObjectID } from 'bson';
import { Role } from '../types';

export type User = {
  _id: ObjectID;
  userName: string;
  password: string;
  role: Role;
  managerId?: ObjectID;
};

export type UserDocument = Document & User;

const userSchema = new Schema<UserDocument>(
  {
    userName: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'Users', // self reference
    },
    role: {
      type: Schema.Types.String,
      enum: Object.values(Role),
      required: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // if no modification, do nothing
  if (!this.isModified('password')) return next();
  try {
    // generate salt
    const salt = await bcrypt.genSalt(10);

    // the salt is incorporated into the hash (as plaintext), alongside the salted and hashed password.
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    // if error, pass into next
    return next(error as NativeError);
  }
});

export const UsersModel = mongoose.model<UserDocument>('Users', userSchema);
