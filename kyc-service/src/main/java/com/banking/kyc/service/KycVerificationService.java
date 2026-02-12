package com.banking.kyc.service;

import com.banking.kyc.dto.*;
import com.banking.kyc.entity.IdentityRegistry;
import com.banking.kyc.enums.DocumentType;
import com.banking.kyc.enums.KycStatus;

import com.banking.kyc.repository.IdentityRegistryRepository;
import com.banking.kyc.response.KycRequestResponse;
import com.banking.kyc.util.EmailTemplateUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.security.MessageDigest;
import java.util.Map;

@Service
public class KycVerificationService extends Throwable {

    @Autowired
    private  OcrService ocrService;
    @Autowired
    private  DocumentValidationService validationService;
    @Autowired
    private  AiScoringService aiScoringService;
    @Autowired
    private  KafkaProducerService kafkaProducerService;
    @Autowired
    private  EmailTemplateUtil emailTemplateUtil;
    @Autowired
    private  IdentityRegistryRepository registryRepository;
    @Autowired
    private RestTemplate restTemplate;


    public KycResponse verifyKyc(
            String username,
            String token,
            String data,
            MultipartFile image
    ) {

        try {
            ObjectMapper mapper = new ObjectMapper();
            KycRequest request = mapper.readValue(data, KycRequest.class);

            DocumentType documentType =
                    DocumentType.valueOf(
                            request.getDocumentType().toUpperCase()
                    );

            File tempFile = saveTempFile(image);

            OcrResult ocrResult = ocrService.extractText(tempFile);
            tempFile.delete();

            KycFeatures features =
                    validationService.generateFeatures(
                            documentType,
                            request.getName(),
                            request.getDob(),
                            request.getDocumentNumber(),
                            ocrResult.getExtractedText(),
                            ocrResult.getConfidence()
                    );

            int score = aiScoringService.calculateScore(features);

            KycStatus status =
                    score >= 65
                            ? KycStatus.VERIFIED
                            : KycStatus.REJECTED;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "http://USER/api/users/{username}/updateKycStatus/{kycStatus}",
                    HttpMethod.PATCH,
                    entity,
                    String.class,
                    username,
                    status.name()
            );


            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Failed to update user with kyc statusr");
        }


            // 🔹 Email subject
            String subject =
                    status == KycStatus.VERIFIED
                            ? "VASTA Bank | KYC Verified"
                            : "VASTA Bank | KYC Verification Failed";

            // 🔹 Email template
            String templateName =
                    status == KycStatus.VERIFIED
                            ? "kyc-verified.html"
                            : "kyc-rejected.html";

            // 🔹 HTML body from template
            String body =
                    emailTemplateUtil.loadTemplate(
                            templateName,
                            Map.of("name", request.getName())
                    );

            // 🔹 Kafka event
            KycRequestResponse event = new KycRequestResponse();
            event.setUsername(subject);
            event.setEmail(request.getEmail());

            event.setBody(body);
//            event.setType("KYC_STATUS");

            String json = new Gson().toJson(event);
            kafkaProducerService.sendLoginSuccess("banking-users", json);

            return new KycResponse(
                    status.name(),
                    score,
                    status == KycStatus.VERIFIED
                            ? "KYC verified successfully"
                            : "KYC verification failed"
            );

        } catch (Exception ex) {
            throw new KycProcessingException(
                    "KYC verification failed",
                    ex
            );
        }
    }

    private File saveTempFile(MultipartFile image) throws Exception {
        String originalName = image.getOriginalFilename();
        String ext =
                (originalName != null && originalName.contains("."))
                        ? originalName.substring(originalName.lastIndexOf("."))
                        : ".png";

        File tempFile = File.createTempFile("kyc-", ext);
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(image.getBytes());
        }
        return tempFile;
    }

    public String addUserData(IdentityRegistry registry) {
        // This method can be used to store the extracted KYC data in a database
        // For this example, we will just return a success message
        registry.setDocHash(sha256(registry.getDocHash()));
        registry.setStatus("ACTIVE");

        registryRepository.save(registry);
        return "KYC data  has been stored successfully.";
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

}
