export default class ServiceError extends Error {
  constructor(message, httpStatusCode) {
    super();
    this.message = message;
    this.httpStatusCode = httpStatusCode;
  }
}
