package com.banking.payment.repository;

import com.banking.payment.dto.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepo
        extends JpaRepository<PaymentOrder, String> {
}

