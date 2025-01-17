import { OptionalId } from "mongodb";
import { cardModel, ICardDocument } from "~models/card-model";
import { columnModel } from "~models/column-model";

const createNew = async (data: OptionalId<ICardDocument>) => {
    const newCard = { ...data };
    const insertedOneResult = await cardModel.create(newCard);
    const getNewCard = await cardModel.findOneById(insertedOneResult.insertedId);

    if (getNewCard) {
        await columnModel.pushCardOrderIds(getNewCard);
    }

    return getNewCard;
};

export const cardService = {
    createNew,
};
