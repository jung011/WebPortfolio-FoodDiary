package com.example.commentNotification.gmail;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailProvider {

    private final JavaMailSender javaMailSender;
    private final String SUBJECT = "댓글알림 메일입니다.";

    public boolean sendCertificationMail(String email) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

            String htmlContent = getCertificationMessage();

            messageHelper.setTo(email);
            messageHelper.setSubject(SUBJECT);
            messageHelper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
        return true;
    }

    private String getCertificationMessage() {

        String certificationMessage="";
        certificationMessage += "<h1 style='text-align: center;'>댓글 알림메일</h1>";
        certificationMessage += "<h3 style='text-align: center;'>게시판에 댓글이 등록되었습니다. <strong style='font-size:32px; letter-spacing:8px;'>" + "</strong></h3>";

        return certificationMessage;
    }
}