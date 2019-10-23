import db from '../db';

const createInfusion = async (data, log) => {
  log.debug('Executing createInfusion service');
  const {
    startVolume,
    stopVolume,
    patientName,
    doctorsInstruction,
    deviceId,
    user,
    userType,
  } = data;
  log.debug('Gathering data for creating Infusion');
  const infusionDetails = {
    startVolume,
    stopVolume,
    patientName,
    doctorsInstruction,
    deviceId,
    hospitalId: userType === db.users.userTypes.HOSPITAL_ADMIN_USER ? user._id : user.hospitalId,
    wardId: userType === db.users.userTypes.WARD_USER ? user._id : user.wardId,
    nurseId: userType === db.users.userTypes.NURSE_USER ? user._id : user.nurseId,
  };
  const purifyInfusionDetails = JSON.parse(JSON.stringify(infusionDetails));
  log.debug('creating infusion');
  const infusion = await db.infusion.createInfusion(purifyInfusionDetails);
  log.debug('Returning created infusion to user');
  return infusion;
};

/**
 * @description The service function that deletes an infusion
 * @param {Object} data data required
 * @param {String} data.infusionId The id of the infusion to be deleted
 * @param {Object} data.user The user details
 * @param {String} data.userType The type of user making the request
 * @param {function} log Logger utility for logging messages
 * @returns {Object} The empty infusion data
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const deleteInfusion = async (data, log) => {
  log.debug('Executing deleteInfusion service');
  const { infusionId, user, userType } = data;
  log.debug('Gathering filter parameters for deleting Infusion');
  const infusionMatch = {
    _id: infusionId,
    hospitalId: userType === db.users.userTypes.HOSPITAL_ADMIN_USER ? user._id : user.hospitalId,
    wardId: userType === db.users.userTypes.WARD_USER ? user._id : user.wardId,
    nurseId: userType === db.users.userTypes.NURSE_USER ? user._id : user.nurseId,
  };
  const purifyInfusionMatch = JSON.parse(JSON.stringify(infusionMatch));
  log.debug('Deleting infusion from database using filter parameters');
  const infusion = await db.infusion.deleteInfusion(purifyInfusionMatch);
  log.debug('Returning empty infusion to user');
  return infusion;
};

export default {
  createInfusion,
  deleteInfusion,
};
