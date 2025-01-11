import { boardModel } from "~models/board-model";
import ApiError from "~utils/api-error";
import { slugify } from "~utils/formaters";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (data: Record<string, unknown>) => {
    const newBoard = { ...data, slug: slugify(data.title) };
    return boardModel.createNew(newBoard);
};
const getDetail = async (id: string) => {
    const board = await boardModel.getDetail(id);
    if (!board) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }
    return board;
};

export const boardService = {
    createNew,
    getDetail,
};
