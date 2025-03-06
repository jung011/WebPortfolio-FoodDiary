package com.example.Back_spring.entity.primaryKey;


import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritePk implements Serializable {

    @Column (name="user_email")
    private String userEmail;

    @Column (name="board_number")
    private Long boardNumber;
}
