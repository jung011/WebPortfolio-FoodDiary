export default interface BoardUserListItem {
  boardNumber : number;
  title : string;
  content : string;
  address : string;
  writeDatetime : string;
  writerEmail : string;
  boardImageList : string;
  writerNickname: string;
  writerProfileImage: string | null;
}
