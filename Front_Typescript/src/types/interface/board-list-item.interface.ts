export default interface BoardListItem {
  boardNumber: number;
  title: string;
  content: string;
  address: string;
  boardTitleImage: string | null;
  favoriteCount: number;
  commentCount: number;
  viewCount: number;
  writeDatetime: string;
  writerNickname: string;
  writerProfileImage: string | null;
}
