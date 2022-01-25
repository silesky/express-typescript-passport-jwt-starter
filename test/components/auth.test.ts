import { createServer } from '../../src/server/create-server';
import getPort from 'get-port';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UsersModel } from '../../src/data/users';
import { Role } from '../../src/types';

let server: any;
beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const randomPort = await getPort();
  server = await createServer(randomPort, mongoServer.getUri());
});
afterAll(async () => {
  await server.close();
});
describe('auth', () => {
  it('test placeholder', async () => {
    await UsersModel.insertMany([
      {
        userName: 'Supervisor',
        password:
          '$2b$10$uhYidywWhKFntgXIf6m50.iLUbcOAnjptCTQ5WHKzPzrG25vESxsm',
        managerId: undefined,
        role: Role.Supervisor,
      },
      {
        userName: 'Admin',
        password:
          '$2b$10$1Sr7aoM4k2tQ.EmlhQFem.03Rh2lNCW.jB/V6E6i6BjS85iveVHv6',
        role: Role.Admin,
      },
      {
        userName: 'Employee',
        password:
          '$2b$10$NckgAVhHnFMf/JO2SlcfN.czOs6Qy7j1k9/KsjzlM33vsA1wHhFbu',
        role: Role.Employee,
      },
    ]);

    // this is a placeholder for some actual tests
    expect(true).toBe(true);
  });
});
