import deviceSchema from './deviceModel';

const getSingleDevice = async (deviceDetails) => {
  const params = JSON.parse(JSON.stringify(deviceDetails));
  const Model = deviceSchema.deviceModel;
  return Model.findOne(params);
};

const createDevice = async (data) => {
  const Model = deviceSchema.deviceModel;
  return new Model(data).save();
};

export default {
  getSingleDevice,
  createDevice,
};
