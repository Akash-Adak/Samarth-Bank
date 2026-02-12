package com.banking.user.service;

import com.banking.user.model.IdentityRegistry;
import com.banking.user.model.User;
import com.banking.user.model.UserModel;
import com.banking.user.repository.UserRepository;
import com.banking.user.response.RegisterRequestResponse;

import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  KafkaProducerService kafkaProducerService;
    @Autowired
    private RestTemplate restTemplate;


    public User createUser(UserModel userModel, HttpServletRequest request) {
        User user= new User();
        user.setUsername(userModel.getUsername());
        user.setEmail(userModel.getEmail());
        user.setAddress(userModel.getAddress());
        user.setPhone(userModel.getPhone());
        user.setKycStatus(userModel.getKycStatus());
        user.setFullname(userModel.getFullname());
        user.setKycStatus("PENDING");
//        user.setDob(userModel.getDob());
//        user.setDocHash(sha256(userModel.getDocHash()));
//        user.setDocType(userModel.getDocType());
//
//        IdentityRegistry identityRegistry = new IdentityRegistry();
//        identityRegistry.setDob(userModel.getDob());
//
//        identityRegistry.setDocHash(userModel.getDocHash());
//
//        identityRegistry.setDocType(userModel.getDocType());
//        identityRegistry.setFullName(userModel.getFullname());
//        String token = request.getHeader("Authorization");
//        HttpHeaders headers = new HttpHeaders();
////        headers.setContentType(MediaType.APPLICATION_JSON);
//        headers.set("Authorization" , token);
//
//        HttpEntity<IdentityRegistry> entity = new HttpEntity<>(identityRegistry, headers);
//
//        ResponseEntity<IdentityRegistry> response = restTemplate.exchange(
//                "http://KYC/api/kyc/addUserData",
//                HttpMethod.POST,
//                entity,
//                IdentityRegistry.class
//        );


//        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
//            throw new RuntimeException("Failed to update user with account number");
//        }
        return userRepository.save(user);
    }


    public Optional<User> getUserByUsername(String username) {

        return userRepository.findByUsername(username);
    }

    public User UpdateUser(UserModel userModel,HttpServletRequest request) {

            User old=userRepository.findByUsername(userModel.getUsername()).orElseThrow();
            old.setEmail(userModel.getEmail());
            old.setAddress(userModel.getAddress());
            old.setPhone(userModel.getPhone());
            old.setKycStatus(userModel.getKycStatus());
            old.setFullname(userModel.getFullname());
            old.setAccountNumber(userModel.getAccountNumber());
        IdentityRegistry identityRegistry = new IdentityRegistry();
        identityRegistry.setDob(userModel.getDob());

        identityRegistry.setDocHash(userModel.getDocHash());

        identityRegistry.setDocType(userModel.getDocType());
        identityRegistry.setFullName(userModel.getFullname());
        identityRegistry.setId(userModel.getId());
        String token = request.getHeader("Authorization");
        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization" , token);

        HttpEntity<IdentityRegistry> entity = new HttpEntity<>(identityRegistry, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                "http://KYC/api/kyc/addUserData",
                HttpMethod.POST,
                entity,
                String.class
        );
        RegisterRequestResponse event = new RegisterRequestResponse();
        String fullname = userModel.getUsername();
        String email = userModel.getEmail();
        String subject = "✅ Your Account Details Updated Successfully";

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
                "      <h1>Account Updated 🎉</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <p>Hello <strong>" + fullname + "</strong>,</p>" +
                "      <p>Your account details have been updated successfully.</p>" +
                "      <p>You can now review your updated information in your <strong>EFB – Equinox Finance Bank</strong> dashboard.</p>" +
                "      <p>If you did not make this update, please contact our support immediately.</p>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      &copy; 2025 EFB – Equinox Finance Bank. All rights reserved." +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";

// Set event for Kafka or email sending
        event.setUsername(subject); // Email subject
        event.setEmail(email);      // Recipient email
        event.setBody(body);        // HTML email body


        String json = new Gson().toJson(event);
        kafkaProducerService.sendUserRegistered("banking-users", json);
        return userRepository.save(old);

    }


    public List<User> getAll() {

      List<User> list=userRepository.findAll();
      return list;
    }


    public User addAccountNumber(String username, String accountNumber) {
        User old = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        old.setAccountNumber(accountNumber);
        return userRepository.save(old);
    }

    public Optional<User> getuserbyaccountnumber(String accountNumber) {

        return userRepository.findByAccountNumber(accountNumber);
    }


    public  String sha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes());

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();

        } catch (Exception e) {
            throw new RuntimeException("Hashing failed");
        }
    }

    public User updateKycStatus(String username, String kycStatus) {
        User old = userRepository.findByUsername(username) .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        old.setKycStatus(kycStatus);
        return userRepository.save(old);

    }
}
