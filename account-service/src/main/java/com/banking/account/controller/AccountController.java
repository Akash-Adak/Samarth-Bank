package com.banking.account.controller;

import com.banking.account.model.AccountRequest;
import com.banking.account.model.BalanceUpdateRequest;
import com.banking.account.response.Token;
import com.banking.account.service.AccountService;
import com.banking.account.model.Account;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

//@Slf4j
@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    @Autowired
    private  AccountService accountService;

    @Autowired
    private RedisTemplate redisTemplate;

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody AccountRequest accountRequest, HttpServletRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String token = request.getHeader("Authorization"); // Get the token from incoming request

        return ResponseEntity.ok(accountService.createAccount(username, token,accountRequest.getType()));
    }


    @GetMapping("/user/{accountNumber}")
    public ResponseEntity<Account> getUserByAccountNumber(@PathVariable String accountNumber) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(accountService.getUserByAccountNumber(accountNumber));
    }
    @PostMapping("/debit")
    public ResponseEntity<String> debit(@RequestBody BalanceUpdateRequest request,HttpServletRequest request1) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        String token1 = (String) redisTemplate.opsForValue().get(username);
        String token = request1.getHeader("Authorization");
//        log.info(token,token1);
        boolean success = accountService.debit(request.getAccountNumber(), request.getAmount(),token);
        if (success) {
            return ResponseEntity.ok("Debited successfully");
        } else {
            return ResponseEntity.badRequest().body("Insufficient funds or account not found");
        }
    }

    @PostMapping("/credit")
    public ResponseEntity<String> credit(@RequestBody BalanceUpdateRequest request,HttpServletRequest request1) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
//        String token1 = (String) redisTemplate.opsForValue().get(username);
        String token = request1.getHeader("Authorization");
        boolean success = accountService.credit(request.getAccountNumber(), request.getAmount(),token);
        if (success) {
            return ResponseEntity.ok("Credited successfully");
        } else {
            return ResponseEntity.badRequest().body("Account not found");
        }
    }

    @GetMapping("checkbalance/{accountNumber}")
    public BigDecimal checkBalance(@PathVariable String accountNumber){
        BigDecimal balance=accountService.getBalanceByAccountNumber(accountNumber);
        return balance;
    }



}

