<script lang="ts">
    import {
        ListSecretsCommand,
        type SecretsManagerClient,
        type SecretListEntry,
        type Filter,
    } from "@aws-sdk/client-secrets-manager";

    import SecretList from "$lib/SecretList.svelte";
    import PaginationControls from "$lib/components/PaginationControls.svelte";

    interface Props {
        client: SecretsManagerClient;
        pageSize?: number;
    }

    const { client, pageSize = 25 }: Props = $props();

    let secrets = $state<SecretListEntry[]>([]);
    let loading = $state(false);
    let error = $state<string | null>(null);

    let currentPage = $state(0);
    let pageTokens = $state<(string | undefined)[]>([undefined]);
    let hasNextPage = $state(false);

    let filters = $state<Filter[]>([]);

    async function loadPage(page: number) {
        loading = true;
        error = null;

        try {
            const nextToken = pageTokens[page];

            const result = await client.send(
                new ListSecretsCommand({
                    MaxResults: pageSize,
                    NextToken: nextToken,
                    Filters: filters.length ? filters : undefined,
                }),
            );

            secrets = result.SecretList ?? [];

            hasNextPage = !!result.NextToken;

            if (result.NextToken && !pageTokens[page + 1]) {
                pageTokens[page + 1] = result.NextToken;
            }

            currentPage = page;
        } catch (err) {
            console.error(err);
            error =
                err instanceof Error ? err.message : "Failed to load secrets";
        } finally {
            loading = false;
        }
    }

    async function refresh() {
        currentPage = 0;
        pageTokens = [undefined];

        await loadPage(0);
    }

    function applyFilters(newFilters: Filter[]) {
        filters = newFilters;
        void refresh();
    }

    function nextPage() {
        if (!hasNextPage || loading) return;
        void loadPage(currentPage + 1);
    }

    function previousPage() {
        if (currentPage === 0 || loading) return;
        void loadPage(currentPage - 1);
    }

    $effect(() => {
        loadPage(0);
    });
</script>

<div class="secrets-browser">
    <div class="toolbar">
        <button class="refresh-button" onclick={refresh} disabled={loading}>
            Refresh
        </button>
    </div>

    {#if error}
        <div class="error">
            {error}
        </div>
    {/if}

    {#if loading}
        <div class="loading">Loading secrets...</div>
    {:else}
        <SecretList {secrets} />
    {/if}

    <PaginationControls
        page={currentPage}
        {hasNextPage}
        {loading}
        onPrevious={previousPage}
        onNext={nextPage}
    />
</div>
