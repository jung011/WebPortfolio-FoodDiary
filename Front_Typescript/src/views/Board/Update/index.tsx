import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useBoardStore, useLoginUserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { getBoardRequest } from 'apis';
import { GetBoardResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { convertUrlsToFile } from 'utils';
import { User } from 'types/interface';

export default function BoardUpdatePage() {

  //          state:          //
  const titleRef = useRef<HTMLTextAreaElement | null> (null);
  const addressRef = useRef<HTMLTextAreaElement | null> (null);
  const contentRef = useRef<HTMLTextAreaElement | null> (null);
  const imageInputRef = useRef<HTMLInputElement | null> (null);
  const {boardNumber} = useParams();
  
  const {title, setTitle} = useBoardStore();
  const {address, setAddress} = useBoardStore();
  const {content, setContent} = useBoardStore();
  const {boardImageFileList, setBoardImageFielList} = useBoardStore();
  const {resetBoard} = useBoardStore();
       
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  //          state:Login          //
  const {loginUser} = useLoginUserStore();
  const [cookies, setCookies] = useCookies();

  const navigator = useNavigate();

  const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const {code} = responseBody;
    if(code === 'NB') alert('존재하지 않는 게시물입니다');
    if(code === 'DBE') alert('데이터베이스 오류입니다');
    if(code !== 'SU') {
      navigator(MAIN_PATH());
      return;
    }
    const {title, content, boardImageList, writerEmail, address} = responseBody as GetBoardResponseDto;
    setTitle(title);
    setContent(content);
    setAddress(address);
    setImageUrls(boardImageList);
    convertUrlsToFile(boardImageList).then(boardImageFileList => setBoardImageFielList(boardImageFileList));

     if(!loginUser || loginUser.email !== writerEmail) {
       navigator(MAIN_PATH());
       return;
     }


    if (!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  }

  //          event handler:          //
  const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setTitle(value);

    //스크롤 제거
    if(!titleRef.current) return;
    titleRef.current.style.height = 'auto';
    titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
  }

  const onAddressChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setAddress(value);

    //스크롤 제거
    if(!addressRef.current) return;
    addressRef.current.style.height = 'auto';
    addressRef.current.style.height = `${addressRef.current.scrollHeight}px`;
  }

  const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const {value} = event.target;
    setContent(value);

    //스크롤 제거
    if(!contentRef.current) return;
    contentRef.current.style.height = 'auto';
    contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
  }

  const onImageChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) return;
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    const newImageUrls = imageUrls.map(item => item);
    newImageUrls.push(imageUrl);
    setImageUrls(newImageUrls);

    //서버 업로드
    const newBoardImageFileList = boardImageFileList.map(item => item);
    newBoardImageFileList.push(file);
    setBoardImageFielList(newBoardImageFileList);

    //중복이미지 허용
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';
  }

  const onImageUploadButtonClickHandler = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.click();
  }

  const onImageCloseButtonClickHandler = (deleteIndex:number) => {
    if (!imageInputRef.current) return;
    imageInputRef.current.value = '';

    const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
    setImageUrls(newImageUrls);

    const newBoardImageFileList = boardImageFileList.filter((url, index) => index !== deleteIndex);
    setBoardImageFielList(newBoardImageFileList);
  }

   //          effect:Main          //
  useEffect(() => {
    //Login
    
    const accessToken = cookies.accessToken;
    if(!accessToken) {
      navigator(MAIN_PATH());
      return;
    }

    if (!boardNumber) return;
    getBoardRequest(boardNumber).then(getBoardResponse);

  }, [boardNumber])

  //          render: Main          //
  return (
    <div id='board-update-wrapper'>
      <div className='board-update-container'>
        <div className='board-update-box'>
          <div className='board-update-title-box'>
            <textarea ref={titleRef} className='board-update-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler}></textarea>
          </div>
          <div className='divider'></div>
          <textarea ref={addressRef} className='board-update-address-textarea' rows={1} placeholder='주소를 작성해주세요.' value={address} onChange={onAddressChangeHandler}></textarea>
          <div className='divider'></div>
          <div className='board-update-content-box'>
            <textarea ref={contentRef} className='board-update-content-textarea' placeholder='소개글을 작성해주세요' value={content} onChange={onContentChangeHandler}></textarea>
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' accept='image/*' style={{display:'none'}} onChange={onImageChangeHandler}></input>
          </div>
          <div className='board-update-images-box'>
            {imageUrls.map((imageUrl, index) => 
                <div className='board-update-image-box'>
                <img className='board-update-image' src={imageUrl}></img>
                <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                  <div className='icon close-icon'></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
