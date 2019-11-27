# RealDrip Backend [![Build Status](https://travis-ci.org/TREP-LABS/realdrip-backend.svg?branch=master)](https://travis-ci.org/TREP-LABS/realdrip-backend)  [![Coverage Status](https://coveralls.io/repos/github/TREP-LABS/realdrip-backend/badge.svg?branch=master)](https://coveralls.io/github/TREP-LABS/realdrip-backend?branch=master)

> What is RealDrip? Check [here](https://treplabs.co/realdrip)

This is the backend API of the RealDrip platform.

## API Documentation
The API is well documented using the OpenAPI Spec(Swagger) [here](https://app.swaggerhub.com/apis/Treplabs/Realdrip_Platform/1.0#/).

## Getting Started
The instructions below would get the project up and running on your local machine

### Prerequisite
- Git
- Node
- npm or yarn

### Installation
- Clone the repository `git clone https://github.com/TREP-LABS/realdrip-backend.git`
- Change into the directory of the project
- run `npm install` on your preferred console to install all the dependency packages
- Create a `.env` file in the root folder of the project to provide all the needed environment variables as specified in `.env.example`
- run `npm run dev` to start the application in dev mode

## Continuous Integration(CI)
We try our best to continuously integrate our changes as soon as they are created i.e we don't do long live feature branches. All pull requests are raised directly unto the shared main branch (master). You can read more about continuous integrations [here](https://en.wikipedia.org/wiki/Continuous_integration). We use [TravisCI](https://travis-ci.org/) a third-party platform to effectively manage our continuous integration. Travis helps us run automated builds for every commit introduced into the codebase. At any point in time, if Travis reports a failing build, fixing such a build should be the priority of the team. For CI, Travis builds includes linting the codebase to ensure it adheres to the standard of the team and running automated tests to ensure nothing is breaking.

## Continuous Delivery(CD)
We also practice Continuous Delivery, every change introduced(merged) into the master branch is automatically deployed to a staging(pre-production) environment where it can be tested as it would be in production. You can read more about Continuous Delivery[here](https://en.wikipedia.org/wiki/Continuous_delivery);
This practice makes us production-ready always, given that everything works well in this staging environment, we can always go to production without any hassle. We also make use of Travis for our Continuous Delivery, however, because we can't afford to deploy every single change that is pushed, we only auto deploy changes merged to the master branch.

## Folder Structure
- The root folder mostly contains config and meta files.
- The src folder is where the actual code lives.
- `src/http`: This folder contains all the Http and Http related logic used in the application. Everything from instantiating and configuring the express app, routing, request validation, etc. is in this folder.
- `src/service`: This folder contains all the business logic of the application. The logic of creating or authenticating a user, updating an infusion, etc. can be found in this folder. The approach of separating actual business logic from controller Http code might be foreign, however, we did this to avoid issues like having a bloated controller. Read more about separating controllers from services [here](https://www.coreycleary.me/why-should-you-separate-controllers-from-services-in-node-rest-apis/).
- `src/db`: This folder contains all the database logic of the application. This db module(folder) exports an interface with which other modules can use to access the database without necessarily having knowledge of the underlying database technology. We are currently using MongoDB, however, almost every other part of the application apart from the db module is not aware of that, they only need to be aware of the interface exported by the db module. This approach of separating db logic into its own module might also be a little foreign and over-engineered, however, We did this to make it easy to update our database logic or implementation without having to touch/change the business or Http logic, for context, we were not 100% sure of what database to use when we started development.
- `src/tests`: This folder contains all automated tests of the application.
- `src/utils`: This folder contains the common logic shared across all other components of the application.


## Testing
The application features mostly integration tests for its different API endpoints, to run these tests, use `npm test`(at the root of the project).
Becuase of our CI/CD practice, it's best that every single change to the codebase features one type of automated test or the other.

## Test Coverage
We use [Coveralls](https://coveralls.io/) to report our test coverage data. We aim for 90%(or above) test coverage but we try our best not to go below 80%.

### TestRunner
We added a bit of abstraction over the way we write our automated integration tests. Most of the integration tests we write for the different API endpoints follows the same structure of simulating an Http request to the app and asserting the response body. Consequently, we created a testRunner utility that takes care of the details on sending request and asserting a response, all you need to do to test an endpoint is to compose testCases. More details on how to use the testRuner and compose testCases [here]().
