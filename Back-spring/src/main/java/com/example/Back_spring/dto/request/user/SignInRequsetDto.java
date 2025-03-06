package com.example.Back_spring.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class SignInRequsetDto {

    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
