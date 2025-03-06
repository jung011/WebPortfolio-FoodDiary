package com.example.Back_spring.entity;

import com.example.Back_spring.dto.request.board.PostBoardRequestDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(indexName = "elasticsearch_document")
public class ElasticsearchEntity {

    @Id
    private Long boardNumber;

    private String title;
    private String content;
    private String address;
    private String writeDatetime;
    private String writerEmail;
    private String boardImageList;

    public ElasticsearchEntity(PostBoardRequestDto dto, String email, Long boardNumber) {

        Date now = Date.from(Instant.now());
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String writeDatetime = simpleDateFormat.format(now);

        this.boardNumber = boardNumber;
        this.title = dto.getTitle();
        this.address = dto.getAddress();
        this.content = dto.getContent();
        this.writeDatetime = writeDatetime;
        this.writerEmail = email;
        this.boardImageList = dto.getBoardImageList().get(0);
    }

}
