import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../http/app';

const request = supertest(app);

describe('/users/confirm', () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(false);
  });

  test('Operation should succeed if token is valid', (done) => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9ndW5uaXlpdHVubWlzZUBnbWFpbC5jb20iLCJhY3Rpb24iOiJjb25maXJtYXRpb24iLCJpYXQiOjE1Njk4MzU0NDh9.WFhIPCwEaBjnIaxPMFwthYezl7X3MqhQYcPfcYD8Lhw';
    request
      .get(`/api/users/confirm?regToken=${validToken}`)
      .end((err, res) => {
        expect(res.status).toBe(302);
        expect(res.header.location).toMatch(/\/login/);
        done();
      });
  });

  test('Operation should fail if regToken is not provied', (done) => {
    request
      .get('/api/users/confirm?regToken=')
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Invalid request');
        expect(res.body.errors.regToken[0]).toEqual('regToken is a required query parameter');
        expect(res.body.success).toEqual(false);
        done();
      });
  });

  test('Operation should fail if regToken is not valid', (done) => {
    request
      .get('/api/users/confirm?regToken=someRandomToken')
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Registeration token not valid');
        expect(res.body.success).toEqual(false);
        done();
      });
  });
});
