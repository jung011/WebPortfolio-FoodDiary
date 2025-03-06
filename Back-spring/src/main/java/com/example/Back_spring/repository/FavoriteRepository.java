package com.example.Back_spring.repository;

import com.example.Back_spring.entity.BoardEntity;
import com.example.Back_spring.entity.FavoriteEntity;
import com.example.Back_spring.entity.primaryKey.FavoritePk;
import com.example.Back_spring.repository.resultSet.GetFavoriteListResultSet;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePk> {
    FavoriteEntity findByBoardNumberAndUserEmail(Long boardNumber, String userEmail);

    @Query(
            value=
            "SELECT " +
            "U.email AS email, " +
            "U.nickname AS nickname, " +
            "U.profile_image AS profileImage " +
            "FROM food_favorite AS F " +
            "INNER JOIN food_user AS U " +
            "ON F.user_email = U.email " +
            "WHERE F.board_number = ?1",
            nativeQuery=true
    )
        List<GetFavoriteListResultSet> getFavoriteList(Long boardNumber);

    @Transactional
    void deleteByBoardNumber (Long boardNumber);
}
