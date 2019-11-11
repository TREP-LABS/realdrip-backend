const confirmAuthRestriction = ({
  path, method, title, headers,
}) => ({
  title,
  request: {
    body: {},
    method,
    path,
    headers: {
      'req-token': 'randomPadding',
      ...headers,
    },
  },
  response: {
    status: 401,
    body: {
      success: false,
      message: 'Unable to authenticate token',
    },
  },
});

export default confirmAuthRestriction;
