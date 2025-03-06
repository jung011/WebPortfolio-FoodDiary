package com.example.Back_spring.repository;

import com.example.Back_spring.entity.BoardEntity;
import com.example.Back_spring.entity.CommentEntity;
import com.example.Back_spring.repository.resultSet.GetCommentListResultSet;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    @Query(
            value =
            "SELECT " +
                    " U.nickname AS nickname, " +
                    " U.profile_image AS profileImage, " +
                    " C.write_datetime AS writeDatetime, " +
                    " C.content AS comment, " +
                    " C.user_email AS email " +
                    "FROM food_comment AS C " +
                    "INNER JOIN food_user AS U " +
                    "ON C.user_email = U.email " +
                    "WHERE C.board_number = ?1 " +
                    "ORDER BY writeDatetime DESC ",
            nativeQuery = true
    )
    List<GetCommentListResultSet> getCommentList (Long boardNumber);

    @Transactional
    void deleteByBoardNumber (Long boardNumber);
}
