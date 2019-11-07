/* eslint-disable import/no-extraneous-dependencies */
import supertest from 'supertest';
import app from '../../../http/app';

const request = supertest(app);

const injectContext = (data, context) => {
  if (typeof data !== 'function') return data;
  return data(context);
};

const testCaseIsVaild = (testCase) => {
  // @todo: We might need a better validation for the testCase object
  if (!testCase || testCase.constructor.name !== 'Object') return false;
  const { title, request: requestNode, response } = testCase;

  if ((!title || typeof title !== 'string')
    || (!requestNode || (requestNode.constructor.name !== 'Object' && requestNode.constructor.name !== 'Function'))
    || (!response || (response.constructor.name !== 'Object' && response.constructor.name !== 'Function'))
  ) return false;
  return true;
};

const mapTestCasesToTable = testCases => (
  testCases.map((testCase) => {
    if (testCaseIsVaild(testCase)) {
      return [testCase.title, testCase.request, testCase.response];
    }
    throw Error('Some test cases are not valid in this test suite');
  })
);

/**
 * @description The testRunner is used to build and run tests from testCases structured
 * according to the way it's described in ./testCasesSchema.js
 * @param {TestCase[]} testCases The test cases to run
 * @param {String} suiteTitle The title of the test suite
 * @param {object} context A context object to injext into each test case reqeust and response node
 */
const testRunner = (testCases, suiteTitle, context) => {
  const testTable = mapTestCasesToTable(testCases);
  test.each(testTable)(`${suiteTitle}: %s`, (title, reqData, resData) => {
    const testGlobals = JSON.parse(process.env.TEST_GLOBALS);

    const reqContext = { testGlobals, ...context };
    const resContext = { testGlobals, ...context };

    const processedReqData = injectContext(reqData, reqContext);
    const processedResData = injectContext(resData, resContext);

    const {
      method, path, body: reqBody, headers,
    } = processedReqData;

    const { status, body: resBody } = processedResData;

    // @todo: throw error if method and path is not present
    return request[method](path)
      .send(reqBody || {})
      .set(headers || {})
      .then((res) => {
        expect(res.status).toBe(status);
        expect(res.body).toMatchObject(resBody);
      });
  });
};

export default testRunner;
