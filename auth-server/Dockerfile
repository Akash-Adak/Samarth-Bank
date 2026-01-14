FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/auth-server-0.0.1-SNAPSHOT.jar auth-service.jar


EXPOSE 8081

CMD ["auth-service.jar"]
