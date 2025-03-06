package com.example.Back_spring.dto.object;


import com.example.Back_spring.entity.BoardListViewEntity;
import com.example.Back_spring.repository.resultSet.GetBoardListResultSet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BoardMainListItem {

    private Long boardNumber;
    private String title;
    private String content;
    private String address;
    private String writeDatetime;
    private String writerEmail;
    private String boardImageList;

    public BoardMainListItem(GetBoardListResultSet resultSet) {
        this.boardNumber = resultSet.getBoardNumber();
        this.title =  resultSet.getTitle();
        this.content = resultSet.getContent();
        this.address = resultSet.getAddress();
        this.writeDatetime = resultSet.getWriteDatetime();
        this.writerEmail = resultSet.getWriterEmail();
        this.boardImageList = resultSet.getBoardImageList();
    }

    public static List<BoardMainListItem> getList(List<GetBoardListResultSet> resultSets) {
        List<BoardMainListItem> list = new ArrayList<>();
        for (GetBoardListResultSet resultSet: resultSets) {
            BoardMainListItem boardListItem = new BoardMainListItem(resultSet);
            list.add(boardListItem);
        }
        return list;
    }
}
