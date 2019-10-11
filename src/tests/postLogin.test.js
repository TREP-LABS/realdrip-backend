import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../http/app';

const request = supertest(app);

const userDetails = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password1',
  confirmPassword: 'Password1',
  location: {
    country: 'TestCountry',
    state: 'TestState',
    address: 'TestAddress',
  },
};
const loginDetails = {
  email: userDetails.email,
  password: userDetails.password,
  userType: 'hospital_admin',
};

const loginEndpoint = '/api/users/login';

describe('/users/login', () => {
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
        done();
      });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(false);
  });

  test('Opetation should succeed', (done) => {
    request
      .post(loginEndpoint)
      .send(loginDetails)
      .end((err, res) => {
        const expectedResponse = {
          success: true,
          message: 'Login successfully',
          data: {
            user: {
              id: expect.any(String),
              name: expect.any(String),
              email: loginDetails.email,
              confirmedEmail: false,
              verifiedPurchase: false,
            },
            token: expect.any(String),
          },
        };
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(expectedResponse);
        done();
      });
  });

  describe('Operation should fail if: ', () => {
    test('email is not provided', (done) => {
      request
        .post(loginEndpoint)
        .send({ ...loginDetails, email: '' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.email[0]).toEqual('Medical center email is a required string');
          done();
        });
    });
    test('email value is not a valid email address', (done) => {
      request
        .post(loginEndpoint)
        .send({ ...loginDetails, email: 'testtt.com' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.email[0]).toEqual('Medical center email format is a not valid');
          done();
        });
    });
    test('user does not exist', (done) => {
      request
        .post(loginEndpoint)
        .send({ ...loginDetails, email: 'fakeuser@mail.com' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Email or password incorrect');
          expect(res.body.success).toEqual(false);
          done();
        });
    });
    test('user type is not valid', (done) => {
      request
        .post(loginEndpoint)
        .send({ ...loginDetails, userType: 'random_user_type' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.success).toEqual(false);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.errors.userType[0]).toEqual('userType field must be one of the following: hospital_admin, ward_user, nurse_user');
          done();
        });
    });
    test('password is not provided', (done) => {
      request
        .post(loginEndpoint)
        .send({ ...loginDetails, password: '' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.password[0]).toEqual('Password field is a required string');
          done();
        });
    });
    test('user password is not correct', (done) => {
      request
        .post(loginEndpoint)
        .send({ ...loginDetails, password: 'wrongPass' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Email or password incorrect');
          expect(res.body.success).toEqual(false);
          done();
        });
    });
  });
});
