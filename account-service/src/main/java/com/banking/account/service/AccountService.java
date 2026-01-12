package com.banking.account.service;

import com.banking.account.model.Account;
import com.banking.account.model.AccountType;
import com.banking.account.repository.AccountRepository;
import com.banking.account.response.RegisterRequestResponse;
import com.banking.account.response.UserResponse;
import com.banking.account.response.Token;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
@Service
//@Slf4j
public class AccountService {
    @Autowired
    private  AccountRepository repository;


    @Autowired
   private  RestTemplate restTemplate;
    @Autowired
   private  KafkaProducerService kafkaProducerService;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedisService redisService;
    public Account createAccount(String username, String token, AccountType type) {

        // Check if user already has an account
        if (repository.findByUsername(username).isPresent()) return null;

        // Create new account
        Account account = new Account();
        account.setAccountNumber(generateBankAccountNumber());
        account.setBalance(BigDecimal.valueOf(1000.0));
        account.setUsername(username);
        account.setAccountType(String.valueOf(type));
        // ✅ Add proper headers
        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization" , token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // ✅ Update user with new account number

        ResponseEntity<UserResponse> response = restTemplate.exchange(
                "http://USER/api/users/{username}/addAccountNumber/{accountNumber}",
                HttpMethod.PATCH,
                entity,
                UserResponse.class,
                username,
                account.getAccountNumber()        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Failed to update user with account number");
        }

        UserResponse userResponse = response.getBody();

        // ✅ Send Kafka notification
        RegisterRequestResponse event = new RegisterRequestResponse();
//        String username = userResponse.getUsername();
        String fullname = userResponse.getFullname();
        String email = userResponse.getEmail();

// Email subject
        String subject = "🎉 Account Created Successfully – Welcome " + fullname + "!";

// HTML Email body
        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <meta charset='UTF-8'>" +
                "  <style>" +
                "    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                "    .container { background-color: #ffffff; padding: 20px; margin: 30px auto; width: 90%; max-width: 600px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }" +
                "    .header { background-color: #0046be; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center; }" +
                "    .logo { max-width: 100px; margin-bottom: 10px; }" +
                "    .content { padding: 20px; color: #333333; line-height: 1.6; }" +
                "    .footer { text-align: center; font-size: 12px; color: #888888; padding-top: 15px; }" +
                "    .button { display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #0046be; color: white; text-decoration: none; border-radius: 5px; }" +
                "  </style>" +
                "</head>" +
                "<body>" +
                "  <div class='container'>" +
                "    <div class='header'>" +
                "      <img src='https://drive.google.com/file/d/13hFniB-moq7IQEjsqXJLRgUT9cfYqr9p/view?usp=drive_link' alt='EFB Logo' class='logo'>" +
                "      <h1>Account Created Successfully 🎉</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <p>Hello <strong>" + fullname + "</strong>,</p>" +
                "      <p>Your bank account has been created successfully with <strong>EFB – Equinox Finance Bank</strong>.</p>" +
                "      <p>You can now:</p>" +
                "      <ul>" +
                "        <li>View your account details</li>" +
                "        <li>Check your balance</li>" +
                "        <li>Start making transactions</li>" +
                "      </ul>" +
                "      <a href='#' class='button'>Go to Your Account</a>" +
                "      <p>Thank you for choosing EFB!</p>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      &copy; 2025 EFB – Equinox Finance Bank. All rights reserved." +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";

// Set the event for Kafka or email sending
        event.setUsername(subject); // Email subject
        event.setEmail(email);       // Recipient email
        event.setBody(body);         // HTML email body


        String json = new Gson().toJson(event);
        kafkaProducerService.sendLoginSuccess("banking-users", json);

        // ✅ Save account in local repository
        return repository.save(account);
    }


    private String generateBankAccountNumber() {
        String bankCode = "8940";
        long randomPart = ThreadLocalRandom.current().nextLong(1000000000L, 9999999999L); // 10-digit number
        return bankCode + randomPart;
    }


    public Account getUserByAccountNumber(String accountNumber) {
        return repository.findByAccountNumber(accountNumber);
    }


    public boolean debit(String accountNumber, BigDecimal amount,String token) {
        Optional<Account> optional = Optional.ofNullable(repository.findByAccountNumber(accountNumber));
        if (optional.isPresent()) {
            Account account = optional.get();
            if (account.getBalance().compareTo(amount) >= 0) {
                account.setBalance(account.getBalance().subtract(amount));

                repository.save(account);

                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization",token );

                HttpEntity<Void> entity = new HttpEntity<>(headers);

                ResponseEntity<UserResponse> response = restTemplate.exchange(
                        "http://USER/api/users/get-by-account/{accountNumber}",
                        HttpMethod.GET,
                        entity,
                        UserResponse.class,
                        accountNumber
                );
                UserResponse userResponse=response.getBody();
                RegisterRequestResponse event = new RegisterRequestResponse();
                String fullname = userResponse.getFullname();
                String email = userResponse.getEmail();
                String maskedAccount = "xxxxxx" + accountNumber.substring(accountNumber.length() - 4); // Last 4 digits
                String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

// Email subject
                String subject = "💸 Amount Debited – ₹" + amount + " from your account";

// HTML Email body
                String body = "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "  <meta charset='UTF-8'>" +
                        "  <style>" +
                        "    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                        "    .container { background-color: #ffffff; padding: 20px; margin: 30px auto; width: 90%; max-width: 600px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }" +
                        "    .header { background-color: #0046be; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center; }" +
                        "    .logo { max-width: 100px; margin-bottom: 10px; }" +
                        "    .content { padding: 20px; color: #333333; line-height: 1.6; }" +
                        "    .footer { text-align: center; font-size: 12px; color: #888888; padding-top: 15px; }" +
                        "    .highlight { font-weight: bold; color: #0046be; }" +
                        "  </style>" +
                        "</head>" +
                        "<body>" +
                        "  <div class='container'>" +
                        "    <div class='header'>" +
                        "      <img src='https://drive.google.com/file/d/13hFniB-moq7IQEjsqXJLRgUT9cfYqr9p/view?usp=drive_link' alt='EFB Logo' class='logo'>" +
                        "      <h1>Amount Debited Successfully 💸</h1>" +
                        "    </div>" +
                        "    <div class='content'>" +
                        "      <p>Hello <strong>" + fullname + "</strong>,</p>" +
                        "      <p>The following transaction has been processed from your account <span class='highlight'>" + maskedAccount + "</span>:</p>" +
                        "      <ul>" +
                        "        <li>Amount Debited: <span class='highlight'>₹" + amount + "</span></li>" +
                        "        <li>Current Balance: <span class='highlight'>₹" + account.getBalance() + "</span></li>" +
                        "        <li>Date: " + formattedDate + "</li>" +
                        "      </ul>" +
                        "      <p>Thank you for banking with <strong>EFB – Equinox Finance Bank</strong>.</p>" +
                        "    </div>" +
                        "    <div class='footer'>" +
                        "      &copy; 2025 EFB – Equinox Finance Bank. All rights reserved." +
                        "    </div>" +
                        "  </div>" +
                        "</body>" +
                        "</html>";

// Set Kafka or email event
                event.setUsername(subject); // Email subject
                event.setEmail(email);      // Recipient email
                event.setBody(body);        // HTML email body



                String json = new Gson().toJson(event);
                kafkaProducerService.sendLoginSuccess("banking-users", json);

                return true;
            }
        }
        return false;
    }

    public boolean credit(String accountNumber, BigDecimal amount, String token) {
        return Optional.ofNullable(repository.findByAccountNumber(accountNumber)).map(account -> {
            account.setBalance(account.getBalance().add(amount));
            repository.save(account);
//            log.info("Credited ₹{} to account {}", amount, accountNumber);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            try {
                ResponseEntity<UserResponse> response = restTemplate.exchange(
                        "http://USER/api/users/get-by-account/{accountNumber}",
                        HttpMethod.GET,
                        entity,
                        UserResponse.class,
                        accountNumber
                );

                UserResponse userResponse = response.getBody();
                if (userResponse == null) {
//                    log.error("User info missing in response for account {}", accountNumber);
                    return false;
                }

                RegisterRequestResponse event = new RegisterRequestResponse();
                String fullname = userResponse.getFullname();
                String email = userResponse.getEmail();
                String maskedAccount = "xxxxxx" + accountNumber.substring(accountNumber.length() - 4); // Last 4 digits
                String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

// Email subject
                String subject = "💰 Amount Credited – ₹" + amount + " to your account";

// HTML Email body
                String body = "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "  <meta charset='UTF-8'>" +
                        "  <style>" +
                        "    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                        "    .container { background-color: #ffffff; padding: 20px; margin: 30px auto; width: 90%; max-width: 600px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }" +
                        "    .header { background-color: #0046be; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center; }" +
                        "    .logo { max-width: 100px; margin-bottom: 10px; }" +
                        "    .content { padding: 20px; color: #333333; line-height: 1.6; }" +
                        "    .footer { text-align: center; font-size: 12px; color: #888888; padding-top: 15px; }" +
                        "    .highlight { font-weight: bold; color: #0046be; }" +
                        "  </style>" +
                        "</head>" +
                        "<body>" +
                        "  <div class='container'>" +
                        "    <div class='header'>" +
                        "      <img src='https://drive.google.com/file/d/13hFniB-moq7IQEjsqXJLRgUT9cfYqr9p/view?usp=drive_link' alt='EFB Logo' class='logo'>" +
                        "      <h1>Amount Credited Successfully 💰</h1>" +
                        "    </div>" +
                        "    <div class='content'>" +
                        "      <p>Hello <strong>" + fullname + "</strong>,</p>" +
                        "      <p>The following transaction has been credited to your account <span class='highlight'>" + maskedAccount + "</span>:</p>" +
                        "      <ul>" +
                        "        <li>Amount Credited: <span class='highlight'>₹" + amount + "</span></li>" +
                        "        <li>Current Balance: <span class='highlight'>₹" + account.getBalance() + "</span></li>" +
                        "        <li>Date: " + formattedDate + "</li>" +
                        "      </ul>" +
                        "      <p>Thank you for banking with <strong>EFB – Equinox Finance Bank</strong>.</p>" +
                        "    </div>" +
                        "    <div class='footer'>" +
                        "      &copy; 2025 EFB – Equinox Finance Bank. All rights reserved." +
                        "    </div>" +
                        "  </div>" +
                        "</body>" +
                        "</html>";

// Set Kafka or email event
                event.setUsername(subject); // Email subject
                event.setEmail(email);      // Recipient email
                event.setBody(body);        // HTML email body

                String json = new Gson().toJson(event);
                kafkaProducerService.sendLoginSuccess("banking-users", json);

                return true;

            } catch (HttpClientErrorException | HttpServerErrorException ex) {
//                log.error("Failed to fetch user info for account {}: {}", accountNumber, ex.getMessage());
                return false;
            }

        }).orElse(false);
    }


    public BigDecimal getBalanceByAccountNumber(String accountNumber) {
        Account a= repository.findByAccountNumber(accountNumber);
        return a.getBalance();
    }
}
