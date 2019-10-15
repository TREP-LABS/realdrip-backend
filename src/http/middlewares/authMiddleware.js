import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../../db';

dotenv.config();

const auth = async (req, res, next) => {
  const token = req.header('req-token');

  if (!token || typeof token === 'undefined') {
    return res.status(401).json({ success: false, message: 'req-token not found in request header' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const { id, type } = decoded;
    const user = await db.users.getUser({ _id: id }, type);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unable to fetch user details' });
    }
    res.locals.user = user;
    res.locals.userType = type;
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unable to authenticate token' });
  }
  return next();
};
export default auth;
