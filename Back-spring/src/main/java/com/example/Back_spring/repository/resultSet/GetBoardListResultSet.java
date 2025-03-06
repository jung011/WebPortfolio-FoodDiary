package com.example.Back_spring.repository.resultSet;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetBoardListResultSet {
    private Long boardNumber;
    private String title;
    private String content;
    private String address;
    private String writeDatetime;
    private String writerEmail;
    private String boardImageList;
}
