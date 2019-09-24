import user from './user';
import device from './device';

export default {
  ...user, // The user module exports multiple schemas in an object
  ...device,
};
