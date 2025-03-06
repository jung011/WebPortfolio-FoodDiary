import React from 'react'
import './style.css'
import { CommentListItem } from 'types/interface'
import dayjs from 'dayjs';
import DefaultProfileImage from 'assets/image/default-profile-image.png'
import { useNavigate } from 'react-router-dom';
import { USER_PATH } from 'constant';
import { useLoginUserStore } from 'stores';

interface Props {
    commentListItem: CommentListItem;
}

export default function CommentItem({commentListItem}: Props) {

    const {nickname, profileImage, writeDatetime, comment, email} = commentListItem;

    const {loginUser} = useLoginUserStore();

    const navigate = useNavigate();

    const getElapsedTime = () => {
    const now = dayjs().add(0, 'hour');
    const writeTime = dayjs(writeDatetime);
    const gap = now.diff(writeTime, 's');

      if(gap < 60) return `${gap}초 전`;
      if(gap < 3600) return `${Math.floor(gap / 60)}분 전`;
      if(gap < 86400) return `${Math.floor(gap / 3600)}시간 전`;
      return `${Math.floor(gap / 86400)}일 전`;
    }

    const onProfileImageButtonClickHandler = () => {
      if(!loginUser) return;
        navigate(USER_PATH(email)); 
    }

  return (
    <div className='comment-list-item'>
      <div className='comment-list-item-top'>
         <div className={!loginUser ? 'disable-comment-list-item-profile-box' :'comment-list-item-profile-box'} onClick={onProfileImageButtonClickHandler}>
            <div className='comment-list-item-profile-image' style={{backgroundImage: `url(${profileImage ? profileImage : DefaultProfileImage})`}}></div>
         </div>
         <div className='comment-list-item-nickname'>{nickname}</div>
         <div className='comment-list-item-divider'>{'\|'}</div>
         <div className='comment-list-item-time'>{getElapsedTime()}</div>
      </div>
      <div className='comment-list-item-main'>
        <div className='comment-list-item-content'>{comment}</div>
      </div>
    </div>
  )
}
