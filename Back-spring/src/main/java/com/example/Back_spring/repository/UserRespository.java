package com.example.Back_spring.repository;

import com.example.Back_spring.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRespository extends JpaRepository<UserEntity, String> {

    UserEntity findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByNickname (String nickname);
}
