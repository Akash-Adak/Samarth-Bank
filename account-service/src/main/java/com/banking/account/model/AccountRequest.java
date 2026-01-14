package com.banking.account.model;

public class AccountRequest {
    private String type;  // ✅ Enum instead of String

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}

