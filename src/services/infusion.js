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
 * @description The service function that gets all infusions
 * @param {Object} data The data required
 * @param {Object} data.user The user making the request
 * @param {String} data.userType The type of user making the request
 * @param {function} log Logger utility for logging messages
 * @returns {Object} The infusions
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const getAllInfusion = async (data, log) => {
  const { user, userType } = data;
  try {
    log.debug('Gathering user details');
    const infusionMatch = {
      hospitalId: userType === db.users.userTypes.HOSPITAL_ADMIN_USER ? user._id : user.hospitalId,
      wardId: userType === db.users.userTypes.WARD_USER ? user._id : user.wardId,
      nurseId: userType === db.users.userTypes.NURSE_USER ? user._id : user.nurseId,
    };
    const purifyInfusionMatch = JSON.parse(JSON.stringify(infusionMatch));
    log.debug('Getting infusions from the database using user details');
    const infusions = await db.infusion.getAllInfusion(purifyInfusionMatch);
    log.debug('Sending infusions to the user');
    return infusions;
  } catch (err) {
    log.debug('Unable to get infusions. Returning an error with a status code');
    const error = new Error('Unable to get infusions');
    error.httpStatusCode = 404;
    throw error;
  }
};

export default {
  createInfusion,
  getAllInfusion,
};
