// import supertest from 'supertest';
// import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import app from '../http/app';
// import db from '../db';

// dotenv.config();

// const request = supertest(app);

// const userDetails = {
//   name: 'another Test User',
//   email: 'temmietayo@test.com',
//   password: 'Password1',
//   location: {
//     country: 'TestCountry',
//     state: 'TestState',
//     address: 'TestAddress',
//   },
//   confirmedEmail: true,
//   verifiedPurchase: true,
// };

// const timeout = 90000;

// describe('/api/infusion/', () => {
//   let user;
//   let device;
//   let validToken;
//   let defaultInfusion;

//   beforeAll(async () => {
//     user = await db.users.createUser(
// { ...userDetails, email: 'infusion@infusion.com' }, 'hospital_admin');
//     validToken = jwt.sign(
// { type: 'hospital_admin', id: user._id }, process.env.JWT_SECRETE, { expiresIn: '3d' });
//     device = await db.device.createDevice({
//       hospitalId: user._id,
//       label: 'something nice',
//     });
//     defaultInfusion = await db.infusion.createInfusion({
//       startVolume: 700,
//       stopVolume: 50,
//       patientName: 'Tumtum',
//       doctorsInstruction: 'This is the doctor\'s instructions and it\'s a string',
//       deviceId: device._id,
//       hospitalId: user._id,
//     });
//   }, timeout);

//   afterAll(async () => {
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close(false);
//     app.close();
//   });

//   test('Creating of infusion should fail if the request body is invalid', (done) => {
//     const infusionDetails = {
//       startVolume: 200,
//       stopVolume: 50,
//       doctorsInstruction: 'Give 150ml twice daily',
//       deviceId: device._id,
//       hospitalId: user._id,
//     };
//     request
//       .post('/api/infusion')
//       .set('req-token', validToken)
//       .send(infusionDetails)
//       .end((err, res) => {
//         expect(res.status).toBe(400);
//         done();
//       });
//   }, timeout);
//   test('Creating of infusion should succeed', (done) => {
//     const infusionDetails = {
//       startVolume: 200,
//       stopVolume: 50,
//       patientName: 'Taofeek',
//       doctorsInstruction: 'Give 150ml twice daily',
//       deviceId: device._id,
//       hospitalId: user._id,
//       wardId: user._id,
//     };
//     request
//       .post('/api/infusion')
//       .set('req-token', validToken)
//       .send(infusionDetails)
//       .end((err, res) => {
//         expect(res.status).toBe(201);
//         done();
//       });
//   }, timeout);

//   test('Geting all Infusions should succeed if the request token is valid', (done) => {
//     request
//       .get('/api/infusion')
//       .set('req-token', validToken)
//       .end((err, res) => {
//         expect(res.status).toBe(200);
//         done();
//       });
//   }, timeout);

//   test('Geting a single Infusion should succeed if the infusionId is valid', (done) => {
//     request
//       .get(`/api/infusion/${defaultInfusion._id}`)
//       .set('req-token', validToken)
//       .end((err, res) => {
//         expect(res.status).toBe(200);
//         done();
//       });
//   }, timeout);

//   test('Updating of infusion should succeed if the infusion details is valid', (done) => {
//     request
//       .put(`/api/infusion/${defaultInfusion._id}`)
//       .set('req-token', validToken)
//       .send({ patientName: 'Abeeb' })
//       .end((err, res) => {
//         expect(res.status).toBe(200);
//         done();
//       });
//   }, timeout);

//   test('deleting a single Infusion should succeed if
// the request token and the infusionId is valid', (done) => {
//     request
//       .delete(`/api/infusion/${defaultInfusion._id}`)
//       .set('req-token', validToken)
//       .end((err, res) => {
//         expect(res.status).toBe(204);
//         done();
//       });
//   }, timeout);
// });