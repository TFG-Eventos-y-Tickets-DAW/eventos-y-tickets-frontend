export default interface pagination {
    paginationTokensPerPage?: {
        pageNum: number;
        paginationToken: string;
    }[];
    nextPaginationToken: string;
}
