FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/loan-server-0.0.1-SNAPSHOT.jar loan-server.jar


EXPOSE 8086

CMD ["loan-server.jar"]
