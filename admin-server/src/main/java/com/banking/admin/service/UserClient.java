package com.banking.admin.service;

import com.banking.admin.config.FeignForceConfig;
import com.banking.admin.dto.UserModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

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

    @GetMapping("/api/users/getAll")
    List<UserModel> getUserList();

    @PatchMapping("/api/users/block/{accountNumber}")
    ResponseEntity<String> blockUser(@PathVariable("accountNumber") String accountNumber);


    @PatchMapping("/api/users/unblock/{accountNumber}")
    ResponseEntity<String> unBlockUser(@PathVariable("accountNumber") String accountNumber);


//    @GetMapping("/api/users/blocked/count")
//    Long countBlockedUsers();
}

