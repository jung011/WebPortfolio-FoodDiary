package com.example.Back_spring.dto.request.user;


import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignUpRequestDto {

    @NotBlank
    @Email
    private String email;
    @NotBlank
    @Size(min=8, max=20)
    private String password;
    @NotBlank
    private String nickname;
    @NotNull
    @AssertTrue
    private Boolean agreedPersonal;
}
