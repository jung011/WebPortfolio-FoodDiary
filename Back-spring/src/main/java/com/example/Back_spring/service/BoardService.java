package com.example.Back_spring.service;

import com.example.Back_spring.dto.request.board.PatchBoardRequestDto;
import com.example.Back_spring.dto.request.board.PostCommentRequestDto;
import com.example.Back_spring.dto.response.ResponseDto;
import com.example.Back_spring.dto.response.board.*;
import com.example.Back_spring.entity.*;
import com.example.Back_spring.repository.*;
import com.example.Back_spring.dto.request.board.PostBoardRequestDto;
import com.example.Back_spring.repository.resultSet.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;
    private final FavoriteRepository favoriteRepository;
    private final CommentRepository commentRepository;
    private final BoardListViewRepository boardListViewRepository;
    private final  SearchLogRepository searchLogRepository;
    private final UserRespository userRespository;

    private final RedisTemplate<Long, GetBoardResultSet> redisTemplate;
    private final MongoSearchLogRepository mongoSearchLogRepository;
    private final ElasticsearchBoardRepository elasticsearchBoardRepository ;

    public ResponseEntity<? super GetBoardListResponseDto> getBoardList () {

        List<GetBoardListResultSet> resultSets = new ArrayList<>();

        try {
            resultSets = boardRepository.getBoardList();
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetBoardListResponseDto.success(resultSets);
    }

    public ResponseEntity<? super GetBoardResponseDto> getBoard(Long boardNumber) {

        GetBoardResultSet resultSet = null ;
        List<ImageEntity> imageEntities = new ArrayList<>();

        try {
                resultSet = redisTemplate.opsForValue().get(boardNumber);

                if(resultSet == null) {

                    resultSet = boardRepository.getBoard(boardNumber);
                    if (resultSet == null) return GetBoardResponseDto.noExistBoard();
                    long timeout = 3600;
                    redisTemplate.opsForValue().set(boardNumber, resultSet, timeout, TimeUnit.SECONDS);
                }

                imageEntities = imageRepository.findByBoardNumber(boardNumber);

        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetBoardResponseDto.success(resultSet, imageEntities);
    }

    public ResponseEntity<? super PostBoardResponseDto  >postBoard(PostBoardRequestDto dto, String email) {
        try {
            BoardEntity boardEntity = new BoardEntity(dto, email);
            boardRepository.save(boardEntity);
            Long boardNumber = boardEntity.getBoardNumber();

            ElasticsearchEntity elasticsearchEntity = new ElasticsearchEntity(dto, email, boardNumber);
            elasticsearchBoardRepository.save(elasticsearchEntity);

            //Long boardNumber = boardEntity.getBoardNumber();

            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String image : boardImageList) {
                ImageEntity imageEntity = new ImageEntity(boardNumber, image);
                imageEntities.add(imageEntity);
            }
            imageRepository.saveAll(imageEntities);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return null;
        }
        return  PostBoardResponseDto.success();
    }

    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite (Long boardNumber, String email) {
        try {
                BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
                FavoriteEntity favoriteEntity = favoriteRepository.findByBoardNumberAndUserEmail(boardNumber, email);
                if (favoriteEntity == null) {
                    favoriteEntity = new FavoriteEntity(email, boardNumber);
                    favoriteRepository.save(favoriteEntity);
                    boardEntity.increaseFavoriteCount();
                }
                else {
                    favoriteRepository.delete(favoriteEntity);
                    boardEntity.decreaseFavoriteCount();
                }

                boardRepository.save(boardEntity);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return  PutFavoriteResponseDto.success();
    }

    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList (Long boardNumber) {

        List<GetFavoriteListResultSet>resultSets = new ArrayList<>();
        try {
            resultSets = favoriteRepository.getFavoriteList(boardNumber);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return  GetFavoriteListResponseDto.success(resultSets);
    }

    public ResponseEntity<? super PostCommentResponeDto> postComment (PostCommentRequestDto dto, Long boardNumber, String email) {

        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            CommentEntity commentEntity = new CommentEntity(dto, boardNumber, email);
            commentRepository.save(commentEntity);

            boardEntity.increaseCommentCount();
            boardRepository.save(boardEntity);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return  PostCommentResponeDto.success();
    }

    public ResponseEntity<? super GetCommentListResponseDto> getCommentList (Long boardNumber) {

        List<GetCommentListResultSet> resultSets = new ArrayList<>();

        try {
            resultSets = commentRepository.getCommentList(boardNumber);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return  GetCommentListResponseDto.success(resultSets);
    }

    public ResponseEntity<? super IncreaseViewCountResponseDto> increaseViewCount (Long boardNumber) {

        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if(boardEntity == null) return IncreaseViewCountResponseDto.noExistBoard();
            boardEntity.increaseViewCount();
            boardRepository.save(boardEntity);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return IncreaseViewCountResponseDto.success();
    }

    public ResponseEntity<? super DeleteBoardResponseDto> deleteBoard (Long boardNumber, String emial) {
        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if(boardEntity == null) return DeleteBoardResponseDto.noExistBoard();

            imageRepository.deleteByBoardNumber(boardNumber);
            commentRepository.deleteByBoardNumber(boardNumber);
            favoriteRepository.deleteByBoardNumber(boardNumber);

            boardRepository.delete(boardEntity);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return DeleteBoardResponseDto.success();
    }

    public ResponseEntity<? super PatchBoardResponseDto> patchBoard (PatchBoardRequestDto dto , Long boardNumber, String email) {
        try {
            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if(boardEntity == null) return PatchBoardResponseDto.noExistBoard();

            String writerEmail = boardEntity.getWriterEmail();
            boolean isWriter = writerEmail.equals(email);
            if (!isWriter) return PatchBoardResponseDto.noPermission();

            boardEntity.patchBoard(dto);

            boardRepository.save(boardEntity);

            imageRepository.deleteByBoardNumber(boardNumber);
            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String image: boardImageList) {
                ImageEntity imageEntity = new ImageEntity(boardNumber, image);
                imageEntities.add((imageEntity));
            }

            imageRepository.saveAll(imageEntities);

        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PatchBoardResponseDto.success();
    }

    public ResponseEntity<? super GetLatestBoardListResponseDto> getLatestBoardList () {

        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {
            boardListViewEntities = boardListViewRepository.findByOrderByWriteDatetimeDesc();
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetLatestBoardListResponseDto.success(boardListViewEntities);
    }

    public ResponseEntity<? super GetTop3BoardListResponseDto> getTpo3BoardList () {

        List<BoardListViewEntity> boardListViewEntities = new ArrayList<>();

        try {
            Date beforeWeek = Date.from(Instant.now().minus(7, ChronoUnit.DAYS));
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String sevenDaysAgo = simpleDateFormat.format(beforeWeek);
            boardListViewEntities = boardListViewRepository.findTop3ByWriteDatetimeGreaterThanOrderByFavoriteCountDescCommentCountDescViewCountDescWriteDatetimeDesc(sevenDaysAgo);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetTop3BoardListResponseDto.success(boardListViewEntities);
    }

    public ResponseEntity<? super GetSearchBoardListResponseDto> getSearchBoardList (String searchWord, String preSearchWord) {

        List<GetBoardListResultSet> resultSets = new ArrayList<>();

        try {
            //resultSets = boardRepository.findByTitleContainsOrContentContainsOrAddressContainsOrderByWriteDatetimeDesc(searchWord, searchWord, searchWord);
            List<ElasticsearchEntity> elasticsearchEntities = elasticsearchBoardRepository.findByTitleContainingOrContentContainingOrAddressContaining(searchWord, searchWord, searchWord);


            for (ElasticsearchEntity entity : elasticsearchEntities) {
                GetBoardListResultSet resultSet = new GetBoardListResultSet(
                        entity.getBoardNumber(),
                        entity.getTitle(),
                        entity.getContent(),
                        entity.getAddress(),
                        entity.getWriteDatetime(),
                        entity.getWriterEmail(),
                        entity.getBoardImageList()
                );
                resultSets.add(resultSet);
            }
                //SearchLogEntity searchLogEntity = new SearchLogEntity(searchWord, preSearchWord, false);
                //searchLogRepository.save(searchLogEntity);
                MongoSearchLog mongoSearchLog = new MongoSearchLog(searchWord, preSearchWord, false);
                mongoSearchLogRepository.save(mongoSearchLog);

                boolean relation = preSearchWord != null;

                if (relation) {
                    //searchLogEntity = new SearchLogEntity(preSearchWord, searchWord, relation);
                    //searchLogRepository.save(searchLogEntity);
                    mongoSearchLog = new MongoSearchLog(preSearchWord, searchWord, relation);
                    mongoSearchLogRepository.save(mongoSearchLog);
                }

            }
         catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetSearchBoardListResponseDto.success(resultSets);
    }


    public ResponseEntity<? super GetUserBoardListResponseDto> getUserBoardList (String email) {

        List<GetBoardListResultSet> resultSets = new ArrayList<>();

        try {
        boolean existedUser = userRespository.existsByEmail(email);
        if (!existedUser) return GetUserBoardListResponseDto.noExistUser();

            resultSets = boardRepository.fineByWriterEmail(email);
        }
        catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetUserBoardListResponseDto.success(resultSets);
    }

}
