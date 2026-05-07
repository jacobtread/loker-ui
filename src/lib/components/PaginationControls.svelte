<script lang="ts">
    interface Props {
        page: number;
        hasNextPage: boolean;
        loading?: boolean;

        onPrevious: () => void;
        onNext: () => void;
    }

    const {
        page,
        hasNextPage,
        loading = false,
        onPrevious,
        onNext,
    }: Props = $props();
</script>

<div class="pagination">
    <button onclick={onPrevious} disabled={page === 0 || loading}>
        Previous
    </button>

    <div class="page">
        Page {page + 1}
    </div>

    <button onclick={onNext} disabled={!hasNextPage || loading}> Next </button>
</div>

<style>
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .page {
        min-width: 80px;
        text-align: center;
    }
</style>
