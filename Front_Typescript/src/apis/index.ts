import axios from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/login";
import { SignInResponseDto } from "./response/login";
import { ResponseDto } from "./response";
import { GetSignInUserResponseDto, GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from "./response/user";
import { PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto } from "./request/board";
import { PostBoardResponseDto, GetBoardResponseDto, IncreaseViewCountResponseDto, GetFavoriteListResponseDto, GetCommentListResponseDto, PutFavoriteResponseDto, PostCommentResponeDto, DeleteBoardResponseDto, PatchBoardResponseDto, GetSearchBoardListResponseDto, GetBoardListResponseDto, GetUserBoardListResponseDto } from "./response/board";
import { GetRelationListResponseDto } from "./response/search";
import { PatchNicknameRequestDto, PatcProfileImageRequestDto } from "./request/user";

const DOMAIN = 'http://localhost:8080';
const DOMAIN2 = 'http://localhost:8000';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
    const result = {headers: {Authorization: `Bearer ${accessToken}`}}
    return result
}

const SIGN_IN_URL = () => `${API_DOMAIN}/user/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/user/sign-up`;

export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const reponseBody: SignInResponseDto = response.data;
            return reponseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response => {
            const reponseBody: SignUpRequestDto = response.data;
            return reponseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
    
}
//          function: BOARD API          //
const GET_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/food/${boardNumber}`;
const GET_BOARD_LIST_URL = () => `${API_DOMAIN}/food`;
const DELETE_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/food/${boardNumber}`;
const PATCH_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/food/${boardNumber}`;

const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/food/search-list/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`;
const GET_RELATION_LIST_URL = (searchWord: string) => `${API_DOMAIN}/search/${searchWord}/relation-list`;

const GET_USER_BOARD_LIST_URL = (email: string) => `${API_DOMAIN}/food/user-board-list/${email}`;
const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;

const GET_FAOVRITE_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/food/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/food/${boardNumber}/comment-list`;
const POST_BOARD_URL = () => `${API_DOMAIN}/food`;
const PUT_FAOVRITE_URL = (boardNumber: number | string) => `${API_DOMAIN}/food/${boardNumber}/favorite`;
const POST_COMMENT_URL = (boardNumber: number | string) => `${API_DOMAIN}/food/${boardNumber}/comment`;
const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) => `${API_DOMAIN}/food/${boardNumber}/increase-view-count`;

export const patchNicknameRequest = async (requestBody: PatchNicknameRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
    .then(response => {
        const reponseBody: PatchNicknameResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const patchProfileImageRequest = async (requestBody: PatcProfileImageRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
    .then(response => {
        const reponseBody: PatchProfileImageResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}


export const getUserRequest = async (email: string) => {
    const result = await axios.get(GET_USER_URL(email))
    .then(response => {
        const reponseBody: GetUserResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const getUserBoardListRequest = async (email: string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(email))
    .then(response => {
        const reponseBody: GetUserBoardListResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const putFavoriteRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.put(PUT_FAOVRITE_URL(boardNumber), {}, authorization(accessToken))
    .then(response => {
        const reponseBody: PutFavoriteResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const postCommentRequest = async (boardNumber: number | string, requestBody: PostCommentRequestDto, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(boardNumber), requestBody, authorization(accessToken))
        .then(response => {
            const reponseBody: PostCommentResponeDto = response.data;
            return reponseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
    }


export const getFavoriteListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_FAOVRITE_LIST_URL(boardNumber))
    .then(response => {
        const reponseBody: GetFavoriteListResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}



export const getSearchBoardListRequest = async (searchWord: string , preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord))
    .then(response => {
        const reponseBody: GetSearchBoardListResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const getRelationListRequest = async (searchWord: string) => {
    const result = await axios.get(GET_RELATION_LIST_URL(searchWord))
    .then(response => {
        const reponseBody: GetRelationListResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const getCommentListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardNumber))
    .then(response => {
        const reponseBody: GetCommentListResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const increaseViewCountRequest = async (boardNumber: number | string) => {
    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardNumber))
    .then(response => {
        const reponseBody: IncreaseViewCountResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const getBoardListRequest = async () => {
    const result = await axios.get(GET_BOARD_LIST_URL())
    .then(response => {
        const reponseBody: GetBoardListResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

export const getBoardRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_BOARD_URL(boardNumber))
    .then(response => {
        const reponseBody: GetBoardResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

 export const deleteBoardRequest = async (boardNumber: number | string, accessToken: string) => {
     const result = await axios.delete(DELETE_BOARD_URL(boardNumber), authorization(accessToken))
    .then(response => {
        const reponseBody: DeleteBoardResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

 export const patchBoardRequest = async (boardNumber: number | string, requestBody: PatchBoardRequestDto, accessToken: string) => {
     const result = await axios.patch(PATCH_BOARD_URL(boardNumber), requestBody, authorization(accessToken))
    .then(response => {
        const reponseBody: PatchBoardResponseDto = response.data;
        return reponseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
return result;
}

//login
 export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
     const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const reponseBody: PostBoardResponseDto = response.data;
            return reponseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}


//          function: SignIn API          //
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;

export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response => {
            const reponseBody: GetSignInUserResponseDto = response.data;
            return reponseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

//          function: File API          //
const FILE_DOMAIN = `${DOMAIN2}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`
const multipartFormData = {headers: {'Content-Type': 'multipart/form-data'}};

export const fileUploadReqeust = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
    .then (response => {
        const responseBody: string = response.data;
        return responseBody;
    })
    .catch (error => {
        return null;
    })
    return result;
}