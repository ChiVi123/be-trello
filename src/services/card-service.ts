import { cardModel } from "~models/card-model";

const createNew = async (data: Record<string, unknown>) => {
    const newCard = { ...data };
    const insertedOneResult = await cardModel.createNew(newCard);
    const createdCard = await cardModel.findOneById(insertedOneResult.insertedId);

    return createdCard;
};

export const cardService = {
    createNew,
};
