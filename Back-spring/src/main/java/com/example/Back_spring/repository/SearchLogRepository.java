package com.example.Back_spring.repository;

import com.example.Back_spring.entity.ImageEntity;
import com.example.Back_spring.entity.SearchLogEntity;
import com.example.Back_spring.repository.resultSet.GetPopularListResultSet;
import com.example.Back_spring.repository.resultSet.GetRelationListResultSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SearchLogRepository extends JpaRepository<SearchLogEntity, Long> {


        @Query(
                value =
                        "SELECT search_word as searchWord, count(search_word) AS count " +
                                "FROM food_search_log " +
                                "WHERE relation IS FALSE " +
                                "GROUP BY search_word " +
                                "ORDER BY count DESC " +
                                "LIMIT 15 ",
                nativeQuery = true
        )
    List<GetPopularListResultSet> getPopularList();

    @Query(
            value =
                    "SELECT relation_word as searchWord, count(relation_word) AS count " +
                            "FROM food_search_log " +
                            "WHERE search_word = ?1 " +
                            "AND relation_word IS NOT NULL " +
                            "GROUP BY relation_word " +
                            "ORDER BY count DESC " +
                            "LIMIT 15 ",
            nativeQuery = true
    )
    List<GetRelationListResultSet> getRelationList(String searchWord);
}
