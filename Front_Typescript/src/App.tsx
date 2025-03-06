import React, { useEffect } from "react";
import "./App.css";
import BoardItem from "components/BoardItem";
import { commentListMock, favoriteListMock, latestBoardListMock, top3BoardListMock } from "mocks";
import Top3Item from "components/Top3Item";
import CommentItem from "components/CommentItem";
import FavoriteItem from "components/FavoriteItem";
import Footer from "layouts/Footer";
import { Route, Routes } from "react-router-dom";
import Container from "layouts/Container";
import { MAIN_PATH, SEARCH_PATH } from "constant";
import { LOGIN_PATH } from "constant";
import { USER_PATH } from "constant";
import { BOARD_PATH } from "constant";
import { BOARD_DETAIL_PATH } from "constant";
import { BOARD_WRITE_PATH } from "constant";
import { BOARD_UPDATE_PATH } from "constant";
import { useLoginUserStore } from "stores";
import { useCookies } from "react-cookie";
import { getSignInUserRequest } from "apis";
import { GetSignInUserResponseDto } from "apis/response/user";
import { ResponseDto } from "apis/response";
import { User } from "types/interface";
import UserPage from "views/User";
import SearchPage from "views/Search";
import LoginPage from "views/Login";
import MainPage from "views/Main";
import BoardDetailPage from "views/Board/Detail";
import BoardWritePage from "views/Board/Write";
import BoardUpdatePage from "views/Board/Update";

function App() {

  const {setLoginUser, resetLoginUser} = useLoginUserStore();
  const [cookies, setCookie] = useCookies();
  
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const {code} = responseBody;
    if (code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = {...responseBody as GetSignInUserResponseDto};
    setLoginUser(loginUser);
  }

  useEffect(() => {
    if(!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken])

  return(
    <Routes>
      <Route element={<Container></Container>}>
        <Route path={MAIN_PATH()} element={<MainPage></MainPage>}></Route>
        <Route path={LOGIN_PATH()} element={<LoginPage></LoginPage>}></Route>
        <Route path={USER_PATH(':userEmail')} element={<UserPage></UserPage>}></Route>
        <Route path={SEARCH_PATH(':searchWord')} element={<SearchPage></SearchPage>}></Route>

        <Route path={BOARD_PATH()}>
          <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetailPage></BoardDetailPage>}></Route>
          <Route path={BOARD_WRITE_PATH()} element={<BoardWritePage></BoardWritePage>}></Route>
          <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdatePage></BoardUpdatePage>}></Route>
        </Route>
        
        <Route path="*" element={<h1>404 Not Found</h1>}></Route>
      </Route>
    </Routes>

    
  );
}

export default App;
