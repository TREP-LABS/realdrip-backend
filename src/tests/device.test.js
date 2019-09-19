import app from '../http/app'
import supertest from 'supertest'
const request = supertest(app)

it('gets the version endpoint', async done => {
  const response = await request.get('/api/version')
  expect(response.status).toBe(200)
  done()
});
it('gets the verify device endpoint', async done => {
  const response = await request
  .post('/api/device/verify').send({deviceId:'rd-2002'})
  expect(response.status).toBe(422)
  done()
}, 500000);
