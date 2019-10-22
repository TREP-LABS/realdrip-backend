import db from '../../db';

/**
 * @description Confirms that a request has a number of priviledges as identified by the token
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {function} next Express helper function to pass request to the next middleware
 */
const hasUserPrivledge = previledges => (req, res, next) => {
  const { userType } = res.locals;
  if (
    !userType
    || typeof userType !== 'string'
    || !previledges.includes(userType.toLowerCase())
  ) {
    return res.status(403).json({ success: false, message: 'You do not have access to this endpoint' });
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
  const { user, userType } = res.locals;
  const { HOSPITAL_ADMIN_USER } = db.users.userTypes;
  if (
    userType.toLowerCase() === HOSPITAL_ADMIN_USER.toLowerCase()
    && user.confirmedEmail !== true
  ) {
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
  hasConfirmedEmail,
  hasVerifiedAccount,
  hasUserPrivledge,
};
