export const pagingSkipValue = (page: number | undefined, itemsPerPage: number | undefined) => {
    if (!page || !itemsPerPage) return 0;
    if (page <= 0 || itemsPerPage <= 0) return 0;

    return (page - 1) * itemsPerPage;
};
