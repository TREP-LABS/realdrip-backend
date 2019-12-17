import Joi from '@hapi/joi';
import common from './common';

export const updateDevice = Joi.object({
  // Request body
  label: Joi.string(),
  // Query params
  deviceId: common.validResourceId.messages({
    'any.invalid': '"deviceId" in query params is not valid',
  }).required(),
});

export const getSingleDevice = Joi.object({
  // Query params
  deviceId: common.validResourceId.messages({
    'any.invalid': '"deviceId" in query params is not valid',
  }).required(),
});
