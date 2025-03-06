package com.example.Back_spring.repository;

import com.example.Back_spring.entity.MongoSearchLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoSearchLogRepository extends MongoRepository<MongoSearchLog, Long>, MongoSearchLogRepositoryCustom  {
}
