
// console.log(process.env.APM_ENABLE)

let trace;

if (process.env.APM_ENABLE == 'true') {
  if (process.env.APM_TYPE == 'otel') {
    console.log("Enable tracing")
    trace = require('./tracer');
  }
}

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/health', function (req, res) {
    res.send('Health!');
});

app.get('/sleep', function (req, res) {
  setTimeout(() => {
    // console.log("sleep")
    res.send("I'm wake.")
  }, 1000)
});

app.get('/pet', function (req, res) {
  const http = require('http');
  let result
  http.get('http://java:8080/oups', (res) => {
    result = `Got response: ${res.statusCode}`
    // consume response body
    res.resume();
  }).on('error', (e) => {
    result = `Got error: ${e.message}`
  });
  res.send(result)
});

app.get('/error', function (req, res) {
  throw new Error('Parameter is not a number!')
});

app.use((err, req, res, next) => {
  if (trace) {
    const activeSpan = trace.getActiveSpan();
    activeSpan.recordException(err);
  }
  res.status(500).send('Something broken!')
})

const server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

server.keepAliveTimeout = 1000

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  setTimeout(() => {
      process.exit(0);
  }, 120000);
}
