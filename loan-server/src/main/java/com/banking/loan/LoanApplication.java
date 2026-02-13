package com.banking.loan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.kafka.annotation.EnableKafka;

@EnableCaching
@EnableKafka
@SpringBootApplication

public class LoanApplication {
    public static void main(String[] args) {

        SpringApplication.run(LoanApplication.class, args);
    }
}
