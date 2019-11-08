const confirmAccessLevelRestrictions = ({
  userType, path, method, title, headers,
}) => ({
  title,
  request: context => ({
    body: {},
    method,
    path,
    headers: {
      'req-token': context.testGlobals[userType].authToken,
      ...headers,
    },
  }),
  response: {
    status: 403,
    body: {
      success: false,
      message: 'You do not have access to this endpoint',
    },
  },
});

export default confirmAccessLevelRestrictions;
