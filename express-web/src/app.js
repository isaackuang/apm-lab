
console.log(process.env.APM_ENABLE)

if (process.env.APM_ENABLE == 'true') {
    console.log("Enable tracing")
    require('./tracer');
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

app.get('/error', function (req, res) {
  throw new Error('Parameter is not a number!')
  res.send("Error!!!.")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  setTimeout(() => {
      process.exit(0);
  }, 120000);
}
