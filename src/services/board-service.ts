import { slugify } from "~utils/formaters";

const createNew = async (data: Record<string, unknown>) => {
    try {
        const newBoard = { ...data, slug: slugify(data.title) };
        return newBoard;
    } catch (error) {
        throw error;
    }
};

export const boardService = {
    createNew,
};
