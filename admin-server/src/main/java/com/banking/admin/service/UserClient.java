package com.banking.admin.service;

import com.banking.admin.config.FeignForceConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
        name = "user",
        url = "http://localhost:8082",
        configuration = FeignForceConfig.class
)
public interface UserClient {

    @GetMapping("/api/users/count")
    Long countUsers();

    @GetMapping("/api/users/kyc/pending/count")
    Long countPendingKyc();

//    @GetMapping("/api/users/blocked/count")
//    Long countBlockedUsers();
}
