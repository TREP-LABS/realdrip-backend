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

/**
 * @description The service function that gets a single infusion
 * @param {Object} data data required
 * @param {String} data.infusionId The id of the infusion been requested for
 * @param {Object} data.user The user details
 * @param {String} data.userType The type of user making the request
 * @param {function} log Logger utility for logging messages
 * @returns {Object} The infusion data
 * @throws {Error} Any error that prevents the service from executing successfully
 */
const getSingleInfusion = async (data, log) => {
  log.debug('Executing getSingleInfusion service');
  const { infusionId, user, userType } = data;
  log.debug('Gathering filter parameters for getting Infusion');
  const infusionMatch = {
    _id: infusionId,
    hospitalId: userType === db.users.userTypes.HOSPITAL_ADMIN_USER ? user._id : user.hospitalId,
    wardId: userType === db.users.userTypes.WARD_USER ? user._id : user.wardId,
    nurseId: userType === db.users.userTypes.NURSE_USER ? user._id : user.nurseId,
  };
  const purifyInfusionMatch = JSON.parse(JSON.stringify(infusionMatch));
  log.debug('Fetching infusion from database using filter parameters');
  const infusion = await db.infusion.getSingleInfusion(purifyInfusionMatch);
  log.debug('Returning infusion to user');
  return infusion;
};

export default {
  createInfusion,
  getAllInfusion,
  getSingleInfusion,
};
