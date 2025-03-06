import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import { useBoardStore, useLoginUserStore } from 'stores';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';

export default function BoardWritePage() {

  //          state:          //
  const titleRef = useRef<HTMLTextAreaElement | null> (null);
  const addressRef = useRef<HTMLTextAreaElement | null> (null);
  const contentRef = useRef<HTMLTextAreaElement | null> (null);
  const imageInputRef = useRef<HTMLInputElement | null> (null);
  
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

  const open = useDaumPostcodePopup();

  const onComplete = (data:Address) => {
    const {address} = data;
    setAddress(address);
  }

  //          event handler: changeHandler          //
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

  //          event handler: ClickHandler          //
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

  const onAddressSearchButtonClickHandler = () => {
    open({onComplete});
  }

   //          effect:Main          //
  useEffect(() => {
    //Login
    const accessToken = cookies.accessToken;
     if(!accessToken) {
        navigator(MAIN_PATH());
        return;
      }
    resetBoard();
  }, [])

  //          render: Main          //
  return (
    <div id='board-write-wrapper'>
      <div className='board-write-container'>
        <div className='board-write-box'>
          <div className='board-write-title-box'>
            <textarea ref={titleRef} className='board-write-title-textarea' rows={1} placeholder='(필수)제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler}></textarea>
          </div>
          <div className='divider'></div>
            <div className='board-write-address-box'>
              <textarea ref={addressRef} className='board-write-address-textarea' rows={1} placeholder='(필수)주소찾기' value={address} onChange={onAddressChangeHandler}></textarea>
              <div className='address-search-icon-box' onClick={onAddressSearchButtonClickHandler}>
                <div className='icon search-light-icon'></div>
              </div>
            </div>
          <div className='divider'></div>
          <div className='board-write-content-box'>
            <textarea ref={contentRef} className='board-write-content-textarea' placeholder='소개글을 작성해주세요' value={content} onChange={onContentChangeHandler}></textarea>
            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
              <div className='icon image-box-light-icon'></div>
            </div>
            <input ref={imageInputRef} type='file' accept='image/*' style={{display:'none'}} onChange={onImageChangeHandler}></input>
          </div>
          <div className='board-write-images-box'>
            {imageUrls.map((imageUrl, index) => 
                <div className='board-write-image-box'>
                <img className='board-write-image' src={imageUrl}></img>
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
