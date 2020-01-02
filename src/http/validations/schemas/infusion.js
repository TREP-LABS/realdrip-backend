import Joi from '@hapi/joi';
import common from './common';

const commonDeviceSchema = {
  patientName: Joi.string(),
  doctorsInstruction: Joi.string(),
  volumeToDispense: Joi.number(),
  deviceId: common.validResourceId,
};

export const createInfusion = Joi.object({
  patientName: commonDeviceSchema.patientName.required(),
  doctorsInstruction: commonDeviceSchema.doctorsInstruction.required(),
  volumeToDispense: commonDeviceSchema.volumeToDispense.required(),
  deviceId: commonDeviceSchema.deviceId.required(),
});

export const updateInfusion = Joi.object({
  // Request body
  patientName: commonDeviceSchema.patientName,
  doctorsInstruction: commonDeviceSchema.doctorsInstruction,
  volumeToDispense: commonDeviceSchema.volumeToDispense,
  // Query params
  infusionId: common.validResourceId.messages({
    'any.invalid': '"infusionId" in query params is not valid',
  }).required(),
});

export const getSingleInfusion = Joi.object({
  // Query params
  infusionId: common.validResourceId.messages({
    'any.invalid': '"infusionId" in query params is not valid',
  }).required(),
});

export const deleteInfusion = Joi.object({
  infusionId: getSingleInfusion.extract('infusionId'),
});
