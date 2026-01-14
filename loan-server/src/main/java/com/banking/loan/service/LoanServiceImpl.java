package com.banking.loan.service;

import com.banking.loan.model.*;
import com.banking.loan.repository.LoanRepository;
import com.banking.loan.response.*;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;


import java.math.BigDecimal;
import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;

import static com.banking.loan.notification.LoanEmailBuilder.buildLoanEmail;

@Service
@Transactional
public class LoanServiceImpl implements LoanService {
    @Autowired
    private RedisService redisService;
    @Autowired
    private  LoanRepository loanRepository;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private  KafkaProducerService kafkaProducerService;


    @Override
    public LoanResponseDto applyLoan(LoanRequestDto req, String username, String token) throws AccessDeniedException {

        // 🔐 Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 📡 Call Account Service
        ResponseEntity<AccountResponse> response = restTemplate.exchange(
                "http://ACCOUNT/api/accounts/user/{accountNumber}",
                HttpMethod.GET,
                entity,
                AccountResponse.class,
                req.getAccountNumber()
        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Account service validation failed");
        }

        // 🔐 Ownership validation
        if (!response.getBody().getUsername().equals(username)) {
            throw new AccessDeniedException("You cannot apply loan for another user's account");
        }

        // 💰 EMI Calculation
        BigDecimal emi = calculateEmi(
                req.getPrincipalAmount(),
                req.getInterestRate(),
                req.getTenureMonths()
        );

        // 🏦 Save Loan
        Loan loan = new Loan();
        loan.setAccountNumber(req.getAccountNumber());
        loan.setLoanType(req.getLoanType());

        loan.setPrincipalAmount(req.getPrincipalAmount());
        loan.setInterestRate(req.getInterestRate());
        loan.setTenureMonths(req.getTenureMonths());
        loan.setEmiAmount(emi);
        loan.setStatus(LoanStatus.PENDING);
        loan.setCreatedAt(LocalDate.now());
        loan.setUpdatedAt(LocalDate.now());

        Loan saved = loanRepository.save(loan);





        LoanMsg event = new LoanMsg();
        event.setEmail(loanRepository.findEmailByAccountNumber(req.getAccountNumber()));
        event.setUsername("Loan Application Received");
        event.setBody(buildLoanEmail(username, req));

        kafkaProducerService.sendLoanMsg(
                "banking-loans",
                new Gson().toJson(event)
        );

        return mapToDto(saved);
    }

    @Override
    public LoanResponseDto approveLoan(Long loanId,String username,String token) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        loan.setStatus(LoanStatus.APPROVED);
        loan.setStartDate(LocalDate.now());
        loan.setEndDate(LocalDate.now().plusMonths(loan.getTenureMonths()));
        loan.setUpdatedAt(LocalDate.now());

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 📡 Call Account Service
        ResponseEntity<UserResponse> response = restTemplate.exchange(
                "http://USER/api/users/{username}",
                HttpMethod.GET,
                entity,
                UserResponse.class,
                username
        );

        BigDecimal amount = loanRepository.findPrincipalAmountByLoanId(loanId)
                .orElseThrow(() -> new IllegalStateException("Invalid loan"));

        BalanceUpdateRequest dto =
                new BalanceUpdateRequest(
                        response.getBody().getAccountNumber(),
                        amount
                );
        HttpEntity<BalanceUpdateRequest> entity1 =
                new HttpEntity<>(dto, headers);

        ResponseEntity<String> amountAddInAccount =
                restTemplate.exchange(
                        "http://ACCOUNT/api/accounts/credit",
                        HttpMethod.POST,
                        entity1,
                        String.class
                );



