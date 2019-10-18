import db from '../db';

const createInfusion = async (data, log) => {
  const {
    startVolume,
    stopVolume,
    patientName,
    doctorsInstruction,
    deviceId,
    user,
    userType,
  } = data;
  log.debug('Executing createInfusion service');
  try {
    log.debug('Gathering data for creating Infusion');
    const infusionDetails = {
      startVolume,
      stopVolume,
      patientName,
      doctorsInstruction,
      deviceId,
      hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
      wardId: userType === 'ward_user' ? user._id : user.wardId,
      nurseId: userType === 'nurse_user' ? user._id : user.nurseId,
    };
    const purifyInfusionDetails = JSON.parse(JSON.stringify(infusionDetails));
    log.debug('creating infusion');
    const infusion = await db.infusion.createInfusion(purifyInfusionDetails);
    log.debug('Returning created infusion to user');
    return infusion;
  } catch (err) {
    log.debug('Unable to create infusion. throwing error');
    const error = new Error('Unable to create infusion');
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
  const { infusionId, user, userType } = data;
  log.debug('Executing getSingleInfusion service');
  try {
    log.debug('Gathering filter parameters for getting Infusion');
    const infusionMatch = {
      _id: infusionId,
      hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
      wardId: userType === 'ward_user' ? user._id : user.wardId,
    };
    const purifyInfusionMatch = JSON.parse(JSON.stringify(infusionMatch));
    log.debug('Fetching infusion from database using filter parameters');
    const infusion = await db.infusion.getSingleInfusion(purifyInfusionMatch);
    log.debug('Returning infusion to user');
    return infusion;
  } catch (err) {
    log.debug('Unable to get infusion. throwing error');
    const error = new Error(`Unable to get infusion with id: ${infusionId}`);
    error.httpStatusCode = 404;
    throw error;
  }
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
      hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
      wardId: userType === 'ward_user' ? user._id : user.wardId,
      nurseId: userType === 'nurse_user' ? user._id : user.nurseId,
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
 * @description The service function that updates an Infusion
 * @param {Object} data The data required
 * @param {Object} data.user The user data
 * @param {String} data.infusionId the id of the infusion to be updated
 * @param {String} data.userType The type of user making the request
 * @param {String} data.label the new label of the device
 * @param {function} log Logger utility for logging messages
 * @returns {object} The updated device data
 * @throws {error} Any error that prevents the service from executing successfully
 */
const updateInfusion = async (data, log) => {
  const {
    infusionId, user, userType, patientName, doctorsInstruction, startVolume, stopVolume,
  } = data;
  try {
    log.debug('Gathering filter to match infusion');
    const infusionMatch = {
      _id: infusionId,
      hospitalId: userType === 'hospital_admin' ? user._id : user.hospitalId,
      wardId: userType === 'ward_user' ? user._id : user.wardId,
      nurseId: userType === 'nurse_user' ? user._id : user.nurseId,
    };
    const purifyInfusionMatch = JSON.parse(JSON.stringify(infusionMatch));
    const update = JSON.parse(JSON.stringify({
      patientName, doctorsInstruction, startVolume, stopVolume,
    }));
    log.debug('Updating infusion info');
    const infusion = await db.infusion.updateInfusion(
      purifyInfusionMatch, update,
    );
    log.debug('Sending updated infusion to the user');
    return infusion;
  } catch (err) {
    log.debug('Unable to update infusion. Returning an error with a status code');
    const error = new Error('Unable to update infusion');
    error.httpStatusCode = 404;
    throw error;
  }
};

export default {
  createInfusion, getSingleInfusion, getAllInfusion, updateInfusion,
};
