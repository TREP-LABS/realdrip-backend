import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../http/app';

const request = supertest(app);

describe('/health', () => {
  afterAll(async () => {
    await mongoose.connection.close(false);
  });

  test('/api/health', (done) => {
    request
      .get('/api/health')
      .end((err, res) => {
        expect(res.status).toBe(200);
        expect(res.body.status).toEqual('I am alive');
        done();
      });
  });
});
