import { JwtPayload } from "jsonwebtoken";
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
const update = async (
    cardId: string,
    data: Record<string, unknown>,
    cardCoverFile: Express.Multer.File | undefined,
    userInfo: JwtPayload | undefined,
) => {
    const updateData = { ...data, updatedAt: Date.now() };
    let updatedCard: WithId<Document> | null = null;

    if (cardCoverFile) {
        const uploadResult = await cloudinaryProvider.streamUploadSingle(cardCoverFile.buffer, "trello-mern/cards");
        updatedCard = await cardModel.update(cardId, {
            cover: uploadResult?.secure_url ?? null,
        });
        // FE send a request with req.body has commentToAdd to know add or edit comment
    } else if (
        userInfo &&
        "commentToAdd" in updateData &&
        updateData.commentToAdd &&
        typeof updateData.commentToAdd === "object"
    ) {
        const commentData = {
            ...updateData.commentToAdd,
            commentedAt: Date.now(),
            userId: userInfo._id,
            userEmail: userInfo.email,
        };
        updatedCard = await cardModel.unshiftNewComment(cardId, commentData);
    } else {
        updatedCard = await cardModel.update(cardId, updateData);
    }

    return updatedCard;
};

export const cardService = {
    createNew,
    update,
};
