import user from './user';
import device from './device';

export default {
  ...user, // The user module exports multiple models in an object
  ...device,
};
