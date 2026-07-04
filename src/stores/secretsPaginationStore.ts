import { createStore } from "solid-js/store";

interface SecretsPaginationState {
    pageSize: number;
    currentPage: number;
    pageTokens: (string | undefined)[];
}

export interface SecretsPaginationStore {
    nextToken(): string | undefined;
    currentToken(): string | undefined;

    page(): number;
    pageSize(): number;
    hasNextPage(): boolean;
    nextPage(): void;
    previousPage(): void;
    reset(): void;

    setNextPageToken(
        page: number,
        previousToken: string | undefined,
        nextToken: string | undefined,
    ): void;
}

export function createSecretsPaginationStore(): SecretsPaginationStore {
    const [store, setStore] = createStore<SecretsPaginationState>({
        pageSize: 20,
        currentPage: 0,
        pageTokens: [],
    });

    return {
        page() {
            return store.currentPage;
        },
        pageSize() {
            return store.pageSize;
        },
        nextToken() {
            if (store.currentPage === 0) return undefined;
            return store.pageTokens[store.currentPage - 1];
        },
        currentToken() {
            return store.pageTokens[store.currentPage];
        },
        setNextPageToken(page, previousToken, nextToken) {
            if (store.pageTokens[page] === nextToken) return;

            setStore("pageTokens", (pageTokens) => {
                const nextTokens = [...pageTokens];
                nextTokens[page] = nextToken;
                return nextTokens;
            });
        },
        hasNextPage() {
            return store.pageTokens[store.currentPage] !== undefined;
        },
        reset() {
            setStore("currentPage", 0);
            setStore("pageTokens", []);
        },
        nextPage() {
            setStore("currentPage", store.currentPage + 1);
        },
        previousPage() {
            if (store.currentPage < 1) return;
            setStore("currentPage", store.currentPage - 1);
        },
    };
}
