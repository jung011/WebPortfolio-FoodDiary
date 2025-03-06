package com.example.Back_spring.jwt;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${secret-key}")
    private String secretKey;

    public String create(String email) {
        Date expriedDate = Date.from(Instant.now().plus(1, ChronoUnit.HOURS));

        String jwt = Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(expriedDate)
                .compact();
        return jwt ;
    }

    public String validate(String jwt) {
        Claims clasims = null;

        try {
            clasims = Jwts.parser()
                            .setSigningKey(secretKey)
                            .parseClaimsJws(jwt)
                            .getBody();
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return null;
        }
        return clasims.getSubject();
    }
}
