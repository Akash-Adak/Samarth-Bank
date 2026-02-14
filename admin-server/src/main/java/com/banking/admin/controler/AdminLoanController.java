package com.banking.admin.controler;


import com.banking.admin.dto.LoanDto;
import com.banking.admin.dto.LoanResponseDto;
import com.banking.admin.service.LoanClient;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
public class AdminLoanController {


}
