import { mongooseConnect } from '../connections/mongoose';
import { User } from '../../data/users';
import mongoose from 'mongoose';
import { config } from '../../config';
import { ObjectID } from 'bson';
import { Role } from '../../types';
const connect = mongooseConnect(config.mongoDbConnectionString);

const data: User[] = [
  {
    _id: new ObjectID('61ef1a7eef3a61bd3a51602e'),
    userName: 'Supervisor',
    password: '$2b$10$uhYidywWhKFntgXIf6m50.iLUbcOAnjptCTQ5WHKzPzrG25vESxsm',
    managerId: undefined,
    role: Role.Supervisor,
  },
  {
    _id: new ObjectID('61ef1cec302469b6a2732da4'),
    userName: 'Admin',
    password: '$2b$10$1Sr7aoM4k2tQ.EmlhQFem.03Rh2lNCW.jB/V6E6i6BjS85iveVHv6',
    managerId: new ObjectID('61ef1a7eef3a61bd3a51602e'),
    role: Role.Admin,
  },
  {
    _id: new ObjectID('61ef1fc2f4ae6a336eee0817'),
    userName: 'Employee',
    password: '$2b$10$NckgAVhHnFMf/JO2SlcfN.czOs6Qy7j1k9/KsjzlM33vsA1wHhFbu',
    managerId: new ObjectID('61ef1a7eef3a61bd3a51602e'),
    role: Role.Employee,
  },
];

if (config.isProduction) {
  console.log('Skipped seeding.');
} else {
  connect.then(async () => {
    try {
      console.log('dropping db...');
      await mongoose.connection.db.dropCollection('users');
      console.log('creating collection....');
      await mongoose.connection.db.createCollection('users');
      console.log('inserting seed data...');
      await mongoose.connection.db.collection('users').insertMany(data);
      console.log('\n Data successfully seeded.');
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
