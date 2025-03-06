package com.example.Back_spring.repository;

import com.example.Back_spring.entity.BoardEntity;
import com.example.Back_spring.repository.resultSet.GetBoardListResultSet;
import com.example.Back_spring.repository.resultSet.GetBoardResultSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Long> {

    BoardEntity findByBoardNumber (Long boardNumber);

    @Query(
    value =
            "SELECT " +
                    "B.board_number AS boardNumber, " +
                    "B.title AS title, " +
                    "B.content AS content, " +
                    "B.address AS address, " +
                    "B.write_datetime AS writeDatetime, " +
                    "B.writer_email AS writerEmail, " +
                    "U.nickname AS writerNickname, " +
                    "U.profile_image AS writerProfileImage " +
                    "FROM food AS B " +
                    "INNER JOIN food_user AS U " +
                    "ON B.writer_email = U.email " +
                    "WHERE board_number = ?1 ",
            nativeQuery = true
    )
    GetBoardResultSet getBoard(Long boardNumber);

    @Query(
            value =
                    "SELECT " +
                            "B.board_number AS boardNumber, " +
                            "B.title AS title, " +
                            "B.content AS content, " +
                            "B.address AS address, " +
                            "B.write_datetime AS writeDatetime, " +
                            "B.writer_email AS writerEmail, " +
                            "F.image AS boardImageList " +
                            "FROM food AS B " +
                            "INNER JOIN food_image AS F ON B.board_number = F.board_number " +
                            "WHERE F.image = (SELECT F1.image FROM food_image F1 WHERE F1.board_number = B.board_number ORDER BY F1.image LIMIT 1) " +
                            "ORDER BY B.board_number ASC",
            nativeQuery = true
    )
    List<GetBoardListResultSet> getBoardList();

    @Query(
            value =
                    "SELECT " +
                            "B.board_number AS boardNumber, " +
                            "B.title AS title, " +
                            "B.content AS content, " +
                            "B.address AS address, " +
                            "B.write_datetime AS writeDatetime, " +
                            "B.writer_email AS writerEmail, " +
                            "F.image AS boardImageList " +
                            "FROM food AS B " +
                            "INNER JOIN food_image AS F ON B.board_number = F.board_number " +
                            "WHERE F.image = (SELECT F1.image FROM food_image F1 WHERE F1.board_number = B.board_number ORDER BY F1.image LIMIT 1) " +
                            "AND B.writer_email = ?1 " +
                            "ORDER BY B.board_number ASC",
            nativeQuery = true
    )
    List<GetBoardListResultSet> fineByWriterEmail(String email);

    @Query(
            value =
                    "SELECT " +
                            "B.board_number AS boardNumber, " +
                            "B.title AS title, " +
                            "B.content AS content, " +
                            "B.address AS address, " +
                            "B.write_datetime AS writeDatetime, " +
                            "B.writer_email AS writerEmail, " +
                            "F.image AS boardImageList " +
                            "FROM food AS B " +
                            "INNER JOIN food_image AS F ON B.board_number = F.board_number " +
                            "WHERE F.image = (SELECT F1.image FROM food_image F1 WHERE F1.board_number = B.board_number ORDER BY F1.image LIMIT 1) " +
                            "AND (B.title LIKE %?1% OR B.content LIKE %?2% OR B.address LIKE %?3%) " +
                            "ORDER BY B.board_number ASC",
            nativeQuery = true
    )
    List<GetBoardListResultSet>findByTitleContainsOrContentContainsOrAddressContainsOrderByWriteDatetimeDesc(String title, String content, String  address);
}
