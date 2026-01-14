FROM gcr.io/distroless/java17-debian11

WORKDIR /app

COPY target/eureka-server-0.0.1-SNAPSHOT.jar eureka-server.jar

EXPOSE 8761

CMD ["eureka-server.jar"]
