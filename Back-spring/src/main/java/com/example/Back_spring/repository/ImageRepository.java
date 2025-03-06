package com.example.Back_spring.repository;

import com.example.Back_spring.entity.BoardEntity;
import com.example.Back_spring.entity.ImageEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {
    List<ImageEntity> findByBoardNumber(Long boardNumber);

    @Transactional
    void deleteByBoardNumber(Long boardNumber);
}
