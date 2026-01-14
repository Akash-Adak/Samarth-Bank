FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/user-service-0.0.1-SNAPSHOT.jar user-service.jar

# Copy config if required (do NOT create it)
COPY config /app/config

EXPOSE 8082

CMD ["user-service.jar"]
