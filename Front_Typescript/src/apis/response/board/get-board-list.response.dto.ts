import { BoardListItem, BoardMainListItem } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetBoardListResponseDto extends ResponseDto {
    boardMainList : BoardMainListItem[];
}