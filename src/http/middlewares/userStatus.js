import db from '../../db';

/**
 * @description Confirms that a request is from an hospital user as identified by the token
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express helper function to pass request to the next middleware
 */
const isHospitalUser = (req, res, next) => {
  const { userType } = res.locals;
  if (
    !userType
    || typeof userType !== 'string'
    || userType.toLowerCase() !== db.users.userTypes.HOSPITAL_ADMIN_USER.toLowerCase()
  ) {
    return res.status(403).json({ success: false, message: 'This endpoint can only be accessed by hospital admin users' });
  }
  return next();
};

/**
 * @description Confirms that the user making a request has confirmed his/her email address
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express helper function to pass request to the next middleware
 */
const hasConfirmedEmail = (req, res, next) => {
  const { user } = res.locals;
  if (user.confirmedEmail !== true) {
    return res.status(403).json({ success: false, message: 'You need to confirm your email address to access this endpoint' });
  }
  return next();
};

/*
@TODO: We currently don't have a secure way of
verifying user accounts so this middleware is left empty for now.
*/
const hasVerifiedAccount = (req, res, next) => next();

export default {
  isHospitalUser,
  hasConfirmedEmail,
  hasVerifiedAccount,
};
