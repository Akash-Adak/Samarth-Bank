package com.banking.payment.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="paymets")
public class PaymentOrder {

    @Id
    private String orderId;

    private String accountNumber;

    private BigDecimal amount;

    private String status; // CREATED, PAID
}

