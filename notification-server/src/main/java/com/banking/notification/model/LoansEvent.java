package com.banking.notification.model;

import lombok.Data;

@Data
public class LoansEvent {
 private String username;
private String email;

 public String getUsername() {
  return username;
 }

 public void setUsername(String username) {
  this.username = username;
 }

 public String getEmail() {
  return email;
 }

 public void setEmail(String email) {
  this.email = email;
 }

 public String getBody() {
  return body;
 }

 public void setBody(String body) {
  this.body = body;
 }

 private String body;

}

