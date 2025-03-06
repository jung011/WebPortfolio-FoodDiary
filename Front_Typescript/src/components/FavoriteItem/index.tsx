import React from 'react'
import './style.css'
import { FavoriteListItem } from 'types/interface'
import DefaultProfileImage from 'assets/image/default-profile-image.png'
import { useNavigate } from 'react-router-dom'
import { USER_PATH } from 'constant'
import { useLoginUserStore } from 'stores'

interface Props{
    favoriteListItem: FavoriteListItem
}

export default function FavoriteItem({favoriteListItem}: Props) {
  
    const{profileImage, nickname, email} = favoriteListItem

    const {loginUser} = useLoginUserStore();

    const navigate = useNavigate();

    const onProfileImageButtonClickHandler = () => {
            if(!loginUser) return;
            navigate(USER_PATH(email)); 
        }
  
    return (
    <div className='favorite-list-item'>
        <div className= {!loginUser ? 'disable-favorite-list-item-profile-box' :'favorite-list-item-profile-box'} onClick={onProfileImageButtonClickHandler}>
            <div className='favorite-list-item-profile-image' style={{backgroundImage: `url(${profileImage ? profileImage : DefaultProfileImage})`}}></div>
        </div>
        <div className='favorite-list-item-nickname'>{nickname}</div>
    </div>
  )
}
