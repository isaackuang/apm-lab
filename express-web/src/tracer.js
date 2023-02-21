const opentelemetry = require("@opentelemetry/sdk-node");
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);


// const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

// const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node")

const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');


const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const grpc = require("@grpc/grpc-js");
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector-grpc");

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const apmConfig = {
	url: process.env.APM_URL,
	serviceName: process.env.APM_SERVICE_NAME,
	podId: process.env.POD_NAME
}


var meta = new grpc.Metadata();
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
  new ExpressInstrumentation({
        ignoreLayersType: [new RegExp("middleware.*")],
    }),
]

// // SDK configuration and start up
const sdk = new opentelemetry.NodeSDK({
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

// For local development to stop the tracing using Control+c
process.on('SIGINT', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing finished.');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
});