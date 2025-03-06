package com.example.Back_spring.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="food_list_view")
@Table(name="food_list_view")
public class BoardListViewEntity {

    @Id
    private Long boardNumber;

    private String title;

    private String content;

    private String address;

    private  String titleImage;

    private int favoriteCount;

    private int viewCount;

    private int commentCount;

    private String writeDatetime;

    private String writerEmail;

    private String writerNickname;

    private String writerProfileImage;

}
