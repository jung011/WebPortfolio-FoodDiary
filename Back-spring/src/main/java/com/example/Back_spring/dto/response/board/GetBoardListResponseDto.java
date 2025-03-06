package com.example.Back_spring.dto.response.board;


import com.example.Back_spring.common.ResponseCode;
import com.example.Back_spring.common.ResponseMessage;
import com.example.Back_spring.dto.object.BoardListItem;
import com.example.Back_spring.dto.object.BoardMainListItem;
import com.example.Back_spring.dto.response.ResponseDto;
import com.example.Back_spring.entity.BoardListViewEntity;
import com.example.Back_spring.entity.ImageEntity;
import com.example.Back_spring.repository.resultSet.GetBoardListResultSet;
import com.example.Back_spring.repository.resultSet.GetBoardResultSet;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Getter
public class GetBoardListResponseDto extends ResponseDto {

    private List<BoardMainListItem> boardMainList;

    private GetBoardListResponseDto(List<GetBoardListResultSet> resultSets) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.boardMainList = BoardMainListItem.getList(resultSets);
    }

    public static ResponseEntity<GetBoardListResponseDto> success(List<GetBoardListResultSet> resultSets) {
        GetBoardListResponseDto result = new GetBoardListResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
