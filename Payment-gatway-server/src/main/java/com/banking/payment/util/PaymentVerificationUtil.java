package com.banking.payment.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Hex;

public class PaymentVerificationUtil {

    public static boolean verifySignature(String orderId, String paymentId, String razorpaySignature, String secret) {
        try {
            String payload = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] digest = mac.doFinal(payload.getBytes());

            String generatedSignature = Hex.encodeHexString(digest);
            return generatedSignature.equals(razorpaySignature);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
