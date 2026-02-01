import { MongoMemoryServer } from 'mongodb-memory-server';

// This will create an new instance of "MongoMemoryServer" and automatically start it
let mongod;

export async function startMockDB() {
  mongod = await MongoMemoryServer.create();
  return mongod.getUri();
}

export async function stopMockDB() {
  if (mongod) {
    await mongod.stop();
  }
}
