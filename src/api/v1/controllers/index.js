/*
  The controller is just like a connector that connects
  the incoming server http request to the custom business logic of the application.
  There might be cases where we want to separate handling the incoming http request
  and the application business logic into different modules e.g where it is likely
  that the business logic would be used with another transportation layer or interface,
  however, for 90% of cases, we are always going to be working with the http requests.
*/

export default {};
