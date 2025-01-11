import { boardModel } from "~models/board-model";
import { slugify } from "~utils/formaters";

const createNew = async (data: Record<string, unknown>) => {
    const newBoard = { ...data, slug: slugify(data.title) };
    return boardModel.createNew(newBoard);
};

export const boardService = {
    createNew,
};
