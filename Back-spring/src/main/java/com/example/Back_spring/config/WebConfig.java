package com.example.Back_spring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

//   @Value("${file.url}")
//    private String fileUrl = "http://localhost:8080/file/";

    @Value("${file.path}")
    private String savePath;


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(   "/file/**") //view에서 접근하는 경로
                .addResourceLocations("file:" + savePath);
    }

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        corsRegistry
                .addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*");

                //.allowCredentials(true);
    }
}
