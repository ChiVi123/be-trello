import { cardModel } from "~models/card-model";
import { columnModel } from "~models/column-model";

const createNew = async (data: Record<string, unknown>) => {
    const newCard = { ...data };
    const insertedOneResult = await cardModel.createNew(newCard);
    const getNewCard = await cardModel.findOneById(insertedOneResult.insertedId);

    if (getNewCard) {
        await columnModel.pushCardOrderIds(getNewCard);
    }

    return getNewCard;
};

export const cardService = {
    createNew,
};
