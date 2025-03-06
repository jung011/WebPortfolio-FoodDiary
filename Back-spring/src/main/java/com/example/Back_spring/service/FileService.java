package com.example.Back_spring.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.path}")
    private String filePath;
    @Value("${file.url}")
    private String fileUrl;

    public String upload(MultipartFile file) {


        if (file.isEmpty()) return null;

        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uuid = UUID.randomUUID().toString();
        String savedFileName = uuid + extension;
        String savePath = filePath + savedFileName;

        try {
            file.transferTo(new File(savePath));
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return null;
        }

        String url = fileUrl + savedFileName;
        return url;
    }

    public Resource getImage(String fileName) {
        Resource resource = null;

        try {
            resource = new UrlResource("file:" + filePath + fileName);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return null;
        }
        return resource;
    }

}