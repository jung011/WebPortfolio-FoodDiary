package com.example.Back_spring.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="food_search_log")
@Table(name="food_search_log")
public class SearchLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sequence;

    private String searchWord;

    private String relationWord;

    private boolean relation;


    public SearchLogEntity(String searchWord, String relationWord, boolean relation) {
        this.searchWord = searchWord;
        this.relationWord = relationWord;
        this.relation = relation;
    }


}
