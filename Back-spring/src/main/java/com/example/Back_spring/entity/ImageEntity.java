package com.example.Back_spring.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="food_image")
@Table(name="food_image")
public class ImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sequence;

    private Long boardNumber;

    private  String image;

    public ImageEntity(Long boardNumber, String image) {
        this.boardNumber = boardNumber;
        this.image = image;
    }

}
