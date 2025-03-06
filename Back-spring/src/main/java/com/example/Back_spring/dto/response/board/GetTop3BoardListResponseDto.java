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
public class GetTop3BoardListResponseDto extends ResponseDto {

    private List<BoardListItem> top3List;

    private GetTop3BoardListResponseDto(List<BoardListViewEntity> boardListViewEntities) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.top3List = BoardListItem.getList(boardListViewEntities);
    }

    public static ResponseEntity<GetTop3BoardListResponseDto> success(List<BoardListViewEntity> boardListEntities) {
        GetTop3BoardListResponseDto result = new GetTop3BoardListResponseDto(boardListEntities);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
