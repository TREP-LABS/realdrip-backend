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

describe('/users/admin', () => {
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close(false);
    app.close();
  });

  test('Opetation should succeed', (done) => {
    request
      .post('/api/users/admin')
      .send(userDetails)
      .end((err, res) => {
        expect(res.status).toBe(201);
        expect(res.body.message).toEqual('Admin user created successfully');
        expect(res.body.success).toEqual(true);
        expect(res.body.data.constructor.name).toEqual('Object');
        expect(res.body.data.name).toEqual(userDetails.name);
        expect(res.body.data.email).toEqual(userDetails.email);
        expect(typeof res.body.data.hospitalId).toEqual('string');
        done();
      });
  });

  describe('Operation should fail if: ', () => {
    test('user with the same email already exist', (done) => {
      const anotherUser = { ...userDetails, email: 'anotherUser@test.com' };
      // create a user first
      request
        .post('/api/users/admin')
        .send(anotherUser)
        .end((error, response) => {
          expect(response.body.success).toEqual(true);
          // Try creating that same user again
          request
            .post('/api/users/admin')
            .send(anotherUser)
            .end((err, res) => {
              expect(res.status).toBe(409);
              expect(res.body.message).toEqual('User with this email already exist');
              expect(res.body.success).toEqual(false);
              done();
            });
        });
    });

    test('name is not provided', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, name: '' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.name[0]).toEqual('Medical center name is a required string');
          done();
        });
    });

    test('name value is less than 3 characters', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, name: 'me' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.name[0]).toEqual('Medical center name must be at least 3 characters');
          done();
        });
    });

    test('email is not provided', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, email: '' })
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
        .post('/api/users/admin')
        .send({ ...userDetails, email: 'testtt.com' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.email[0]).toEqual('Medical center email format is a not valid');
          done();
        });
    });

    test('password is not provided', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, password: '' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.password[0]).toEqual('Password field is a required string');
          done();
        });
    });

    test('password is weak', (done) => {
      // A weak password is a password that is less than 7 characters
      // and is not a mix of capital, small letters and numbers.
      request
        .post('/api/users/admin')
        .send({ ...userDetails, password: 'password' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.password[0]).toEqual('Password must be at least 7 character mix of capital, small letters with numbers');
          done();
        });
    });

    test('confirm password is not provided', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, confirmPassword: '' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.confirmPassword[0]).toEqual('Confirm password field is a required string');
          done();
        });
    });

    test('confirm password value does not match password value', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, confirmPassword: 'anotherPassword' })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors.confirmPassword[0]).toEqual('Confirm password field must match the password field');
          done();
        });
    });

    test('country is not provided', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, location: { ...userDetails.location, country: '' } })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors['location.country'][0]).toEqual('Country field is a required string');
          done();
        });
    });

    test('state is not provided', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, location: { ...userDetails.location, state: '' } })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors['location.state'][0]).toEqual('State field is a required string');
          done();
        });
    });

    test('address is not provided', (done) => {
      request
        .post('/api/users/admin')
        .send({ ...userDetails, location: { ...userDetails.location, address: '' } })
        .end((err, res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toEqual('Invalid request body');
          expect(res.body.success).toEqual(false);
          expect(Object.keys(res.body.errors).length).toEqual(1);
          expect(res.body.errors['location.address'][0]).toEqual('Address field is a required string');
          done();
        });
    });
  });
});
