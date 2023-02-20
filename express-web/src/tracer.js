const opentelemetry = require("@opentelemetry/sdk-node");
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);


const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");

const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

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

// const provider = new NodeTracerProvider({
//   resource: new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]: apmConfig.serviceName,
//     [SemanticResourceAttributes.K8S_POD_UID]: apmConfig.podId,
//   }),
// });

// registerInstrumentations({
//   instrumentations: [
//     new HttpInstrumentation(),
//     new ExpressInstrumentation({
//       ignoreLayersType: [new RegExp("middleware.*")],
//     }),
//   ],
//   tracerProvider: provider,
// });

var meta = new grpc.Metadata();
meta.add("x-sls-otel-project", apmConfig.serviceName);
const collectorOptions = {
  url: apmConfig.url,
  metadata: meta,
};

const exporter = new CollectorTraceExporter(collectorOptions);

// provider.addSpanProcessor(new SimpleSpanProcessor(exporter));


// provider.register();


// // SDK configuration and start up
const sdk = new opentelemetry.NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()]
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