// A test case should be structured like this:

// eslint-disable-next-line no-unused-vars
const testCase = {
  titile: String,
  request: {
    body: Object,
    path: String,
    method: String,
    headers: Object,
  },
  response: {
    status: Number,
    body: Object,
  },
};
