import { boardModel } from "~models/board-model";
import { cardModel } from "~models/card-model";
import { columnModel } from "~models/column-model";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (data: Record<string, unknown>) => {
    const newColumn = { ...data };
    const insertedOneResult = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(insertedOneResult.insertedId);

    if (getNewColumn) {
        getNewColumn.cards = [];
        await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
};
const update = async (id: string, reqBody: Record<string, unknown>) => {
    const updateData = { ...reqBody, updatedAt: Date.now() };
    const updatedColumn = await columnModel.update(id, updateData);
    if (!updatedColumn) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Column not found!");
    }

    return updatedColumn;
};
const deleteItem = async (id: string) => {
    const targetColumn = await columnModel.findOneById(id);

    if (!targetColumn) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Column not found!");
    }

    await cardModel.deleteManyByColumnId(id);
    await columnModel.deleteOnById(id);
    await boardModel.pullColumnOrderIds(targetColumn);

    return { deleteResult: "Column and its Cards deleted successfully!" };
};

export const columnService = {
    createNew,
    update,
    deleteItem,
};
