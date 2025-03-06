package com.example.Back_spring.entity;


import com.example.Back_spring.dto.request.user.SignUpRequestDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="food_user")
@Table(name="food_user")
public class UserEntity {

    @Id
    private String email;
    private String password;
    private String nickname;
    private String profileImage;
    private boolean agreedPersonal;

    public UserEntity (SignUpRequestDto dto) {
        this.email = dto.getEmail();
        this.password = dto.getPassword();
        this.nickname = dto.getNickname();
        this.agreedPersonal = dto.getAgreedPersonal();
    }

    public void setNickname (String nickname) {
        this.nickname = nickname;
    }

    public void setProfileImage (String profileImage) {
        this.profileImage = profileImage;
    }
}
