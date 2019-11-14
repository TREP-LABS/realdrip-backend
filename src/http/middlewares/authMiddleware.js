import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../../db';

dotenv.config();

const auth = async (req, res, next) => {
  const token = req.header('req-token');
  try {
    if (!token || typeof token !== 'string') throw Error('');
    const decoded = jwt.verify(token, process.env.JWT_SECRETE);
    const { id, type } = decoded;
    const user = await db.users.getUser({ _id: id }, type);
    if (!user) throw Error('');
    res.locals.user = user;
    res.locals.userType = type;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Unable to authenticate token' });
  }
  return next();
};

export default auth;
