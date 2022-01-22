// common types

export enum Role {
  Admin = 'admin', // can create, view, update, delete all users
  Supervisor = 'supervisor', // can view and update users who report to them
  Employee = 'employee', // can view and update their own info
}

export interface UserFromJwt {
  userName: string;
  role: Role;
  id: string;
}
