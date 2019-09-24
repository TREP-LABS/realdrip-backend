import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../http/app';

const request = supertest(app);

const deviceId = 'rd-2002';
const timeout = 500000;
describe('/api/device/verify', () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(false);
    app.close();
  });

  test('Device verification should succeed', async (done) => {
    request
      .post('/api/device/verify')
      .send({deviceId: deviceId})
      .end((err, res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toEqual('Device verified successfully');
        expect(res.body.success).toEqual(true);
        expect(res.body.data.deviceId).toEqual(deviceId);
        done();
      });
  }, timeout);

  describe('Device verification should fail if: ', () => {
    test('Device id does not exist on the database', async (done) => {
      const InvalidDeviceId = 'rd_2005XPX';
      request
        .post('/api/device/verify')
        .send({deviceId: InvalidDeviceId})
        .end((error, response) => {
          expect(response.status).toEqual(422);
          expect(response.body.success).toEqual(false);
          done();
        });
    }, timeout);

    test('deviceId is not provided', async (done) => {
      request
        .post('/api/device/verify')
        .send({deviceId: undefined})
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          done();
        });
    }, timeout);
  });
});
