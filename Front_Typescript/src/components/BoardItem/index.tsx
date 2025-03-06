import React from "react";
import "./style.css";
import { BoardListItem, BoardMainListItem } from "types/interface";
import { useNavigate } from "react-router-dom";
import DefaultProfileImage from 'assets/image/default-profile-image.png'
import { BOARD_DETAIL_PATH, BOARD_PATH } from "constant";
import { GetBoardListResponseDto } from "apis/response/board";

interface Props {
  boardListItem: BoardMainListItem
}

export default function BoardItem({boardListItem}:Props) {

  const {boardNumber,boardImageList} = boardListItem;
  

  const navigator = useNavigate();

  const onClickHandler = () => {
    navigator(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
  }

  return (
    <div className="board-list-item" onClick={onClickHandler}>
      {boardImageList !== null ? (
        <div className='board-list-item-image-box'>
        <div className='board-list-item-image' style={{backgroundImage: `url(${boardImageList})`}}></div>
      </div>
      ) : (
        <div className='board-list-item-image-box'>
        <div className='board-list-item-image' style={{backgroundImage: `url(${DefaultProfileImage})`}}></div>
        </div>
      )}
    </div>
  );
}
