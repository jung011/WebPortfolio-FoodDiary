package com.example.Back_spring.repository;

import com.example.Back_spring.entity.ElasticsearchEntity;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElasticsearchBoardRepository extends ElasticsearchRepository <ElasticsearchEntity, Long> {

 List<ElasticsearchEntity> findByTitleContainingOrContentContainingOrAddressContaining(String title, String content, String address);
}
