package com.example.Back_spring.dto.response.board;

import com.example.Back_spring.common.ResponseCode;
import com.example.Back_spring.common.ResponseMessage;
import com.example.Back_spring.dto.object.BoardListItem;
import com.example.Back_spring.dto.response.ResponseDto;
import com.example.Back_spring.entity.BoardListViewEntity;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Getter
public class GetLatestBoardListResponseDto extends ResponseDto {

    private List<BoardListItem> latestList;

    private GetLatestBoardListResponseDto(List<BoardListViewEntity> boardListEntities) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.latestList = BoardListItem.getList(boardListEntities);
    }

    public static ResponseEntity<GetLatestBoardListResponseDto> success(List<BoardListViewEntity> boardListEntities) {
        GetLatestBoardListResponseDto result = new GetLatestBoardListResponseDto(boardListEntities);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

}
