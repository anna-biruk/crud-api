import app from '../index';
import supertest from 'supertest';
import { dataSource } from '../db';
import { User } from '../entity/User';

let server;

beforeAll(async () => {
  await dataSource.initialize();
  server = app.listen(3001);
  console.log('Server started');
});

afterAll(async () => {
  await server.close();
  console.log('Server closed');
});

describe('API Tests', () => {
  let userId: string;
  it('should get all users', async () => {
    const response = await supertest(app).get('/api/users');
    const expectedResult = await dataSource.getRepository(User).find();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResult);
  });

  it('should create a new user', async () => {
    const newUser = {
      username: 'testUser',
      age: 25,
      hobbies: ['reading', 'coding'],
    };

    const response = await supertest(server).post('/api/users').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    userId = response.body.id;
  });

  it('should get a user by ID', async () => {
    const response = await supertest(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
  });

  it('should update a user by ID', async () => {
    const updatedUser = {
      username: 'updatedUser',
      age: 30,
      hobbies: ['traveling', 'photography'],
    };

    const response = await supertest(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.username).toBe(updatedUser.username);
  });
  it('should delete user by id', async () => {
    const response = await supertest(server)
      .delete('/api/users/' + userId)
      .send();
    expect(response.status).toBe(204);
  });
});
