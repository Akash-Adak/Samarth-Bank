FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/transaction-service-0.0.1-SNAPSHOT.jar transaction-service.jar

# If you need config, COPY it (don’t create it)
COPY config /app/config

EXPOSE 8084

CMD ["transaction-service.jar"]
