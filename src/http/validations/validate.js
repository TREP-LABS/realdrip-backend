
const formateJoiError = (joError) => {
  const { details } = joError;
  const error = {};
  details.forEach((detail) => {
    if (error[detail.context.label]) {
      error[detail.context.label].push(detail.message);
    } else {
      error[detail.context.label] = [detail.message];
    }
  });
  return error;
};

const validate = (validationSchema, data) => {
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
    skipFunctions: true,
  };
  const result = validationSchema.validate(data, validationOptions);
  if (result.error) {
    const formattedError = formateJoiError(result.error);
    result.error = formattedError;
    return result;
  }
  return result.value;
};

export default validate;
