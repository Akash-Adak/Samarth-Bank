package com.banking.kyc.service;

import com.banking.kyc.dto.*;
import com.banking.kyc.enums.DocumentType;
import com.banking.kyc.enums.KycStatus;

import com.banking.kyc.response.KycRequestResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.google.gson.Gson;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;

@Service
public class KycVerificationService {

    private final OcrService ocrService;
    private final DocumentValidationService validationService;
    private final AiScoringService aiScoringService;
    private final KafkaProducerService kafkaProducerService;

    public KycVerificationService(
            OcrService ocrService,
            DocumentValidationService validationService,
            AiScoringService aiScoringService,
            KafkaProducerService kafkaProducerService
    ) {
        this.ocrService = ocrService;
        this.validationService = validationService;
        this.aiScoringService = aiScoringService;
        this.kafkaProducerService = kafkaProducerService;
    }

    public KycResponse verifyKyc(
            String username, String token,
            String data,
            MultipartFile image) throws KycProcessingException {

        try {
            // 1️⃣ Parse JSON

            ObjectMapper mapper = new ObjectMapper();
            KycRequest request = mapper.readValue(data, KycRequest.class);

            // 2️⃣ Normalize document type
            DocumentType documentType =
                    DocumentType.valueOf(
                            request.getDocumentType().toUpperCase()
                    );

            // 3️⃣ Save temp file
            File tempFile = saveTempFile(image);

            // 4️⃣ OCR
            OcrResult ocrResult = ocrService.extractText(tempFile);
            tempFile.delete();

            // 5️⃣ Feature generation
            KycFeatures features =
                    validationService.generateFeatures(
                            documentType,
                            request.getName(),
                            request.getDob(),
                            request.getDocumentNumber(),
                            ocrResult.getExtractedText(),
                            ocrResult.getConfidence()
                    );

            // 6️⃣ AI scoring
            int score = aiScoringService.calculateScore(features);

            // 7️⃣ Final decision
            KycStatus status =
                    score >= 65
                            ? KycStatus.VERIFIED
                            : KycStatus.REJECTED;


            KycRequestResponse event = new KycRequestResponse();
//        String username = userResponse.getUsername();
//            String fullname = userResponse.getFullname();
//            String email = userResponse.getEmail();

// Email subject
            String subject = "🎉 Account Created Successfully – Welcome " + request.getName() + "!";

// HTML Email body
            String body =  "";



            event.setUsername(subject); // Email subject
            event.setEmail(request.getEmail());       // Recipient email
            event.setBody(body);         // HTML email body


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

    public class KycProcessingException extends Throwable {
        public KycProcessingException(String kycVerificationFailed, Exception ex) {
            super(kycVerificationFailed, ex);

        }
    }
}
