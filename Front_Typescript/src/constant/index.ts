export const MAIN_PATH = () => '/';
export const LOGIN_PATH = () => '/login';
export const USER_PATH = (userEmail: string) => `/user/${userEmail}`;
export const SEARCH_PATH = (searchWord: string) => `/search/${searchWord}`;
export const BOARD_PATH = () => '/board';
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_DETAIL_PATH = (boardNumber: string | number) => `detail/${boardNumber}`;
export const BOARD_UPDATE_PATH = (boardNumber: string | number) => `update/${boardNumber}`;
