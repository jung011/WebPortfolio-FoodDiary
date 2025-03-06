import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import './style.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BOARD_PATH, BOARD_DETAIL_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, LOGIN_PATH, MAIN_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { useBoardStore, useLoginUserStore } from 'stores';
import { fileUploadReqeust, patchBoardRequest, postBoardRequest } from 'apis';
import { PostBoardRequestDto, PatchBoardRequestDto } from 'apis/request/board';
import { PatchBoardResponseDto, PostBoardResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';




export default function Header() {
  //          state:          //
  //login
  const [isLogin, setLogin] = useState<boolean>(true);

  const [isLoginPage, setLoginPage] = useState<boolean>(false);
  const [isMainPage, setMainPage] = useState<boolean>(false);
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
  const [isUserPage, setUserPage] = useState<boolean>(false);
  
  //          variable:          //
  const {pathname} = useLocation();
  //login
  const [cookies, setCookie] = useCookies();
  const {loginUser, setLoginUser, resetLoginUser} = useLoginUserStore();
  
  const navigate = useNavigate();
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  }

  //          component: SearchButton          //
  const SearchButton = () => {
    const {searchWord} = useParams();
    const searchButtonRef = useRef<HTMLDivElement | null>(null);
    //검색버튼 상태
    const [status, setStatus] = useState<boolean>(false);
    //검색어 상태
    const [word, setWord] = useState<string>('');

    //검색어 변경 이벤트
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setWord(value);
    };
    //검색 키 이벤트
    const onSearchWordKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!searchButtonRef.current) return;
      searchButtonRef.current.click();
    };
    //검색버튼 클릭
    const onSearchButtonClickHandler = () => {
      if(!status){
        setStatus(!status);
        return;
      }
      navigate(SEARCH_PATH(word));
    };

    useEffect(() => {
      if(searchWord) {
        setWord(searchWord);
        setStatus(true);
      }
    },[searchWord])

    // 검색버튼 클릭 false 상태
    if(!status){
      return(
        <div className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      );
    }
    // 검색버튼 클릭 true 상태
    return (
      <div className='header-search-input-box'>
        <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}></input>
        <div className='icon-button' ref={searchButtonRef} onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      </div>
    );
  }

  //          component: MypageButton          //
  const MypageButton = () => {

    const {userEmail} = useParams();
   
    const onMyPageButtonClickHanlder = () => {
      //login
      if(!loginUser) return;
      const {email} = loginUser;
      navigate(USER_PATH(email));
    }

    const onSignOutButtonClickHanlder = () => {
      resetLoginUser();
      setCookie('accessToken', '', {path:MAIN_PATH(), expires: new Date()});
      navigate(MAIN_PATH());
    }

    const onSignInButtonClickHanlder = () => {
      navigate(LOGIN_PATH());
    }

    if(isLogin && userEmail === loginUser?.email)
      return <div className='white-button' onClick={onSignOutButtonClickHanlder}>{'로그아웃'}</div>

    if(isLogin) 
      return <div className='white-button' onClick={onMyPageButtonClickHanlder}>{'마이페이지'}</div>
    
    return <div className='black-button' onClick={onSignInButtonClickHanlder}>{'로그인'}</div>
  }

  //          component: UploadButton          //
  const UploadButton = () => {

    const {boardNumber} = useParams();
    const {title, content, address, boardImageFileList, resetBoard} = useBoardStore();
   
    const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const {code} = responseBody;
      if (code === 'AF' || code === 'NU') navigate(LOGIN_PATH());
      if (code === 'VF') alert('제목과 주소와 설명은 필수입니다.');
      if (code === 'DBE') alert('데이터베이스 오류입니다');
      if (code !== 'SU') return;
      
      resetBoard();
      //login
       if (!loginUser) return;
      const {email} = loginUser;
      navigate(USER_PATH(email));
    }

    const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      const {code} = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다');
      if (code === 'AF' || code === 'NU' || code === 'NB' || code === 'NP') navigate(LOGIN_PATH());
      if (code === 'VF') alert('제목과 주소와 설명은 필수입니다.');
      if (code !== 'SU') return;

      if (!boardNumber) return;
      navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
    } 

    const onUploagButtonClickHandler = async () => {
      
      //login
      const accessToken = cookies.accessToken;
      if (!accessToken) return;

      const boardImageList: string[] = [];
      for (const file of boardImageFileList) {
        const data = new FormData();
        data.append('file', file);

        const url = await fileUploadReqeust(data);
        if (url) boardImageList.push(url);
      }

      const isWriterPage = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();
      if (isWriterPage) {
        const requestBody : PostBoardRequestDto = {
          title, content, address, boardImageList
        }
        postBoardRequest(requestBody, accessToken).then(postBoardResponse);
      }
      else {
        if (!boardNumber) return;
        const requestBody: PatchBoardRequestDto = {
          title, content, address, boardImageList
        }
        patchBoardRequest(boardNumber,requestBody, accessToken).then(patchBoardResponse);
      }

    }

    if(title && content && address)
      return <div className='black-button'onClick={onUploagButtonClickHandler}>{'업로드'}</div>
    
    return <div className='disable-button'>{'업로드'}</div>
  }

  //          effect:           //
  useEffect(() => {
    const isLoginPage = pathname.startsWith(LOGIN_PATH());
    setLoginPage(isLoginPage);
    const isMainPage = pathname === MAIN_PATH();
    setMainPage(isMainPage);
    const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
    setSearchPage(isSearchPage);
    const isBoardDetailPage = pathname.startsWith(BOARD_PATH()  + '/' + BOARD_DETAIL_PATH(''));
    setBoardDetailPage(isBoardDetailPage);
    const isBoardWritePage = pathname.startsWith(BOARD_PATH()  + '/' + BOARD_WRITE_PATH());
    setBoardWritePage(isBoardWritePage);
    const isBoardUpdatePage = pathname.startsWith(BOARD_PATH()  + '/' + BOARD_UPDATE_PATH(''));
    setBoardUpdatePage(isBoardUpdatePage);
    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
  }, [pathname])

  useEffect(() => {
    setLogin(loginUser !== null);
  }, [loginUser])

  //          render: Main          //
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon logo-dark-icon'></div>
          </div>
          <div className='header-logo'>{'Food Diary'}</div>
        </div>
        <div className='header-right-box'>
          {(isLoginPage || isMainPage || isSearchPage || isBoardDetailPage) && <SearchButton></SearchButton>}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage) && <MypageButton></MypageButton>}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton></UploadButton>}
          
        </div>
      </div>
    </div>
  )
}
