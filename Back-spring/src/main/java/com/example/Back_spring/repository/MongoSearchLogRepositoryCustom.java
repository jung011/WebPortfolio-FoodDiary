package com.example.Back_spring.repository;

import com.example.Back_spring.repository.resultSet.GetPopularListResultSet;
import com.example.Back_spring.repository.resultSet.GetRelationListResultSet;

import java.util.List;

public interface MongoSearchLogRepositoryCustom {
    List<GetPopularListResultSet> getPopularList();
    List<GetRelationListResultSet> getRelationList(String searchWord);
}
