import { User } from "types/interface";
import { create } from "zustand";

interface LoginUserStore {
    loginUser: User | null;
    setLoginUser: (loginUser: User) => void;
    resetLoginUser: () => void;
};

const useLoginUserStore = create<LoginUserStore>(set => ({
    loginUser: JSON.parse(localStorage.getItem("loginUser") || "null"),  // 페이지 로드 시 localStorage에서 값 불러오기
    setLoginUser: loginUser => {
      // 상태 업데이트 후 localStorage에 저장
      localStorage.setItem("loginUser", JSON.stringify(loginUser));
      set(state => ({ ...state, loginUser }));
    },
    resetLoginUser: () => {
      // 상태 초기화 및 localStorage에서 삭제
      localStorage.removeItem("loginUser");
      set(state => ({ ...state, loginUser: null }));
    }
  }));

export default useLoginUserStore;