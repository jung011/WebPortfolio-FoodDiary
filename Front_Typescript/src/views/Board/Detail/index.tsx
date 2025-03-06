import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import FavoriteItem from 'components/FavoriteItem';
import { Board, CommentListItem, FavoriteListItem } from 'types/interface';
import { boardMock, commentListMock, favoriteListMock } from 'mocks';
import CommentItem from 'components/CommentItem';
import Pagination from 'components/pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { deleteBoardRequest, getBoardRequest, getCommentListRequest, getFavoriteListRequest, increaseViewCountRequest, postCommentRequest, putFavoriteRequest } from 'apis';
import GetBoardResponseDto from 'apis/response/board/get-board.response.dto';
import { ResponseDto } from 'apis/response';
import { DeleteBoardResponseDto, GetCommentListResponseDto, GetFavoriteListResponseDto, IncreaseViewCountResponseDto, PostCommentResponeDto, PutFavoriteResponseDto } from 'apis/response/board';
import dayjs from 'dayjs';
import { useCookies } from 'react-cookie';
import { PostCommentRequestDto } from 'apis/request/board';
import usePaginamtion from 'hooks/pagination.hook';

export default function BoardDetailPage() {

  //          state:           //
  
  //login
  const {loginUser} = useLoginUserStore();
  const [cookies, setCookies] = useCookies();

  const {boardNumber} = useParams();
  const navigator = useNavigate();

  const increaseViewCountResponse = (responseBody : IncreaseViewCountResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code === 'NB') alert('존재하지 않는 게시물입니다');
    if(code === 'DBE') alert('데이터베이스 오류입니다');
  }

  //          event handler:          //
  

  //          COMPONENT: BoardDetail TOP           //
  const BoardDetailTop = () => {
    
    const [isWriter, setWriter] = useState<boolean>(false);
    const [board, setBoard] = useState<Board | null> (null);
    const [showMore, setShoreMore] = useState<boolean>(false);

    const getWriteDatetimeFormat = () => {
      if (!board) return '';
      const date = dayjs(board.writeDatetime);
      return date.format('YYYY. MM. DD.');
    }

    const getBoardResponse = (responseBody:GetBoardResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'NB') alert('존재하지 않는 게시물입니다');
      if(code === 'DBE') alert('데이터베이스 오류입니다');
      if(code !== 'SU') {
        navigator(MAIN_PATH());
        return;
      }
      const board: Board = { ...responseBody as GetBoardResponseDto};
      setBoard(board);

      //login
      if (!loginUser) {
        setWriter(false);
        return;
      }
      const isWriter = loginUser.email === board.writerEmail;
      setWriter(isWriter);
    }

    const deleteBoardResponse = (responseBody: DeleteBoardResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'VF') alert('잘못된 접근입니다');
      if(code === 'NU') alert('존재하지 않는 유저입니다');
      if(code === 'NB') alert('존재하지 않는 게시물입니다');
      if(code === 'AF') alert('인증에 실패했습니다');
      if(code === 'NP') alert('권한이 없습니다');
      if(code === 'DBE') alert('데이터베이스 오류입니다');
      if(code !== 'SU') return;

      navigator(MAIN_PATH());
    }


    //          event handler: BoardDetail TOP Click          //
    const onNicknameButtonClickHandler = () => {
      if(!board) return;
      if(!loginUser) return;

      navigator(USER_PATH(board.writerEmail));
    }

    const onMoreButtonClickHandler = () => {
      setShoreMore(!showMore);
    }

    const onUpdateButtonClickHandler = () => {
      //logine
       if(!board || !loginUser) return;
       if(loginUser.email !== board.writerEmail) return;
       if(!board) return;
      navigator(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(board.boardNumber));
    }

    const onDeleteButtonClickHandler = () => {
      //logine
      if(!board || !loginUser || !boardNumber || !cookies.accessToken) return;
      if(loginUser.email !== board.writerEmail) return;
      deleteBoardRequest(boardNumber, cookies.accessToken).then(deleteBoardResponse)
    }
    
    //          effect: BoardDetail TOP           //
    useEffect(() => {
      if(!boardNumber) {
        navigator(MAIN_PATH());
        return;
      }
      getBoardRequest(boardNumber).then(getBoardResponse);
    }, [boardNumber])

    //          render:  BoardDetail TOP          //
    if (!board) return <></>
    return (
      <div id='board-detail-top'>
        <div className='board-detail-top-header'>
          <div className='board-detail-title'>{board.title}</div>
          <div className='board-detail-top-sub-box'>
            <div className='board-detail-write-info-box'>
              <div className='board-detail-writer-profile-image'></div>
              <div className={!loginUser ? 'disable-board-detail-writer-nickname' :'board-detail-writer-nickname'} onClick={onNicknameButtonClickHandler}>{board.writerNickname}</div>
              <div className='board-detail-info-divider'>{'\|'}</div>
              <div className='board-detail-write-date'>{getWriteDatetimeFormat()}</div>
            </div>
            {isWriter &&  
            <div className='icon-button' onClick={onMoreButtonClickHandler}>
              <div className='icon more-icon'></div>
            </div>
            }
            {showMore &&
            <div className='board-detail-more-box'>
              <div className='board-detail-update-button' onClick={onUpdateButtonClickHandler}>{"수정"}</div>
              <div className='divider'></div>
              <div className='board-detail-delete-button'onClick={onDeleteButtonClickHandler}>{"삭제"}</div>
            </div>
            } 
          </div>
          
          </div>
        <div className='divider'></div>
        <div className='board-detail-top-main'>
          <div className='board-detail-main-text'>{board.content}</div>
          {board.boardImageList.map(image => <img className='board-detail-main-image' src={image}></img>)}
        </div>
        <div className='board-detail-address'>{board.address}</div>
      </div>
    )
  }

  //          COMPONENT: BoardDetail Bottom           //
  const BoardDetaillBottom = () => {
    
    const commentRef = useRef<HTMLTextAreaElement | null>(null)
    const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
    const {
      currentPage, setCurrentPage, currentSection, setCurrentSection, 
      viewList, viewPageList, totalSection, setTotalList
    } = usePaginamtion<CommentListItem>(3);
    //const [commentList, setCommentList] = useState<CommentListItem[]>([]);
    const [isFavorite, setFavorite] = useState<boolean>(false); 
    const [showFavorite, setShowFavorite] = useState<boolean>(false); 
    const [showComment, setShowComment] = useState<boolean>(false); 
    const [totalCommentCount, setTotalCommentCount] = useState<number>(0); 
    const [comment, setComment] = useState<string>(""); 

    const getFavoriteListResponse = (responseBody : GetFavoriteListResponseDto | ResponseDto | null) => {
      
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'NB') alert('존재하지 않는 게시물입니다');
      if(code === 'DBE') alert('데이터베이스 오류입니다');
      if(code !== 'SU') return;
      
      const {favoriteList} = responseBody as GetFavoriteListResponseDto;
      setFavoriteList(favoriteList);

      if(!loginUser) {
        setFavorite(false);
        return;
      }

      const isFavorite = favoriteList.findIndex(favorite => favorite.email === loginUser.email) !== -1;
      setFavorite(isFavorite);
    }

    const getCommentListResponse = (responseBody : GetCommentListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if(code === 'NB') alert('존재하지 않는 게시물입니다');
      if(code === 'DBE') alert('데이터베이스 오류입니다');
      if(code !== 'SU') return;
      
      const {commentList} = responseBody as GetCommentListResponseDto;
      setTotalList(commentList);
      setTotalCommentCount(commentList.length);

      // if(!loginUser) {
      //   setFavorite(false);
      //   return;
      // }

      // const isFavorite = favoritList.findIndex(favorite => favorite.email === loginUser.email) !== -1;
      // setFavorite(isFavorite);
    }

    const putFavoriteResponse = (responseBody: PutFavoriteResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if (code === 'VF') alert('잘못된 접근입니다');
      if (code === 'NU') alert('존재하지 않는 유저입니다');
      if (code === 'NB') alert('존재하지 않는 게시물입니다');
      if (code === 'AF') alert('인증에 실패했습니다');
      if (code === 'DBE') alert('데이터베이스 오류입니다');
      if (code !== 'SU') return;

      if (!boardNumber) return;
      getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
    }

    const postCommentResponse = (responseBody: PostCommentResponeDto | ResponseDto | null) => {
      if(!responseBody) return;
      const {code} = responseBody;
      if (code === 'VF') alert('잘못된 접근입니다');
      if (code === 'NU') alert('존재하지 않는 유저입니다');
      if (code === 'NB') alert('존재하지 않는 게시물입니다');
      if (code === 'AF') alert('인증에 실패했습니다');
      if (code === 'DBE') alert('데이터베이스 오류입니다');
      if (code !== 'SU') return;

      setComment('');
      if (!boardNumber) return;
      getCommentListRequest(boardNumber).then(getCommentListResponse);
    }
    
    //          event handler: BoardDetail Bottom Click          //
    const onFavoriteClickHandler = () => {
      if(!loginUser || !cookies.accessToken || !boardNumber) return;

      putFavoriteRequest(boardNumber, cookies.accessToken).then(putFavoriteResponse);
      setFavorite(!isFavorite);
    }

    const onShowFavoriteClickHandler = () => {
      setShowFavorite(!showFavorite);
    }

    const onShowCommentClickHandler = () => {
      setShowComment(!showComment);
    }

    const onCommentSubmitButtonClickHandler = () => {
      if(!comment || !boardNumber || !loginUser || !cookies.accessToken) return;

      const requestBody: PostCommentRequestDto = {comment: comment};
      postCommentRequest(boardNumber, requestBody, cookies.accessToken).then(postCommentResponse);
    }

    const onCommentChangekHandler = (event:ChangeEvent<HTMLTextAreaElement>) => {
      const{value} = event.target
      setComment(value);
      if(!commentRef.current) return;
      commentRef.current.style.height = 'auto';
      commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    }
    
    //          effect: BoardDetail Bottom           //
    useEffect(() => {
      if(!boardNumber) return;
      getFavoriteListRequest(boardNumber).then(getFavoriteListResponse);
      getCommentListRequest(boardNumber).then(getCommentListResponse);
    }, [boardNumber]);

    return (
      <div id='board-detail-bottom'>
        <div className='board-detail-bottom-button-box'>
        <div className='board-detail-bottom-button-group'>
            <div className={!loginUser ? 'favorite-disable-button' : 'icon-button'} onClick={onFavoriteClickHandler}>    
              {
                isFavorite ?  
                <div className='icon favorite-fill-icon'></div> :
                <div className='icon favorite-light-icon'></div>
              } 
            </div>
            <div className='board-detail-bottom-button-text'>{`좋아요 ${favoriteList.length}`}</div>
            <div className='icon-button' onClick={onShowFavoriteClickHandler}>
                {
                  showFavorite ? 
                  <div className='icon up-light-icon'></div> :
                  <div className='icon down-light-icon'></div>
                }
             
          </div>
          </div>
          <div className='board-detail-bottom-button-group'>
            <div className='icon-button'>
              <div className='icon comment-icon'></div>
            </div>
            <div className='board-detail-bottom-button-text'>{`댓글 ${totalCommentCount}`}</div>
            <div className='icon-button' onClick={onShowCommentClickHandler}>
                {
                  showComment ? 
                  <div className='icon up-light-icon'></div> :
                  <div className='icon down-light-icon'></div>
                }
            </div>
          </div>
        </div>
        {showFavorite &&
        <div className='board-detail-bottom-favorite-box'>
        <div className='board-detail-bottom-favorite-container'>
          <div className='board-detail-bottom-favorite-title'>{'좋아요'}<span className='emphasis'>{favoriteList.length}</span></div>
          <div className='board-detail-bottom-favorite-contents'>
             {favoriteList.map(item =>  <FavoriteItem favoriteListItem={item}></FavoriteItem>)}
          </div>
        </div>
        </div>
         }
         {showComment && 
        <div className='board-detail-bottom-comment-box'>
        <div className='board-detail-bottom-comment-container'>
          <div className='board-detail-bottom-comment-title'>{'댓글'}<span className='emphasis'>{totalCommentCount}</span></div>
          <div className='board-detail-bottom-comment-list-container'>
          {viewList.map(item => <CommentItem commentListItem={item}></CommentItem>)}
          </div>
        </div>
        <div className='divider'></div>
        <div className='board-detail-bottom-comment-pagination-box'>
          <Pagination
            currentPage={currentPage}
            currentSection={currentSection}
            setCurrentPage={setCurrentPage}
            setCurrentSection={setCurrentSection}
            viewPageList={viewPageList}
            totalSection={totalSection}
          ></Pagination>
        </div>
          
        {loginUser !== null && 
        <div className='board-detail-bottom-comment-input-box'>
          <div className='board-detail-bottom-comment-input-container'>
            <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요' value={comment} onChange={onCommentChangekHandler}></textarea>
            <div className='board-detail-bottom-comment-button-box'>
              <div className={comment ==='' ? 'disable-button' : 'black-button'} onClick={onCommentSubmitButtonClickHandler}>{'댓글달기'}</div>
            </div>
        </div>
        </div>
        } 
        </div>
        }
      </div>
    );
  };
//          effect: Main          //
let effectFlag = true;
useEffect(() => {
  if(!boardNumber) return;
  if(effectFlag) {
    effectFlag = false;
    return;
  }
  increaseViewCountRequest(boardNumber).then(increaseViewCountResponse);
}, [boardNumber])

//          render: MAIN           //
  return (
    <div id='board-detail-wrapper'>
       <div className='board-detail-container'>
        <BoardDetailTop></BoardDetailTop>
        <BoardDetaillBottom></BoardDetaillBottom>
       </div>
    </div>
  )
}
