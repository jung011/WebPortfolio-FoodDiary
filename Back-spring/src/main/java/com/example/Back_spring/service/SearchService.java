package com.example.Back_spring.service;


import com.example.Back_spring.dto.response.ResponseDto;
import com.example.Back_spring.dto.response.board.GetBoardResponseDto;
import com.example.Back_spring.dto.response.search.GetPopularListResponseDto;
import com.example.Back_spring.dto.response.search.GetRelationListResponseDto;
import com.example.Back_spring.entity.ImageEntity;
import com.example.Back_spring.repository.MongoSearchLogRepository;
import com.example.Back_spring.repository.SearchLogRepository;
import com.example.Back_spring.repository.resultSet.GetBoardResultSet;
import com.example.Back_spring.repository.resultSet.GetPopularListResultSet;
import com.example.Back_spring.repository.resultSet.GetRelationListResultSet;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchLogRepository searchLogRepository;
    private final MongoSearchLogRepository mongoSearchLogRepository;

    public ResponseEntity<? super GetPopularListResponseDto> getPopularList() {

        List<GetPopularListResultSet> resultSets = new ArrayList<>();
        List<GetPopularListResultSet> resultSetsMongo = new ArrayList<>();

        try {
           // resultSets = searchLogRepository.getPopularList();
            resultSetsMongo =mongoSearchLogRepository.getPopularList();
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetPopularListResponseDto.success(resultSetsMongo);
    }

    public ResponseEntity<? super GetRelationListResponseDto> getRelationList(String searchWord) {

        List<GetRelationListResultSet> resultSets = new ArrayList<>();
        List<GetRelationListResultSet> resultSetsMongo = new ArrayList<>();

        try {
            //resultSets = searchLogRepository.getRelationList(searchWord);
            resultSetsMongo =mongoSearchLogRepository.getRelationList(searchWord);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetRelationListResponseDto.success(resultSetsMongo);
    }
}
