import { create } from "zustand";

interface BoardStore {
   title: string;
   content: string; 
   address: string;
   boardImageFileList: File[];
   setTitle: (title: string) => void;
   setContent: (content: string) => void;
   setAddress: (address: string) => void;
   setBoardImageFielList: (boardImageFileList: File[]) => void;
   resetBoard: () => void;
};

const useBoardStore = create<BoardStore>(set =>({
    title: '',
    content: '',
    address: '',
    boardImageFileList: [],
    setTitle: (title) => set(state => ({...state, title})),
    setContent: (content) => set(state => ({...state, content})),
    setAddress: (address) => set(state => ({...state, address})),
    setBoardImageFielList: (boardImageFileList) => set(state => ({...state, boardImageFileList})),
    resetBoard: () => set(state => ({...state, title: '', content: '', address: '', boardImageFileList: []})),
}));

export default useBoardStore;