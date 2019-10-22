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

export default {
  createInfusion,
};
