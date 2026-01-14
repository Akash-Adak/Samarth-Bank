FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/transaction-service-0.0.1-SNAPSHOT.jar transaction-service.jar


EXPOSE 8084

CMD ["transaction-service.jar"]
