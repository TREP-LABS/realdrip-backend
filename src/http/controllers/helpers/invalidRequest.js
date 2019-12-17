const invalidReqeust = (res, {
  statusCode = 400,
  success = false,
  message = 'Invalid request data',
  errors = null,
}) => res.status(statusCode).json({
  success,
  message,
  errors,
});

export default invalidReqeust;
