package com.example.Back_spring.service;


import com.example.Back_spring.dto.request.user.PatchNicknameRequestDto;
import com.example.Back_spring.dto.request.user.PatchProfileImageRequestDto;
import com.example.Back_spring.dto.request.user.SignInRequsetDto;
import com.example.Back_spring.dto.request.user.SignUpRequestDto;
import com.example.Back_spring.dto.response.ResponseDto;
import com.example.Back_spring.dto.response.user.*;
import com.example.Back_spring.entity.UserEntity;
import com.example.Back_spring.jwt.JwtProvider;
import com.example.Back_spring.repository.UserRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRespository userRespository;
    private final JwtProvider jwtProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<? super SignUpResponseDto> signUp (SignUpRequestDto dto) {
        String token = null;

        try {
            String email = dto.getEmail();
            boolean existedEmail = userRespository.existsByEmail(email);
            if (existedEmail) return SignUpResponseDto.duplicateEmail();

            String nickname = dto.getNickname();
            boolean existedNickname= userRespository.existsByNickname(nickname);
            if (existedNickname) return SignUpResponseDto.duplicateNickname();

            String password = dto.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            dto.setPassword(encodedPassword);

            UserEntity userEntity = new UserEntity(dto);
            userRespository.save(userEntity);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignUpResponseDto.success();
    }

    public ResponseEntity<? super SignInResponseDto> signIn (SignInRequsetDto dto) {
        String token = null;

        try {
            String email = dto.getEmail();
            UserEntity userEntity = userRespository.findByEmail(email);
            if (userEntity == null) return SignInResponseDto.signInFail();

            String password = dto.getPassword();;
            String encodedPassword = userEntity.getPassword();
            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if(!isMatched) return SignInResponseDto.signInFail();

            token = jwtProvider.create(email);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignInResponseDto.success(token);
    }

    public ResponseEntity<? super GetSignInUserResponseDto> getSignInUser (String email) {

        UserEntity userEntity = null;

        try {
            userEntity = userRespository.findByEmail(email);
            if (userEntity == null) return GetSignInUserResponseDto.noExistUser();
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetSignInUserResponseDto.success(userEntity);
    }

    public ResponseEntity<? super GetUserResponseDto> getUser (String email) {

        UserEntity userEntity = null;

        try {
            userEntity = userRespository.findByEmail(email);
            if (userEntity == null) return GetUserResponseDto.noExistUser();
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetUserResponseDto.success(userEntity);
    }

    public ResponseEntity<? super PatchNicknameResponseDto> patchNickname (PatchNicknameRequestDto dto, String email) {

        try {
            UserEntity userEntity = userRespository.findByEmail(email);
            if (userEntity == null) PatchNicknameResponseDto.noExistUser();

            String nickname = dto.getNickname();
            boolean existedNickname = userRespository.existsByNickname(nickname);
            if (existedNickname) return PatchNicknameResponseDto.duplicateNickname();

            userEntity.setNickname(nickname);
            userRespository.save(userEntity);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PatchNicknameResponseDto.success();
    }

    public ResponseEntity<? super PatchProfileImageResponseDto> patchProfileImage (PatchProfileImageRequestDto dto, String email) {

        try {
            UserEntity userEntity = userRespository.findByEmail(email);
            if (userEntity == null) PatchNicknameResponseDto.noExistUser();

            String profileImage = dto.getProfileImage();
            userEntity.setProfileImage(profileImage);
            userRespository.save(userEntity);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return PatchProfileImageResponseDto.success();
    }
}
