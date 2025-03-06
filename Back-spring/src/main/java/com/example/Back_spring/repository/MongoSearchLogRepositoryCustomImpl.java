package com.example.Back_spring.repository;

import com.example.Back_spring.repository.resultSet.GetPopularListResultSet;
import com.example.Back_spring.repository.resultSet.GetRelationListResultSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MongoSearchLogRepositoryCustomImpl implements MongoSearchLogRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<GetPopularListResultSet> getPopularList() {
        // Aggregation pipeline 구축
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("relation").is(false)), // 'relation'이 false인 문서만 필터링
                Aggregation.group("searchWord") // 'search_word'별로 그룹화
                        .count().as("count") // 각 'search_word'의 count를 계산
                        .first("searchWord").as("searchWord"), // 'search_word'를 'searchWord'라는 필드로 설정
                Aggregation.sort(Sort.by(Sort.Order.desc("count"))), // count 내림차순으로 정렬
                Aggregation.limit(15) // 상위 15개만 가져오기
        );

        // MongoDB에 쿼리 실행 후 결과 반환
        return mongoTemplate.aggregate(aggregation, "search_log_document", GetPopularListResultSet.class).getMappedResults();
    }

    @Override
    public List<GetRelationListResultSet> getRelationList(String searchWord) {
        // Aggregation pipeline 구축
        Aggregation aggregation = Aggregation.newAggregation(
                // 'searchWord'와 'relation'이 false인 필터 조건
                Aggregation.match(Criteria.where("searchWord").is(searchWord)
                        //.and("relation").is(false) // 'relation'이 false인 필터 추가
                        .and("relationWord").ne(null)), // 'relationWord'가 null이 아닌 문서만 필터링

                // 'relationWord'별로 그룹화하고, 각 그룹에 대한 개수를 계산
                Aggregation.group("relationWord")
                        .count().as("count")  // 'relationWord'별로 count 계산
                        .first("relationWord").as("searchWord"),  // 그룹화된 값에 대해 'searchWord'로 매핑

                // 'count' 내림차순으로 정렬
                Aggregation.sort(Sort.by(Sort.Order.desc("count"))),

                // 상위 15개만 가져오기
                Aggregation.limit(15)
        );

        // MongoDB에 쿼리 실행 후 결과 반환
        return mongoTemplate.aggregate(aggregation, "search_log_document", GetRelationListResultSet.class).getMappedResults();
    }
}
