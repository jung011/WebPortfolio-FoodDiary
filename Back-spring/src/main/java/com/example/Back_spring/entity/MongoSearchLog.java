package com.example.Back_spring.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "search_log_document")
public class MongoSearchLog {

    @Id
    private Long sequence;
    private String searchWord;
    private String relationWord;
    private boolean relation;

    public MongoSearchLog(String searchWord, String relationWord, boolean relation) {
        this.searchWord = searchWord;
        this.relationWord = relationWord;
        this.relation = relation;
    }
}
