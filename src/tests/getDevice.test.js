import supertest from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../http/app';
import db from '../db';

dotenv.config();

const request = supertest(app);
const userDetails = {
  name: 'Test User',
  email: 'temmietayo@test.com',
  password: 'Password1',
  location: {
    country: 'TestCountry',
    state: 'TestState',
    address: 'TestAddress',
  },
  confirmedEmail: true,
  verifiedPurchase: true,
};
const timeout = 90000;

describe('/api/device/', () => {
  let user;
  let device;
  let validToken;

  beforeAll(async () => {
    user = await db.users.createUser({ ...userDetails, email: 'mazikin@test.com' }, 'hospital_admin');
    validToken = jwt.sign({ type: 'hospital_admin', id: user._id }, process.env.JWT_SECRETE, { expiresIn: '3d' });
    device = await db.device.createDevice({
      hospitalId: user._id,
      label: 'something nice',
    });
  }, timeout);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(false);
    app.close();
  });

  test('Geting a single device should fail when a request token is not sent', (done) => {
    request
      .get('/api/device/deviceId')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.success).toEqual(false);
        done();
      });
    request
      .get('/api/device/deviceId')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.success).toEqual(false);
        done();
      });
  }, timeout);

  test('Geting all devices should fail when a request token is not sent', (done) => {
    request
      .get('/api/device')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.success).toEqual(false);
        done();
      });
  }, timeout);

  test('Geting a single device should fail if the request token is invalid', (done) => {
    request
      .get('/api/device/deviceId')
      .set('req-token', 'abc123')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.success).toEqual(false);
        done();
      });

    request
      .get('/api/device')
      .set('req-token', 'abc123')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.success).toEqual(false);
        done();
      });
  }, timeout);

  test('Geting all devices should fail if the request token is invalid', (done) => {
    request
      .get('/api/device')
      .set('req-token', 'abc123')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.success).toEqual(false);
        done();
      });
  }, timeout);

  test('Geting a single device should fail when the deviceId is invalid', (done) => {
    request
      .get('/api/device/devihhdjjfdjceId')
      .set('req-token', validToken)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.success).toEqual(false);
        done();
      });
  }, timeout);

  test('Geting a single device should succeed if the request token and the deviceId is valid', (done) => {
    request
      .get(`/api/device/${device._id}`)
      .set('req-token', validToken)
      .end((err, res) => {
        expect(res.status).toBe(200);
        done();
      });

    request
      .get('/api/device')
      .set('req-token', validToken)
      .end((err, res) => {
        expect(res.status).toBe(200);
        done();
      });
  }, timeout);

  test('Getting all devices should succed if both the user and the device id is valid', (done) => {
    request
      .get('/api/device')
      .set('req-token', validToken)
      .end((err, res) => {
        expect(res.status).toBe(200);
        done();
      });
  }, timeout);
});
