
import express, { Express, NextFunction, Request, Response } from 'express';

const APM_ENABLE = 'true'
let trace: { getActiveSpan: () => any; };

if (APM_ENABLE == 'true') {
    console.log("Enable tracing")
    trace = require('./tracer');
}

const app: Express = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/health', function (req, res) {
    res.send('Health!');
});

app.get('/sleep', function (req, res){
  setTimeout(() => {
    console.log("sleep")
    res.send("I'm wake.")
  }, 1000)
});

app.get('/error', function (req, res) {
  throw new Error('Parameter is not a number!')
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (trace) {
    const activeSpan = trace.getActiveSpan();
    activeSpan.recordException(err);
  }
  res.status(500).send('Something broken!')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

// process.on('SIGTERM', shutDown);
// process.on('SIGINT', shutDown);

// function shutDown() {
//   console.log('Received kill signal, shutting down gracefully');
//   setTimeout(() => {
//       process.exit(0);
//   }, 120000);
// }
