package com.example.Back_spring.repository;

import com.example.Back_spring.entity.BoardListViewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardListViewRepository extends JpaRepository<BoardListViewEntity, Long> {

    List<BoardListViewEntity> findByOrderByWriteDatetimeDesc();

    List<BoardListViewEntity>findTop3ByWriteDatetimeGreaterThanOrderByFavoriteCountDescCommentCountDescViewCountDescWriteDatetimeDesc(String writeDatetime);

    List<BoardListViewEntity> findByTitleContainsOrContentContainsOrAddressContainsOrderByWriteDatetimeDesc(String title, String content, String  address);

    List<BoardListViewEntity>findByWriterEmailOrderByWriteDatetimeDesc(String writerEamil);

}
