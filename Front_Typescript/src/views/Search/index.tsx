import React, { useEffect, useState } from 'react'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import { BoardListItem, BoardMainListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { SEARCH_PATH } from 'constant';
import { getRelationListRequest, getSearchBoardListRequest } from 'apis';
import { GetSearchBoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { GetRelationListResponseDto } from 'apis/response/search';

export default function SearchPage() {

  const {searchWord} = useParams();
  const [preSearchWord, setPreSearchWord] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const [searchBoardList, setSearchBoardList] = useState<BoardMainListItem[]>([]);
  const [relationWordList, setRelationWordList] = useState<string[]>([]);

  const navigate = useNavigate();

  //          function : Response          //
  const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const {code} = responseBody;
    if (code === 'DBE') alert ('데이터베이스 오류입니다');
    if (code !== 'SU') return;

    if(!searchWord) return;
    const {searchList} = responseBody as GetSearchBoardListResponseDto;
    setSearchBoardList(searchList);
    setCount(searchList.length);
    setPreSearchWord(searchWord);
  }

  const getRelationListResponse = (responseBody: GetRelationListResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const {code} = responseBody;
    if (code === 'DBE') alert ('데이터베이스 오류입니다');
    if (code !== 'SU') return;

    if(!searchWord) return;
    const {relativeWordList} = responseBody as GetRelationListResponseDto;
    setRelationWordList(relativeWordList);
  }
  //          event handler: Click          //
  const onRelationWordClickHandler = (word:string) => {
    navigate(SEARCH_PATH(word));
  }

  //          effect:          //
  useEffect(() => {
    if (!searchWord) return;
    getSearchBoardListRequest(searchWord, preSearchWord).then(getSearchBoardListResponse);
    getRelationListRequest(searchWord).then(getRelationListResponse);
  }, [searchWord]);
  //          render:          //
  if(!searchWord) return (<></>)
  return (
    <div id='search-wrapper'>
      <div className='search-container'>
        <div className='search-title-box'>
          <div className='search-title'><span className='search-title-emphasis'>{searchWord}</span>{'에 대한 검색결과 입니다.'}</div>
          <div className='search-count'>{count}</div>
        </div>
        <div className='search-contents-box'>
          {count === 0 ?
          <div className='search-contents-nothing'>{'검색 결과가 없습니다'}</div> :
          <div className='search-contents'>{searchBoardList.map(boardListItem => <BoardItem boardListItem={boardListItem}></BoardItem>)}</div>
          }
          <div className='search-relation-box'>
            <div className='search-relation-card'>
              <div className='search-relation-card-container'>
                <div className='search-relation-card-title'>{'관련 검색어'}</div>
                {relationWordList.length === 0 ?
                  <div className='search-relation-card-contents-nothing'>{'관련 검색어가 없습니다'}</div> :
                  <div className='search-relation-card-contents'>
                  {relationWordList.map(word => <div className='word-badge' onClick={() => onRelationWordClickHandler(word)}>{word}</div>)}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
