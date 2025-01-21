import { WithId } from "mongodb";
import { cardModel } from "~models/card-model";
import { columnModel } from "~models/column-model";
import { cloudinaryProvider } from "~providers/cloudinary-provider";

const createNew = async (data: Record<string, unknown>) => {
    const newCard = { ...data };
    const insertedOneResult = await cardModel.createNew(newCard);
    const getNewCard = await cardModel.findOneById(insertedOneResult.insertedId);

    if (getNewCard) {
        await columnModel.pushCardOrderIds(getNewCard);
    }

    return getNewCard;
};
const update = async (id: string, data: Record<string, unknown>, cardCoverFile: Express.Multer.File | undefined) => {
    const updateData = { ...data, updatedAt: Date.now() };
    let updatedCard: WithId<Document> | null = null;

    if (cardCoverFile) {
        const uploadResult = await cloudinaryProvider.streamUploadSingle(cardCoverFile.buffer, "trello-mern/cards");
        updatedCard = await cardModel.update(id, {
            cover: uploadResult?.secure_url ?? null,
        });
    } else {
        updatedCard = await cardModel.update(id, updateData);
    }

    return updatedCard;
};

export const cardService = {
    createNew,
    update,
};
