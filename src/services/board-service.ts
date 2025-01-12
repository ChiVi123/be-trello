import { cloneDeep } from "lodash";
import { ObjectId } from "mongodb";
import { boardModel } from "~models/board-model";
import ApiError from "~utils/api-error";
import { slugify } from "~utils/formatters";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (data: Record<string, unknown>) => {
    const newBoard = { ...data, slug: slugify(data.title) };
    const insertedOneResult = await boardModel.createNew(newBoard);
    return boardModel.findOneById(insertedOneResult.insertedId);
};
const getDetail = async (id: string) => {
    const board = await boardModel.getDetail(id);
    if (!board) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }
    const clonedBoard = cloneDeep(board);

    clonedBoard.columns.forEach((column: { cards: ObjectId[]; _id: ObjectId }) => {
        column.cards = clonedBoard.cards.filter((card: { columnId: ObjectId }) => card.columnId.equals(column._id));
    });

    delete clonedBoard.cards;

    return clonedBoard;
};

export const boardService = {
    createNew,
    getDetail,
};
