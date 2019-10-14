import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../http/app';

const request = supertest(app);

const confirmEmailEndpoint = '/api/hospital/confirmEmail';

describe(confirmEmailEndpoint, () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(false);
  });

  test('Operation should succeed if token is valid', (done) => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJ1c2VyVHlwZSI6Imhvc3BpdGFsX2FkbWluIiwiaWF0IjoxNTcwMTgyNjk4fQ.Df7sc7J_1vJozqO5UEFU6O_P6BdJ1xzhv-NbuoP-pWk';
    request
      .get(`${confirmEmailEndpoint}?regToken=${validToken}`)
      .end((err, res) => {
        expect(res.status).toBe(302);
        expect(res.header.location).toMatch(/\/login/);
        done();
      });
  });

  test('Operation should fail if regToken is not provied', (done) => {
    request
      .get(`${confirmEmailEndpoint}?regToken=`)
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
      .get(`${confirmEmailEndpoint}?regToken=someRandomToken`)
      .end((err, res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toEqual('Registeration token not valid');
        expect(res.body.success).toEqual(false);
        done();
      });
  });
});
