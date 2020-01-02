import Joi from '@hapi/joi';
import db from '../../../db';

const validResourceId = Joi.string().custom((value, helpers) => {
  if (!db.validResourceId(value)) return helpers.error('any.invalid');
  return value;
});

export default {
  validResourceId,
};
