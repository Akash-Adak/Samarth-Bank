package com.banking.account.service;

import com.banking.account.response.LoanApprovedEvent;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class LoanApprovedConsumer {

    private final AccountService accountService;
    private final Gson gson = new Gson();

    @KafkaListener(
            topics = "loan-approved-topic",
            groupId = "account-group"
    )
    public void listen(String message) {

        System.out.println("Raw JSON: " + message);

        LoanApprovedEvent event =
                gson.fromJson(message, LoanApprovedEvent.class);

        accountService.creditAmount(
                event.getAccountNumber(),
                event.getAmount()
        );
    }
}
