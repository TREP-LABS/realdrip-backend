 
# TestRunner
The testRunner is an abstraction over the way we write automated integration tests. Most of the integration tests we write for the different API endpoints follows the same structure of simulating an Http request to the app and asserting the response body. Consequently, we created this testRunner utility that takes care of the details on sending request and asserting a response, all you need to do to test an endpoint is to compose test cases. 

The `testRunner` method accepts 3 arguments, `testRunner(a, b, c)`:
- a: The testCases array, this is an array of one or more test case for the testRunner to run.
- b: The suite titile, this is the title of the test suite under which all the test cases belongs.
- c: The context object. This is an object that can be used to passed data computed at test runtime to test cases. The context object also contains the [testGlobals](#TestGlobals). 

This is what a testCase looks like:

```
{
    title: 'The title of this test case',
    request: { // The request object describing the request
        body: {}, // Body of the request
        path: '', // This should be the path of the endpoint,
        method: '', // The HTTP verb to use for making the request
        headers: {}, // Request headers to send along with the request
    },
    response: {
        status: ***, // The expected response status code
        body: {}, // The expected response object
    }
}
```

If you need to pass some data to the request or response node at test runtime, you can compose the request or response as functions. The function would accecpt the context object passed to the testRunner as argument.

```
{
    title: 'The title of this test case',
    // The request node is a function returning an object
    request: (context) => ({
        body: {}, // Body of the request
        // Let's say the userId is computed at test runtime, maybe in a beforeAll hook, it can be passed down via the context object
        path: `/api/users/${context.userId}`, 
        method: '', // The HTTP verb to use for making the request
        headers: {}, // Request headers to send along with the request
    }),
    response: (context) => ({
        status: ***, // The expected response status code
        body: { // The expected response object
            message: context.expectedMessage
        }, 
    })
}
```

Let's say you want to test a login endpoitn `POST /users/login`. This is how you would use the test runner for that:

```
// Compose your test cases:
const testCases = [
    {
        title: 'should login successfully',
        request: {
            body: {
                email: 'testemail@gmail.com',
                password: 'testPassword123',
                userType: 'hospital_admin',
            },
            path: '/api/users/login',
            method: 'post',
        },
        response: {
            status: 200,
            body: {
                token: expect.any(string),
            },
        }
    },
    {
        title: 'should fail is password is not given in request',
        request: {
            body: {
                email: 'testemail@gmail.com',
                userType: 'hospital_admin',
            },
            path: '/api/users/login',
            method: 'post',
        },
        response: {
            status: 400,
            body: {
                errors: {
                    password: ['Password is a required string']
                }
            },
        }
    },
];

// Pass it to the test runner:
testRunner(testCases, 'User login', {});
```

## TestGlobals
Some data are needed across multiple tests at runtime, they are computed just before the tests start running as part of the test setup(`src/tests/setup.js`). We pass this data down to the other tests via the `TEST_GLOBALS` environment variables. If you are using the testRunner, the testGlobals object is available in the context object of every test case, if you are not using the testRunner, you can alwyas get the testGlobals object by parsing the JSON serialzied `process.env.TEST_GLOBALS` at test runtime.
