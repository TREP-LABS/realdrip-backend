import supertest from 'supertest';
import app from '../http/app';

const request = supertest(app);
it('gets the version endpoint', async (done) => {
  request
    .get('/api/version')
    .end((err, res) => {
      expect(res.status).toBe(200);
      done();
    });
});
it('gets the verify device endpoint', async (done) => {
  request
    .post('/api/device/verify')
    .send({ deviceId: 'rd-2002' })
    .end((err, res) => {
      expect(res.status).toBe(422);
      done();
    });
}, 500000);
