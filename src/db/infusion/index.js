import infusionModel from './model';

/**
 * @description Creates an infusion in the database
 * @param {object} data  The infusion details
 * @param {number} data.startVolume The start volume
 * @param {number} data.stopVolume The stop volume
 * @param {string} data.patientName The patient's name
 * @param {string} data.doctorsInstruction Doctors Instruction
 * @param {string} data.status Infusion status
 * @param {string} data.hospitalId Infusion hospital id
 * @param {string} data.wardId Infusion ward id
 * @param {string} data.nurseId Infusion nurse id
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const createInfusion = (data) => {
  const Model = infusionModel;
  return new Model(data).save();
};

/**
 * @description updates details of an infusion
 * @param {object} infusionMatch  The infusion filter
 * @param {string} infusionMatch._id The unique identifier of the Infusion
 * @param {string} infusionMatch.hospitalId The hospital id
 * @param {string} infusionMatch.wardId The ward id
 * @param {string} infusionMatch.nurseId The nurse id
 * @param {string} infusionMatch.deviceId Infusion device id
 * @param {object} update The data to patch with the existing infusion data
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const updateInfusion = (infusionMatch, update) => {
  const Model = infusionModel;
  return Model.findOneAndUpdate(infusionMatch, update, { new: true });
};

/**
 * @description Gets a single infusion from the database
 * @param {object} infusionMatch  The data to be used as filter
 * @param {string} infusionMatch._id The unique id of the infusion
 * @param {string} infusionMatch.hospitalId the hospital id
 * @param {string} infusionMatch.deviceId the device id
 * @param {string} infusionMatch.wardId the ward id
 * @param {string} infusionMatch.nurseId the nurse id
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getSingleInfusion = (infusionMatch) => {
  const Model = infusionModel;
  return Model.findOne(infusionMatch).select('-__v');
};

/**
 * @description Gets all infusions based on the filter supplied
 * @param {object} infusionMatch  The data to be used as filter
 * @param {string} infusionMatch.hospitalId The hospital id
 * @param {string} infusionMatch.wardId The ward id
 * @param {string} infusionMatch.nurseId The nurse id
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const getAllInfusion = (infusionMatch) => {
  const Model = infusionModel;
  return Model.find(infusionMatch).select('-__v');
};

/**
 * @description delete a single infusion from the database
 * @param {object} infusionMatch  The data to be used as filter
 * @param {string} infusionMatch._id The unique id of the infusion
 * @param {string} infusionMatch.hospitalId the hospital id
 * @param {string} infusionMatch.deviceId the device id
 * @param {string} infusionMatch.wardId the ward id
 * @param {string} infusionMatch.nurseId the nurse id
 * @returns {Promise} A promise that resolves or reject to the result of the database operation
 */
const deleteInfusion = (infusionMatch) => {
  const Model = infusionModel;
  return Model.deleteOne(infusionMatch);
};

export default {
  createInfusion,
  updateInfusion,
  getSingleInfusion,
  getAllInfusion,
  deleteInfusion,
};
