import { Request } from "express";
import { cloneDeep } from "lodash";
import { ObjectId } from "mongodb";
import { boardModel } from "~models/board-model";
import { cardModel } from "~models/card-model";
import { columnModel } from "~models/column-model";
import ApiError from "~utils/api-error";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~utils/constants";
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
const update = async (id: string, reqBody: Record<string, unknown>) => {
    const updateData = { ...reqBody, updatedAt: Date.now() };
    const updatedBoard = await boardModel.update(id, updateData);
    if (!updatedBoard) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }

    return updatedBoard;
};

type MoveCardToAnotherColumnBodyRequest = {
    currentCardId: string;
    prevColumnId: string;
    prevCardOrderIds: string[];
    nextColumnId: string;
    nextCardOrderIds: string[];
};
const moveCardToAnotherColumn = async (reqBody: MoveCardToAnotherColumnBodyRequest) => {
    await columnModel.update(reqBody.prevColumnId, { cardOrderIds: reqBody.prevCardOrderIds, updatedAt: Date.now() });
    await columnModel.update(reqBody.nextColumnId, { cardOrderIds: reqBody.nextCardOrderIds, updatedAt: Date.now() });
    await cardModel.update(reqBody.currentCardId, { columnId: reqBody.nextColumnId, updatedAt: Date.now() });

    return { updateResult: "success" };
};
type ValuePage = string | Request["query"] | string[] | Request["query"][] | undefined;
const getBoards = (userId: string | ObjectId, page: ValuePage, itemsPerPage: ValuePage) => {
    if (!page) page = DEFAULT_PAGE;
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
    if (typeof page !== "string" || typeof itemsPerPage !== "string") {
        throw new Error("'page' or 'itemsPerPage' should be string");
    }
    return boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10));
};

export const boardService = {
    createNew,
    getDetail,
    update,
    moveCardToAnotherColumn,
    getBoards,
};
