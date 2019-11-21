/* eslint-disable consistent-return */

/**
 * @description A high order function that wraps controller methods with a try/catch block
 * @param {String} controllerName The name of the controller
 * @param {Function} controller The controller method
 * @returns {Function} Returns an express middleware
 */
export default (controllerName, controller) => async (req, res, next) => {
  const { log } = res.locals;
  log.debug(`Executing the ${controllerName} controller`);
  try {
    await controller(req, res, next);
  } catch (err) {
    if (err.httpStatusCode) {
      log.debug(`${controllerName} controller failed with an http status code, sending back a failure response`);
      return res.status(err.httpStatusCode).json({ success: false, message: err.message });
    }
    log.error(err, `${controllerName} controller failed without an http status code`);
    return next(err);
  }
};