        Loan saved = loanRepository.save(loan);




        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("Account service validation failed");
        }

        UserResponse user=response.getBody();
        LoanMsg event = new LoanMsg();
        String fullname = user.getUsername();
        String email = user.getEmail();
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
                "      <img src='assets/vasta-bank-logo.png' alt='VASTA Bank Logo' class='logo'>" +
                "      <h1>Loan Approved ✔️</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <p>Hello <strong>" + fullname + "</strong>,</p>" +
                "      <p>Good news! Your <span class='highlight'>" + loan.getLoanType() + "</span> loan application has been <span class='highlight'>approved</span>.</p>" +
                "      <p><strong>Approved Amount:</strong> ₹" + loan.getPrincipalAmount() + "</p>" +
                "      <p><strong>EMI Amount:</strong> ₹" + loan.getEmiAmount() + "</p>" +
                "      <p><strong>Tenure:</strong> " + loan.getTenureMonths() + " months</p>" +
                "      <p>You can now view your repayment schedule in your <strong>VASTA Bank Dashboard</strong>.</p>" +
                "      <p>Thank you for banking with us.</p>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      &copy; 2025 VASTA Bank . All rights reserved." +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";

// Set event for Kafka or email sending
        event.setUsername(subject); // Email subject
        event.setEmail(email);      // Recipient email
        event.setBody(body);        // HTML email body


        String json = new Gson().toJson(event);
        kafkaProducerService.sendLoanMsg("banking-loans", json);

        return mapToDto(saved);
    }

    @Override
    public LoanResponseDto rejectLoan(Long loanId, String username, String token) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        loan.setStatus(LoanStatus.REJECTED);
        loan.setUpdatedAt(LocalDate.now());

        Loan saved = loanRepository.save(loan);

        // 🔐 Prepare auth headers
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 📡 Call User Service
        ResponseEntity<UserResponse> response = restTemplate.exchange(
                "http://USER/api/users/{username}",
                HttpMethod.GET,
                entity,
                UserResponse.class,
                username
        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("User service validation failed");
        }

        UserResponse user = response.getBody();
        String fullName = user.getUsername();
        String email = user.getEmail();

        // 📧 Email subject
        String subject = "Update on Your Loan Application – VASTA Bank";

        // 📧 Email HTML (REJECTION)
        String body = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Loan Application Update</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f6f8;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #b91c1c;
              color: #ffffff;
              text-align: center;
              padding: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 25px;
              color: #333333;
              line-height: 1.6;
              font-size: 15px;
            }
            .highlight {
              font-weight: bold;
              color: #b91c1c;
            }
            .footer {
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #888888;
              background-color: #f1f1f1;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <div class="header">
              <h1>Loan Application Update</h1>
              <p>VASTA Bank</p>
            </div>

            <div class="content">
              <p>Hello <strong>%s</strong>,</p>

              <p>
                Thank you for applying for a
                <span class="highlight">%s</span> loan with
                <strong>VASTA Bank</strong>.
              </p>

              <p>
                After careful review, we regret to inform you that your loan
                application could not be approved at this time.
              </p>

              <p>
                This decision may be based on internal eligibility criteria,
                credit assessment, or documentation review.
              </p>

              <p>
                You are welcome to reapply in the future or contact our support
                team for further clarification.
              </p>

              <p>
                We appreciate your interest in VASTA Bank and look forward
                to serving you again.
              </p>
            </div>

            <div class="footer">
              © 2025 VASTA Bank. All rights reserved.
            </div>
          </div>
        </body>
        </html>
        """.formatted(fullName, loan.getLoanType());

        // 📦 Kafka / Email event
        LoanMsg event = new LoanMsg();
        event.setUsername(subject);
        event.setEmail(email);
        event.setBody(body);

        String json = new Gson().toJson(event);
        kafkaProducerService.sendLoanMsg("banking-loans", json);

        return mapToDto(saved);
    }

    @Override
    public List<LoanResponseDto> getLoansByAccountNumber(String accountNumber) {
        return loanRepository.findByAccountNumber(accountNumber)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public LoanResponseDto getLoanById(Long id) {
        return loanRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
    }

    @Override
    public LoanResponseDto makeRepayment(Long loanId,String username,String token) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        // Calculate remaining amount BEFORE repayment
        BigDecimal principal = loan.getPrincipalAmount();
        BigDecimal emiPaid = loan.getEmiAmount();

        // Prevent over-payment negative balance
        BigDecimal remainingBefore = principal;

        // New remaining balance
        BigDecimal remainingAfter = remainingBefore.subtract(emiPaid);
        if (remainingAfter.compareTo(BigDecimal.ZERO) < 0) {
            remainingAfter = BigDecimal.ZERO;
        }

        // Update loan status
        if (remainingAfter.compareTo(BigDecimal.ZERO) == 0) {
            loan.setStatus(LoanStatus.CLOSED);
        } else {
            loan.setStatus(LoanStatus.ACTIVE);
        }

        loan.setPrincipalAmount(remainingAfter);
        loan.setUpdatedAt(LocalDate.now());

        Loan saved = loanRepository.save(loan);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 📡 Call User Service
        ResponseEntity<UserResponse> response = restTemplate.exchange(
                "http://USER/api/users/{username}",
                HttpMethod.GET,
                entity,
                UserResponse.class,
                username
        );

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new RuntimeException("User service validation failed");
        }

        UserResponse user = response.getBody();
        String fullname = user.getUsername();
        String email = user.getEmail();

        // EMAIL SUBJECT
        String subject = "💳 Loan Repayment Successful – VASTA Bank Bank";

        // FINAL EMAIL HTML BODY
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
                "      <img src='YOUR_LOGO_URL_HERE' alt='VASTA Bank Logo' class='logo'>" +
                "      <h1>Payment Successful 💳</h1>" +
                "    </div>" +
                "    <div class='content'>" +
                "      <p>Hello <strong>" + fullname + "</strong>,</p>" +
                "      <p>Your EMI repayment has been received successfully.</p>" +
                "      <p><strong>Loan Type:</strong> " + loan.getLoanType() + "</p>" +
                "      <p><strong>Amount Paid:</strong> ₹" + emiPaid + "</p>" +
                "      <p><strong>Remaining Balance:</strong> ₹" + remainingAfter + "</p>" +
                "      <p>Status: <strong>" + loan.getStatus() + "</strong></p>" +
                "      <p>Thank you for maintaining a good repayment record.</p>" +
                "    </div>" +
                "    <div class='footer'>" +
                "      &copy; 2025 VASTA Bank – Equinox Finance Bank. All rights reserved." +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";

        // KAFKA EVENT
        LoanMsg event = new LoanMsg();
        event.setUsername(fullname);
        event.setEmail(email);
//        event.setSubject(subject);
        event.setBody(body);

        String json = new Gson().toJson(event);
        kafkaProducerService.sendLoanMsg("banking-loans", json);

        return mapToDto(saved);
    }
    private LoanResponseDto mapToDto(Loan l) {
        LoanResponseDto dto = new LoanResponseDto();

        dto.setId(l.getId());
        dto.setAccountNumber(l.getAccountNumber());
        dto.setLoanType(l.getLoanType());
        dto.setPrincipalAmount(l.getPrincipalAmount());
        dto.setInterestRate(l.getInterestRate());
        dto.setTenureMonths(l.getTenureMonths());
        dto.setEmiAmount(l.getEmiAmount());
        dto.setStatus(l.getStatus());
        dto.setStartDate(l.getStartDate());
        dto.setEndDate(l.getEndDate());

        return dto;
    }


    // Basic EMI formula
    private BigDecimal calculateEmi(BigDecimal principal, double annualInterest, int tenureMonths) {
        double monthlyRate = annualInterest / 12 / 100.0;
        if (monthlyRate == 0) {
            return principal.divide(BigDecimal.valueOf(tenureMonths), BigDecimal.ROUND_HALF_UP);
        }
        double emi = (principal.doubleValue() * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))
                / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        return BigDecimal.valueOf(emi).setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}