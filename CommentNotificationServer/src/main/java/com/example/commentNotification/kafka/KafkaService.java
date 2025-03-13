package com.example.commentNotification.kafka;

import com.example.commentNotification.gmail.EmailProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaService {

    private static final String TOPIC = "my-json-topic";
    private final EmailProvider emailProvider;

    @KafkaListener(
            topics = TOPIC,
            groupId = "test-consumer-group",
            containerFactory = "kafkaListenerContainerFactory")
    public void readMessage(String email) {
        System.out.println("Received message: " + email);
        emailProvider.sendCertificationMail(email);
    }
}
