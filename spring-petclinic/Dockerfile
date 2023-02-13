FROM openjdk:11

COPY ./target/spring-petclinic-2.4.5.jar /spring-petclinic-2.4.5.jar

RUN curl https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v1.3.1/opentelemetry-javaagent-all.jar \
   --output /opentelemetry-javaagent-all.jar

RUN curl https://search.maven.org/remotecontent?filepath=co/elastic/apm/elastic-apm-agent/1.25.0/elastic-apm-agent-1.25.0.jar \
   --output /elastic-apm-agent-1.25.0.jar

ADD start.sh /start.sh
CMD ["sh", "start.sh"]