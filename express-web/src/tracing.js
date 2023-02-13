'use strict'

const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { CollectorTraceExporter } =  require('@opentelemetry/exporter-collector-grpc');
const { Metadata } = require("@grpc/grpc-js");
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const apmConfig = {
  apiKey: `ApiKey ${process.env.APM_API_KEY}`,
  url: process.env.APM_URL,
  serviceName: process.env.APM_SERVICE_NAME,
  podId: process.env.POD_NAME
}

const metadata = new Metadata()
metadata.set('Authorization', apmConfig.apiKey);

const collectorOptions = {
  // url is optional and can be omitted - default is grpc://localhost:4317
  url: apmConfig.url,
  metadata
};
// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
const traceExporter = new CollectorTraceExporter(collectorOptions);
const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: apmConfig.serviceName,
    [SemanticResourceAttributes.K8S_POD_NAME]: apmConfig.podId
  }),
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()]
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
  .then(() => console.log('Tracing initialized'))
  .catch((error) => console.log('Error initializing tracing', error));

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});