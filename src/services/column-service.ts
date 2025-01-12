import { columnModel } from "~models/column-model";

const createNew = async (data: Record<string, unknown>) => {
    const newColumn = { ...data };
    const insertedOneResult = await columnModel.createNew(newColumn);
    const createdColumn = await columnModel.findOneById(insertedOneResult.insertedId);

    return createdColumn;
};

export const columnService = {
    createNew,
};
