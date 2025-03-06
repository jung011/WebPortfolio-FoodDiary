package com.example.Back_spring.entity;


import com.example.Back_spring.entity.primaryKey.FavoritePk;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="food_favorite")
@Table(name="food_favorite")
@IdClass(FavoritePk.class)
public class FavoriteEntity {

    @Id
    private String userEmail;

    @Id
    private Long boardNumber;

}
