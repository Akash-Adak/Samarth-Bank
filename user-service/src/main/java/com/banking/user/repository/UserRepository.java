package com.banking.user.repository;

import com.banking.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByAccountNumber(String username);

    Long countByKycStatus(String pending);

//    Long countByBlocked(boolean b);

}
