FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/account-service-0.0.1-SNAPSHOT.jar account-server.jar

EXPOSE 8083

CMD ["account-server.jar"]