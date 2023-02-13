#/bin/sh
# export OTEL_TRACES_EXPORTER=${OTEL_TRACES_EXPORTER}
# export OTEL_EXPORTER_JAEGER_ENDPOINT=${OTEL_EXPORTER_JAEGER_ENDPOINT}
# export OTEL_EXPORTER_JAEGER_TIMEOUT=${OTEL_EXPORTER_JAEGER_TIMEOUT}
# export OTEL_LOG_LEVEL=${OTEL_LOG_LEVEL}

# java -javaagent:/opentelemetry-javaagent-all.jar \
#   -Xmx256m -Xms256m \
#   -Dotel.resource.attributes=service.name=petclinic \
#   -jar /spring-petclinic-2.4.5.jar
  
# java -javaagent:/opentelemetry-javaagent-all.jar \
#   -Dotel.resource.attributes=service.name=petclinic \
#   -jar /spring-petclinic-2.4.5.jar

java -javaagent:/elastic-apm-agent-1.25.0.jar \
  -jar /spring-petclinic-2.4.5.jar