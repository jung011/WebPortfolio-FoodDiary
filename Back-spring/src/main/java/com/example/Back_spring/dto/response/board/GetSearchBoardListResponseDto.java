package com.example.Back_spring.dto.response.board;

import com.example.Back_spring.common.ResponseCode;
import com.example.Back_spring.common.ResponseMessage;
import com.example.Back_spring.dto.object.BoardListItem;
import com.example.Back_spring.dto.object.BoardMainListItem;
import com.example.Back_spring.dto.response.ResponseDto;
import com.example.Back_spring.dto.response.search.GetPopularListResponseDto;
import com.example.Back_spring.entity.BoardListViewEntity;
import com.example.Back_spring.repository.resultSet.GetBoardListResultSet;
import com.example.Back_spring.repository.resultSet.GetPopularListResultSet;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;


@Getter
public class GetSearchBoardListResponseDto extends ResponseDto {

    private List<BoardMainListItem> searchList;

    private GetSearchBoardListResponseDto(List<GetBoardListResultSet>resultSets) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.searchList = BoardMainListItem.getList(resultSets);
    }

    public static ResponseEntity<GetSearchBoardListResponseDto> success(List<GetBoardListResultSet>resultSets) {
        GetSearchBoardListResponseDto result = new GetSearchBoardListResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
