FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/notification-service-0.0.1-SNAPSHOT.jar notification-service.jar

EXPOSE 8085

CMD ["notification-service.jar"]
