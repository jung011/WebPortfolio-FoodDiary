import React, { ChangeEvent, use, useEffect, useRef, useState } from 'react'
import './style.css'
import { BoardListItem, BoardMainListItem, User } from 'types/interface';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useNavigate, useParams } from 'react-router-dom';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { useLoginUserStore } from 'stores';
import { BOARD_PATH, BOARD_WRITE_PATH, LOGIN_PATH, MAIN_PATH, USER_PATH } from 'constant';
import { fileUploadReqeust, getUserBoardListRequest, getUserRequest, patchNicknameRequest, patchProfileImageRequest } from 'apis';
import { GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { PatchNicknameRequestDto, PatcProfileImageRequestDto } from 'apis/request/user';
import { useCookies } from 'react-cookie';
import { GetUserBoardListResponseDto } from 'apis/response/board';

export default function UserPage() {

  const [cookies, setCookies] = useCookies();
  const [isMypage, setMypage] = useState<boolean>(true);
  const {userEmail} = useParams();
  const navigate = useNavigate();
  //login
  const {loginUser} = useLoginUserStore();

  //          component: Top          //
  const UserTop = () => {

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [isNicknameChange, setNicknameChange] = useState<boolean>(false);
    const [nickname, setNickname] = useState<string>('');
    const [changeNickname, setChangeNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    //const [user, setUser] = useState<User | null>(null);

    //          function : Response          //
    const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
      if(!responseBody) return;

      const {code} = responseBody;
      if (code === 'NU') alert ('존재하지 않는 유저입니다');
      if (code === 'DBE') alert ('데이터베이스 오류입니다');
      if (code !== 'SU') {
        navigate(MAIN_PATH()); 
        return;
      }

      const { email, nickname, profileImage } = responseBody as GetUserResponseDto;
      setNickname(nickname);
      setProfileImage(profileImage);
      const isMypage = email === loginUser?.email;
      if (!isMypage) setMypage(false);
    }

    const fileUploadResponse = (profileImage: string | null) => {
      if(!profileImage) return;
      
      
      if(!cookies.accessToken) return;
      const requestBody : PatcProfileImageRequestDto = {profileImage};
      patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
    }

    const patchProfileImageResponse = (responseBody : PatchProfileImageResponseDto | ResponseDto | null) => {
      if(!responseBody) return;

      const {code} = responseBody;
      if (code === 'AF') alert ('인증에 실패했습니다');
      if (code === 'NU') alert ('존재하지 않는 유저입니다');
      if (code === 'DBE') alert ('데이터베이스 오류입니다');
      if (code !== 'SU') return;

      if(!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
    }

    const patchNicknameResponse = (responseBody : PatchNicknameResponseDto | ResponseDto | null) => {
      if(!responseBody) return;

      const {code} = responseBody;
      if (code === 'VF') alert ('닉네임은 필수입니다');
      if (code === 'AF') alert ('인증에 실패했습니다');
      if (code === 'DN') alert ('중복되는 닉네임입니다');
      if (code === 'NU') alert ('존재하지 않는 유저입니다');
      if (code === 'DBE') alert ('데이터베이스 오류입니다');
      if (code !== 'SU') return;
  
      if(!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse);
      setNicknameChange(false);
    }
    
   

    //          event handler : Click            //
    const onProfileBoxClickHandler = () => {
      if(!isMypage) return;
     if(!imageInputRef.current) return;
     imageInputRef.current.click();
    }

    const onNicknameEditButtonClickHandler = () => {
      if (!isNicknameChange) {
        setChangeNickname(nickname);
        setNicknameChange(!isNicknameChange);
        return;
      }
      if (!cookies.accessToken) return;
        const requestBody : PatchNicknameRequestDto = {
          nickname: changeNickname
        };
        patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
      
    }
    //          event handler : Change           //
    const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || !event.target.files.length) return;
      const file = event.target.files[0];
      const data = new FormData();
      data.append('file' ,file);

      fileUploadReqeust(data).then(fileUploadResponse);
    }

    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setChangeNickname(value);
    }
    //          effect:  Top            //
    useEffect(() => {
      if(!userEmail) return;
      getUserRequest(userEmail).then(getUserResponse)
    }, [userEmail]);

    //          render: Top         //
    // if(!user) return(<></>);
    return (
      <div id='user-top-wrapper'>
        <div className='user-top-container'>
          {isMypage ?
          <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
            {profileImage !== null ?
            <div className='user-top-profile-image' style={{backgroundImage: `url(${profileImage})`}}></div> :
            <div className='icon-box-large'>
              <div className='icon image-box-white-icon'></div>
            </div>
            }
            <input ref={imageInputRef} type='file' accept='image/*' style={{display:'none'}} onChange={onProfileImageChangeHandler}></input>
            </div> :
          <div className='user-top-profile-image-box' style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div> 
          }
          <div className='user-top-info-box'>
            <div className='user-top-info-nickname-box'>
              {isMypage ? 
              <>
              {isNicknameChange ? 
              <input className='user-top-info-nickname-input' type='text' size={nickname.length + 2} value={changeNickname} onChange={onNicknameChangeHandler}></input> :
              <div className='user-top-info-nickname'>{nickname}</div>   
              }
              <div className='icon-button' onClick={onNicknameEditButtonClickHandler}>
                <div className='icon edit-icon'></div>
              </div>
              </> :
              <div className='user-top-info-nickname'>{nickname}</div>
              } 
            </div>
            <div className='user-top-info-email'>{userEmail}</div>
          </div>
        </div>
      </div>
    );
  }
