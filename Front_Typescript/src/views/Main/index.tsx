import React, { useEffect, useState } from 'react'
import './style.css'
import BoardItem from 'components/BoardItem'
import { latestBoardListMock } from 'mocks';
import { BoardListItem, BoardMainListItem } from 'types/interface';
import { getBoardListRequest } from 'apis';
import { GetBoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';

export default function MainPage() {

  

  const [totalBoardList, setTotalBoardList] = useState<BoardMainListItem[]>([]);

  const getBoardListResponse = (responseBody: GetBoardListResponseDto | ResponseDto | null) => {
     if (!responseBody) return;

    const {code} = responseBody;

    if (code === 'DBE') alert('데이터베이스 오류입니다');
    if (code !=='SU') return;

    const {boardMainList} = responseBody as GetBoardListResponseDto; 
       setTotalBoardList(boardMainList);

    // if ('boardMainList' in responseBody) {
    //   const boardMainList = responseBody.boardMainList as BoardMainListItem[]; // 명시적으로 타입을 지정
    //   console.log(boardMainList);
    //   setTotalBoardList(boardMainList);
    // } else {
    //   console.error('Error: Unexpected response format', responseBody);
    // }
  }

  useEffect(() => {
    //setTotalBoardList(latestBoardListMock);
    getBoardListRequest().then(getBoardListResponse)
  }, [])

  return (
    <div id='main-wrapper'>
      <div className='main-container'>
        {totalBoardList.map(boardListItem => <BoardItem boardListItem={boardListItem}></BoardItem>)}
      </div>
    </div>
  )
}
