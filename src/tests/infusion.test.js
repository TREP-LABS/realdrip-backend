import supertest from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../http/app';
import db from '../db';

dotenv.config();

const request = supertest(app);
const userDetails = {
  name: 'another Test User',
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

describe('/api/infusion/', () => {
  let user;
  let device;
  let validToken;

  beforeAll(async () => {
    user = await db.users.createUser({ ...userDetails, email: 'infusion@infusion.com' }, 'hospital_admin');
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

  test('Creating of infusion should fail if the request body is invalid', (done) => {
    const infusionDetails = {
      startVolume: 200,
      stopVolume: 50,
      doctorsInstruction: 'Give 150ml twice daily',
      deviceId: device._id,
      hospitalId: user._id,
    };
    request
      .post('/api/infusion')
      .set('req-token', validToken)
      .send(infusionDetails)
      .end((err, res) => {
        expect(res.status).toBe(400);
        done();
      });
  }, timeout);
  test('Creating of infusion should succeed', (done) => {
    const infusionDetails = {
      startVolume: 200,
      stopVolume: 50,
      patientName: 'Taofeek',
      doctorsInstruction: 'Give 150ml twice daily',
      deviceId: device._id,
      hospitalId: user._id,
      wardId: user._id,
    };
    request
      .post('/api/infusion')
      .set('req-token', validToken)
      .send(infusionDetails)
      .end((err, res) => {
        expect(res.status).toBe(201);
        done();
      });
  }, timeout);
});
