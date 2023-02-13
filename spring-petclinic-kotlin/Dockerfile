# FROM gradle:7.2.0-jdk8 AS build
# COPY --chown=gradle:gradle . /home/gradle/src
# WORKDIR /home/gradle/src
# RUN gradle build

FROM openjdk:11
EXPOSE 8080

COPY ./build/libs/spring-petclinic-kotlin-2.5.4.jar /app/spring-petclinic-kotlin.jar
COPY ./start.sh /start.sh

RUN wget -O /opentelemetry-javaagent-all.jar https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v1.5.3/opentelemetry-javaagent-all.jar

CMD ["sh", "/start.sh"]
