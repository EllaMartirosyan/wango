// __tests__/parking.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Wango', () => {
  beforeEach(async () => {
    await User.deleteMany({}); // Clear the database before tests
  });

  it('should register a user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        fullName: 'John Doe',
        address: '123 Main St',
        carPlate: 'XYZ123'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe('test@example.com');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        fullName: 'John Doe',
        address: '123 Main St',
        carPlate: 'XYZ123'
      });

    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        carPlate: 'XYZ123'
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('test@example.com');
  });
});