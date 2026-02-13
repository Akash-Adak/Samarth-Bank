package com.banking.loan.service;


import com.banking.loan.event.LoanApprovedEvent;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoanProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final Gson gson = new Gson();

    private static final String TOPIC = "loan-approved-topic";

    public void sendLoanApprovedEvent(LoanApprovedEvent event) {

        String json = gson.toJson(event);

        kafkaTemplate.send(TOPIC, json);
    }
}

