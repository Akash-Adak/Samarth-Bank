package com.banking.payment.controller;

import java.util.HashMap;
import java.util.Map;

import com.banking.payment.util.PaymentVerificationUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    @PostMapping("/create-order")
    public Map<String, String> createOrder(@RequestBody Map<String, Object> requestData) {
        Map<String, String> response = new HashMap<>();
        try {
            // Safely get amount as integer from any numeric or string input
            Object amtObj = requestData.get("amount");
            int amount = 0;
            if (amtObj instanceof Integer) {
                amount = (Integer) amtObj;
            } else if (amtObj instanceof String) {
                amount = Integer.parseInt((String) amtObj);
            } else {
                throw new IllegalArgumentException("Invalid amount value");
            }

            RazorpayClient razorpay = new RazorpayClient(razorpayKey, razorpaySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);

            response.put("orderId", order.get("id").toString());
            response.put("amount", order.get("amount").toString());
            response.put("currency", order.get("currency").toString());
            response.put("key", razorpayKey);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Order creation failed: " + e.getMessage());
        }
        return response;
    }



    @PostMapping("/verify")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, String> body) {
        String orderId = body.get("orderId");
        String paymentId = body.get("paymentId");
        String signature = body.get("signature");

        boolean verified = PaymentVerificationUtil.verifySignature(orderId, paymentId, signature, razorpaySecret);
        Map<String, Object> response = new HashMap<>();
        response.put("verified", verified);
        return response;
    }
}
