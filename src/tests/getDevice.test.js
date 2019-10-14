import supertest from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../http/app';
import db from '../db';

dotenv.config();

const request = supertest(app);

const timeout = 50000000;
const userDetails = {
  name: 'Test User',
  email: 'tested@test.com',
  password: 'Password1',
  confirmPassword: 'Password1',
  deviceCount: 0,
  confirmed: true,
  location: {
    country: 'TestCountry',
    state: 'TestState',
    address: 'TestAddress',
  },
  confirmedEmail: true,
  verifiedPurchase: true,
};
const userDetails2 = {
  name: 'Test Admin User',
  email: 'anothertest@test.com',
  password: 'Password1',
  confirmPassword: 'Password1',
  deviceCount: 0,
  confirmed: true,
  location: {
    country: 'TestCountry',
    state: 'TestState',
    address: 'TestAddress',
  },
  confirmedEmail: true,
  verifiedPurchase: true,
};

describe('/api/device/devieid', () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(false);
    app.close();
  });

  test('Geting device should fail since token is not sent', async (done) => {
    request
      .get('/api/device/deviceId')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.success).toEqual(false);
        done();
      });
  }, timeout);

  test('Geting device should fail due to invalid token', async (done) => {
    request
      .get('/api/device/deviceId')
      .set('req-token', 'abc123')
      .end((err, res) => {
        expect(res.status).toBe(401);
        expect(res.body.success).toEqual(false);
        done();
      });
  }, timeout);

  test('Geting device should fail because the device id is invalid', async (done) => {
    const user = await db.users.createUser(userDetails, 'hospital_admin');
    // eslint-disable-next-line no-underscore-dangle
    const validToken = jwt.sign({ type: 'hospital_admin', id: user._id }, process.env.JWT_SECRETE, { expiresIn: '3d' });
    request
      .get('/api/device/deviceId')
      .set('req-token', validToken)
      .end((err, res) => {
        expect(res.status).toBe(404);
        expect(res.body.success).toEqual(false);
        done();
      });
  }, timeout);

  test('Geting device should succeed', async (done) => {
    const user = await db.users.createUser(userDetails2, 'hospital_admin');
    const device = await db.device.createDevice({
      // eslint-disable-next-line no-underscore-dangle
      hospitalId: user._id,
      label: 'something nice',
    });
    // eslint-disable-next-line no-underscore-dangle
    const validToken = jwt.sign({ type: 'hospital_admin', id: user._id }, process.env.JWT_SECRETE, { expiresIn: '3d' });
    request
    // eslint-disable-next-line no-underscore-dangle
      .get(`/api/device/${device._id}`)
      .set('req-token', validToken)
      .end((err, res) => {
        expect(res.status).toBe(200);
        done();
      });
  }, timeout);
});