//          component: Bottom          //
  const UserBottom = () => {
    
    const [count, setCount] = useState<number>(0);
    const [userBoardList, setUserBoardList] = useState<BoardMainListItem[]>([]);

    //          function : Bottom Response          //
    const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
      if (!responseBody) return;
      
      const {code} = responseBody;
      if (code === 'NU') {
        alert('존재하지 않는 유저입니다');
        navigate(MAIN_PATH())
        return;
      }
      if (code === 'DBE') alert('데이터베이스 오류입니다');
      if (code !=='SU') return;
  
      const {userBoardList} = responseBody as GetUserBoardListResponseDto; 
      setUserBoardList(userBoardList);
      setCount(userBoardList.length);
    }
    //          event handler : Bottom Click          //
    const onSideCardClickHandler = () => {
      if (isMypage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
      else if (loginUser) navigate(USER_PATH(loginUser.email));
    }
    //          effect : Bottom          //
    useEffect(() => {
     if(!userEmail) return
     getUserBoardListRequest(userEmail).then(getUserBoardListResponse);
    }, [userEmail])
    //          render : Bottom          //
    return (
      <div id='user-bottom-wrapper'>
        <div className='user-bottom-container'>
          <div className='user-bottom-title-box'>
            <div className='user-bottom-title'>{isMypage ? '내 게시물 ' : '게시물 '}<span className='emphasis'>{count}</span></div>
            <div className='user-bottom-side-box'>
              <div className='user-bottom-side-card' onClick={onSideCardClickHandler}>
                <div className='user-bottom-side-container'>
                  {isMypage ?
                  <>
                  <div className='icon-box'>
                    <div className='icon edit-icon'></div>
                  </div>
                  <div className='user-bottom-side-text'>{'글쓰기'}</div>
                  </> :
                  <>
                  <div className='user-bottom-side-text'>{'내 게시물로 가기'}</div>
                  <div className='icon-box'>
                    <div className='icon arrow-right-icon'></div>
                  </div>
                  </>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='user-bottom-contents-box'>
            {count === 0 ? 
            <div className='user-bottom-contents-nothing'>{'게시물이 없습니다'}</div> :
            <div className='user-bottom-contents'>
              {userBoardList.map(boardListItem => <BoardItem boardListItem={boardListItem}></BoardItem>)}
            </div>
            }
          </div>
          <div className='user-bottom-pagination-box'></div>
        </div>
      </div>
    );
  }
//          render: Main          //
  return (
    <>
    <UserTop></UserTop>
    <UserBottom></UserBottom>
    </>
  )
}
