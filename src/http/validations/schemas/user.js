import Joi from '@hapi/joi';
import db from '../../../db';
import common from './common';

const commonUserSchema = {
  name: Joi.string().trim(true).min(3),
  email: Joi.string().email(),
  password: Joi.string().trim(true).min(7).pattern(/\d/)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .prefs({ abortEarly: true })
    .messages({
      'string.min': '"password" must be at least 7 character mix of capital, small letters with numbers',
      'string.pattern.base': '"password" must be at least 7 character mix of capital, small letters with numbers',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).messages({
    'any.only': '"confirmPassword" must match the password value',
  }),
  location: Joi.object({
    country: Joi.string().required(),
    state: Joi.string().required(),
    address: Joi.string().required(),
  }),
};

export const createHospitalUser = Joi.object({
  name: commonUserSchema.name.required(),
  email: commonUserSchema.email.required(),
  password: commonUserSchema.password.required(),
  confirmPassword: commonUserSchema.confirmPassword.required(),
  location: commonUserSchema.location,
});

export const updateHospitalUser = Joi.object({
  // Request body
  name: commonUserSchema.name,
  location: commonUserSchema.location,
  // Query params
  userId: Joi.string(),
});

export const updateWardUser = Joi.object({
  // Request body
  name: commonUserSchema.name,
  label: Joi.string(),
  // Query params
  wardId: common.validResourceId.message('"wardId" in query params is not valid'),
});

export const createWardUser = Joi.object({
  name: commonUserSchema.name.required(),
  email: commonUserSchema.email.required(),
  label: updateWardUser.extract('label').required(),
});

export const updateNurseUser = Joi.object({
  // Request body
  name: commonUserSchema.name,
  phoneNo: Joi.string(), // @todo: use regexp to do actual phone no matching here
  // Query params
  nurseId: common.validResourceId.message('"nurseId" in query params is not valid'),
});

export const createNurseUser = Joi.object({
  name: commonUserSchema.name.required(),
  email: commonUserSchema.email.required(),
  phoneNo: updateNurseUser.extract('phoneNo').required(),
});

export const login = Joi.object({
  email: commonUserSchema.email.required(),
  password: Joi.string().required(),
  userType: Joi.string().valid(...Object.values(db.users.userTypes)),
});

export const updatePassword = Joi.object({
  // Request body
  formerPassword: Joi.string().required(),
  newPassword: commonUserSchema.password.messages({
    'string.pattern.base': '"newPassword" must be at least 7 character mix of capital, small letters with numbers',
  }).required(),
  // Query params
  userId: common.validResourceId.message('"userId" in query params is not valid'),
});

export const regToken = Joi.string().label('regToken').required()
  .messages({
    'string.base': '"regToken" is a required query parameter',
    'any.required': '"regToken" is a required query parameter',
  });

export const getSingleWardUser = Joi.object({
  // Query params
  wardId: common.validResourceId.messages({
    'any.invalid': '"wardId" in query params is not valid',
  }).required(),
});

export const getSingleNurseUser = Joi.object({
  // Query params
  nurseId: common.validResourceId.messages({
    'any.invalid': '"nurseId" in query params is not valid',
  }).required(),
});
