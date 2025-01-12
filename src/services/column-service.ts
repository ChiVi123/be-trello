import { boardModel } from "~models/board-model";
import { columnModel } from "~models/column-model";

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

export const columnService = {
    createNew,
};
