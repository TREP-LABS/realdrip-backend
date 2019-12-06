import db from '../../db';

const userMatch = (data) => {
  const { userType, user } = data;
  const thisUser = {
    hospitalId: userType === db.users.userTypes.HOSPITAL_ADMIN_USER ? user._id : user.hospitalId,
    wardId: userType === db.users.userTypes.WARD_USER ? user._id : user.wardId,
    nurseId: userType === db.users.userTypes.NURSE_USER ? user._id : user.nurseId,
  };
  return JSON.parse(JSON.stringify(thisUser));
};

export default userMatch;
