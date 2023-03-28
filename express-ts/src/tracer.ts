import { NodeSDK } from '@opentelemetry/sdk-node';
import { diag, trace, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// // For troubleshooting, set the log level to DiagLogLevel.DEBUG
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

// const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node")

import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Metadata } from '@grpc/grpc-js';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector-grpc';

declare var process: {
  env: {
    APM_URL: string
    APM_SERVICE_NAME: string
    POD_NAME: string
  }
}

const apmConfig = {
	url: 'http://192.168.80.28:55680',
	serviceName: 'ts-test',
	podId: 'test-pod'
}

var meta = new Metadata();
meta.add("x-sls-otel-project", apmConfig.serviceName);
const collectorOptions = {
  url: apmConfig.url,
  metadata: meta,
};

const traceExporter = new CollectorTraceExporter(collectorOptions);

const traceResource = new Resource({
       [SemanticResourceAttributes.SERVICE_NAME]: apmConfig.serviceName,
       [SemanticResourceAttributes.K8S_POD_UID]: apmConfig.podId,
  })

const traceInstrumentations = [
  new HttpInstrumentation(),
  new PgInstrumentation(),
  new ExpressInstrumentation(),
  getNodeAutoInstrumentations()
]

// // SDK configuration and start up
const sdk = new NodeSDK({
  resource: traceResource,
  traceExporter: traceExporter,
  instrumentations: traceInstrumentations
});

(async () => {
  try {
    await sdk.start();
    console.log('Tracing started.');
  } catch (error) {
    console.error(error);
  }
})();

// // For local development to stop the tracing using Control+c
// process.on('SIGINT', async () => {
//   try {
//     await sdk.shutdown();
//     console.log('Tracing finished.');
//   } catch (error) {
//     console.error(error);
//   } finally {
//     process.exit(0);
//   }
// });

module.exports = trace;