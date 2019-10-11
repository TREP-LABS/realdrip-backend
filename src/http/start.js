import app from './app';
import config from './config';
import { log } from '../utils/logger';

export default app.listen(config.port, () => {
  log.info(`App listening on port ${config.port}`);
});
