import app from './app';
import config from './config';

export default app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
