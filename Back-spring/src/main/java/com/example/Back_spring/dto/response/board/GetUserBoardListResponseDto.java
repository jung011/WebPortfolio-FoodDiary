package com.example.Back_spring.dto.response.board;


import com.example.Back_spring.common.ResponseCode;
import com.example.Back_spring.common.ResponseMessage;
import com.example.Back_spring.dto.object.BoardListItem;
import com.example.Back_spring.dto.object.BoardMainListItem;
import com.example.Back_spring.dto.response.ResponseDto;
import com.example.Back_spring.entity.BoardListViewEntity;
import com.example.Back_spring.repository.resultSet.GetBoardListResultSet;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.annotation.processing.Generated;
import java.util.List;

@Getter
public class GetUserBoardListResponseDto extends ResponseDto {

    private List<BoardMainListItem> userBoardList;

    private GetUserBoardListResponseDto(List<GetBoardListResultSet> resultSets) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.userBoardList = BoardMainListItem.getList(resultSets);
    }

    public static ResponseEntity<GetUserBoardListResponseDto> success(List<GetBoardListResultSet> resultSets) {
        GetUserBoardListResponseDto result = new GetUserBoardListResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistUser() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_USER, ResponseMessage.NOT_EXISTED_USER);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
}
