package com.example.Back_spring.jwt;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Security;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override //Filter
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
                String token = parseBearerToken(request);
                if (token == null) {
                    filterChain.doFilter(request,response); //next Filter
                    return;
                }
                String email = jwtProvider.validate(token);
                if (email==null) {
                    filterChain.doFilter(request, response); //next Filter
                    return;
                }

                //토큰구조
                AbstractAuthenticationToken autherticationToken =  new UsernamePasswordAuthenticationToken(email, null, AuthorityUtils.NO_AUTHORITIES);
                autherticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                //Context 등록
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                securityContext.setAuthentication(autherticationToken);
                SecurityContextHolder.setContext(securityContext);
        }
        catch (Exception exception) {
            exception.printStackTrace();
        }
        filterChain.doFilter(request, response); //next Filter
    }

    private String parseBearerToken(HttpServletRequest request) {

        String authorization = request.getHeader("Authorization");

        boolean hasAuthorization = StringUtils.hasText(authorization);

        if (!hasAuthorization) return null;

        boolean isBearer = authorization.startsWith("Bearer");

        if(!isBearer) return null;

        String token = authorization.substring(7);
        return token;
    }
}
