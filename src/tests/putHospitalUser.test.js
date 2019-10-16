import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../http/app';

const request = supertest(app);


const userDetails = {
  name: 'Test User',
  email: 'test@test.com',
  password: 'Password1',
  confirmPassword: 'Password1',
  location: {
    country: 'TestCountry',
    state: 'TestState',
    address: 'TestAddress',
  },
};

const updateUserFields = {
  name: 'Updated User',
  location: {
    country: 'TestCountry2',
    state: 'TestState2',
    address: 'TestAddress2',
  },
};

const hospitalUserEndpoint = '/api/hospital';

describe('PUT /api/hospital', () => {
  let userToken = null;
  beforeAll((done) => {
    // Create a user before running any test
    request
      .post('/api/hospital')
      .send(userDetails)
      .end((err, res) => {
        if (err || res.status !== 201) {
          throw Error('Creating hospital user failed, all tests in this suite is expected to also fail');
          // TODO: Find a better way to exit/skip this test suite once user creation fails
        }
        request.post('/api/users/login')
          .send({ email: userDetails.email, password: userDetails.password, userType: 'hospital_admin' })
          .end((error, response) => {
            if (error || response.status !== 200) {
              throw Error('Logging user in failed, all tests in this suite is expected to also fail');
            }
            userToken = response.body.data.token;
            done();
          });
      });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(false);
  });

  test('Opetation should succeed', (done) => {
    request
      .put(hospitalUserEndpoint)
      .set('req-token', userToken)
      .send(updateUserFields)
      .end((err, res) => {
        const expectedResponse = {
          success: true,
          message: 'User updated successfully',
          data: {
            id: expect.any(String),
            name: updateUserFields.name,
            email: userDetails.email,
            location: updateUserFields.location,
            confirmedEmail: false,
            verifiedPurchase: false,
          },
        };
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(expectedResponse);
        done();
      });
  });

  describe('Operation should fail if: ', () => {
    test('name value is less than 3 characters', (done) => {
      request
        .put(hospitalUserEndpoint)
        .set('req-token', userToken)
        .send({ updateUserFields, name: 'me' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.name[0]).toEqual('Medical center name must be at least 3 characters');
          done();
        });
    });
  });
});
