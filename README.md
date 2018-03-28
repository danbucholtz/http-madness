# HTTP Madness
HTTP Madness is an application that monitors local web traffic.

## Installation and set-up

Before getting started, ensure the latest `node` and `npm` LTS releases are being used. This application was built and verified with `node v8.10.0` and `npm 5.7.1`.

To check local versions, run the following commands:

```
node --version
npm --version
```

Once the correct node and npm are installed, get started by cloning the project

```
git clone git@github.com:danbucholtz/http-madness.git
```

Then navigate to the directory

```
cd http-madness
```

From there, install the dependencies

```
npm install
```

## Building the Project
To build the project, run

```
npm run build
```

This command compiles the typescript to javascript and outputs it to the `./dist` directory.

## Running the Project

Once the project is built, it can be run. The easiest way to run it is

```
npm run serve
```

The project can also be run by executing node directly on the `./dist/main.js` file.

```
node ./dist/main.js
```

## Running Tests

[Jest](https://github.com/facebook/jest) is used for testing. The tests are in `./src/*.spec.ts` files. To run the tests, run

```
npm run test
```

## Environment Variables

The application is highly configurable and can be passed data to change behaviors.

The following environment variables are utilized.

`HTTP_MADNESS_ALERT_THRESHOLD` represents the number of requests that can occur in the "long duration" before an alert state is triggered. The default is 120, or one request per second.

`HTTP_MADNESS_GENERATE_TRAFFIC_INTERVAL` is the number of milliseconds between requests when the generate traffic option is enabled. The default is 500.

`HTTP_MADNESS_LONG_DURATION_MILLIS` represents the longer window duration of time in millis for the traffic reports. The default is 120000.

`HTTP_MADNESS_SHORT_DURATION_MILLIS` represents the shorter window duration of time in millis for the traffic reports. The default is 10000.

`HTTP_MADNESS_SIGNIFICANT_TRAFFIC_MULTIPLIER` represents an integer that is multiplied by the mean to determine if significant traffic is occurring. The default is 2.

`HTTP_MADNESS_PORT` represents the port the web server listens on. The default is 8080.

`HTTP_MADNESS_IP_ADDRESS` represents the IP Address to listen on. The default is `0.0.0.0`.

`HTTP_MADNESS_GENERATE_TRAFFIC` represents a string of `"true"` or `"false"` determining whether the internal tool for generating traffic should be used. The default is `"true"`.

Environment variables can be passed directly to the application like this:

```
HTTP_MADNESS_GENERATE_TRAFFIC=false npm run serve
```

## Design Rational

`main.ts` is where the application initializes. Right off he bat, it starts up the express.js web server and begins listening for traffic. A series of "Event Controllers" are also initialized.

This system is built as a loosely coupled, event driven real-time system. Rather than composing procedures together, this application mimicks a production environment where it is event driven and (could be) highly asynchronous with minimal refactoring.

The `common-log-controller.ts` file handles events for when a new `common log format` message arrives. It is responsible for converting the log string into a strongly typed object. It then emits an event with the new data and moves on.

The `process-data-controller.ts` file handles queuing up the HTTP data object and passing it off to the `data-store`. The `process-data-controller` also sets up a polling mechanism to calculate data every `n` milliseconds based on the current data in the data-store. It ultimately builds up a strongly-typed object of relevant and interesting data every so often, and delegates the responsibility of handling that data to someone else by emitting the event.

The `reporting-controller.ts` file listens for the events emitted by the `process-data-controller` and converts the object into a report string for logging to the console.

The `generate-traffic-controller` determines whether it should generate traffic to throw at the local web server to generate the log files.

An event-driven system felt appropriate here since a requirement was a time-based reporting mechanism. Due to the nature of events and how polling works, this approach felt like a more robust and reasonable architecture than attempting to compose a series of procedures.

## Contributing

PRs and Issues are welcome. 