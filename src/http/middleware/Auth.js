import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../../db';

dotenv.config();

// import/prefer-default-export
const Auth = async (req, res, next) => {
  const token = req.header('Authorization');

  if (typeof token === 'undefined') {
    return res.status(401).json({ success: false, message: 'unauthenticated: header not found' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    const { type } = decoded;
    // eslint-disable-next-line no-underscore-dangle
    const user = await db.users.getUser({ _id: id }, type);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid user' });
    }
    const basic = {
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    const userProfile = {

      hospital_admin: {
        ...basic,
        location: user.location,
        // eslint-disable-next-line no-underscore-dangle
        hospitalId: user._id,
      },
      ward_user: {
        ...basic,
        hospitalId: user.hospitalId,
      },
      nurse_user: {
        ...basic,
        hospitalId: user.hospitalId,
        wardId: user.wardId,
      },
    };

    res.locals.user = userProfile[type];
  } catch (err) {
    return res.status(403).json({ success: false, message: `${err.name}: ${err.message}` });
  }
  return next();
};
export default Auth;
