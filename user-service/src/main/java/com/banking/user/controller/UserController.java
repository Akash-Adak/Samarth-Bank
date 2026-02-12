package com.banking.user.controller;

//import com.banking.user.kafka.KafkaProducer;
import com.banking.user.model.User;
import com.banking.user.model.UserModel;
import com.banking.user.service.RedisService;
import com.banking.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RedisService redisService;

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody UserModel user, HttpServletRequest request) {

        String jwtUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!jwtUsername.equals(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You cannot create a user for someone else.");
        }
       User saved= userService.createUser(user,request);
        return new ResponseEntity<>(saved,HttpStatus.CREATED);
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {

        String jwtUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!jwtUsername.equals(username)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You cannot access another user's data.");
        }

        User cachedUser = redisService.get(username, User.class);
        if (cachedUser != null) {
            System.out.println("✅ Retrieved from Redis");
            return new ResponseEntity<>(cachedUser, HttpStatus.OK);
        }

        Optional<User> users = userService.getUserByUsername(username);
        if (users.isPresent()) {
            User userObj = users.get();
            redisService.set(username, userObj, 3600L);
            return new ResponseEntity<>(userObj, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @PutMapping
    public ResponseEntity<?> UpdateUser(@RequestBody UserModel userModel,HttpServletRequest request) {
        String jwtUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        String username=userModel.getUsername();
        if (!jwtUsername.equals(userModel.getUsername())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You cannot create a user for someone else.");
        }
        System.out.println("from user controller"+userModel);
        User saved= userService.UpdateUser(userModel,request);


        User cachedUser = redisService.get(saved.getUsername(), User.class);
        if (cachedUser != null) {
            Optional<User> users = userService.getUserByUsername(saved.getUsername());
            if (users.isPresent()) {
                User userObj = users.get();
                redisService.set(saved.getUsername(), userObj, 3600L);
                return new ResponseEntity<>(userObj, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(saved,HttpStatus.OK);
    }



    @PatchMapping("/{username}/addAccountNumber/{accountNumber}")
    public ResponseEntity<?> addAccountNumber( @PathVariable String username,@PathVariable String accountNumber){
       User u= userService.addAccountNumber(username,accountNumber);
        User cachedUser = redisService.get(u.getUsername(), User.class);
        if (cachedUser != null) {
            Optional<User> users = userService.getUserByUsername(u.getUsername());
            if (users.isPresent()) {
                User userObj = users.get();
                redisService.set(u.getUsername(), userObj, 3600L);
                redisService.set(u.getAccountNumber(), userObj, 3600L);
                return new ResponseEntity<>(userObj, HttpStatus.OK);
            }
        }
        return  ResponseEntity.ok(u);
    }


    @GetMapping("/get-by-account/{accountNumber}")
    public ResponseEntity<?> getByAccountnimber(@PathVariable String accountNumber){
//        String jwtUsername = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        if (!jwtUsername.equals(user.getUsername())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body("You cannot create a user for someone else.");
//        }
       Optional<User> user= userService.getuserbyaccountnumber(accountNumber);
       if(user.isPresent()) return new ResponseEntity<>(user,HttpStatus.FOUND);

       return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
@PatchMapping("/{username}/updateKycStatus/{kycStatus}")
public ResponseEntity<?> updateKycStatus(@PathVariable String username,@PathVariable String kycStatus){
        User u= userService.updateKycStatus(username,kycStatus);
//        User cachedUser = redisService.get(u.getUsername(), User.class); if (cachedUser != null) {
//            Optional<User> users = userService.getUserByUsername(u.getUsername());
//            if (users.isPresent()) { User userObj = users.get();
//                redisService.set(u.getUsername(), userObj, 3600L);
//                return new ResponseEntity<>(userObj, HttpStatus.OK);
//            }
//        }
        return ResponseEntity.ok(u);
    }

}
