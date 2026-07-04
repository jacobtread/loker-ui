import {
    Filter,
    ListSecretsCommand,
    SecretListEntry,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { createStore, unwrap } from "solid-js/store";
import {
    createSecretsPaginationStore,
    SecretsPaginationStore,
} from "./secretsPaginationStore";
import { createEffect, createResource, Resource } from "solid-js";

interface CreateSecretsStoreData {
    client: SecretsManagerClient;
}

interface SecretsStoreState {
    secrets: SecretListEntry[];
    loading: boolean;
    error: Error | null;

    filters: Filter[];
}

interface GetSecretsListData {
    client: SecretsManagerClient;

    page: number;
    pageSize: number;
    nextToken: string | undefined;

    filterData: GetSecretsListFilterData;
}

interface GetSecretsListFilterData {
    filters: Filter[];
}

interface SecretsListData {
    page: number;
    currentToken: string | undefined;

    secrets: SecretListEntry[];
    nextToken: string | undefined;
}

async function getSecretsList({
    client,
    page,
    pageSize,
    nextToken,
    filterData,
}: GetSecretsListData): Promise<SecretsListData> {
    const result = await client.send(
        new ListSecretsCommand({
            MaxResults: pageSize,
            NextToken: nextToken,
            Filters: filterData.filters.length ? filterData.filters : undefined,
        }),
    );

    return {
        page,
        currentToken: nextToken,
        secrets: result.SecretList ?? [],
        nextToken: result.NextToken,
    };
}

interface SecretsStore {
    pagination: SecretsPaginationStore;
    secrets: Resource<SecretsListData>;
    refetch(): void;
}

export function createSecretsStore({
    client,
}: CreateSecretsStoreData): SecretsStore {
    const pagination = createSecretsPaginationStore();
    const [store, setStore] = createStore<SecretsStoreState>({
        secrets: [],
        loading: false,
        error: null,
        filters: [],
    });

    const filterData = (): GetSecretsListFilterData => ({
        filters: store.filters,
    });

    // Resource fetching the secrets content
    const [secrets, { refetch }] = createResource(
        () => ({
            client,
            page: pagination.page(),
            pageSize: pagination.pageSize(),
            nextToken: pagination.nextToken(),
            filterData: filterData(),
        }),
        getSecretsList,
        {},
    );

    // Synchronize the pagination tokens with the pagination store
    createEffect(() => {
        const result = secrets();
        if (!result) {
            return;
        }

        pagination.setNextPageToken(
            result.page,
            result.currentToken,
            result.nextToken,
        );
    });

    // Reset the pagination whenever the filters change
    createEffect(() => {
        filterData();
        pagination.reset();
    });

    return {
        pagination,
        secrets,
        refetch,
    };
}
