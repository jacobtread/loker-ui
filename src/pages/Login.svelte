<script lang="ts">
    import { clientStoreContext } from "../store/clientStore.svelte";

    const clientStore = clientStoreContext.get();

    let accessKeyId: string = $state("");
    let secretAccessKey: string = $state("");

    let loading: boolean = $state(false);
    let error: Error | null = $state(null);

    async function onSubmitLogin(event: SubmitEvent) {
        event.preventDefault();

        try {
            loading = true;
            await clientStore.authenticate(accessKeyId, secretAccessKey);
        } catch (err) {
            console.error(err, "failed to authenticate");
            if (err instanceof Error) {
                error = err;
            } else if (typeof err === "string") {
                error = new Error(err);
            } else {
                error = new Error("Unknown error occurred");
            }
        } finally {
            loading = false;
        }
    }
</script>

<div>
    <form onsubmit={onSubmitLogin}>
        <div>
            <label for="accessKeyId">Access Key ID</label>
            <input
                id="accessKeyId"
                name="accessKeyId"
                type="text"
                bind:value={accessKeyId}
            />
        </div>

        <div>
            <label for="secretAccessKey">Access Key Secret</label>
            <input
                id="secretAccessKey"
                name="secretAccessKey"
                type="password"
                bind:value={secretAccessKey}
            />
        </div>

        {#if loading}
            <p>Loading...</p>
        {/if}

        {#if error}
            <p><b>Error:</b>{error.message}</p>
        {/if}

        <button type="submit" disabled={loading}>Login</button>
    </form>
</div>

<style>
    form {
        display: flex;
        flex-flow: column;
        gap: 1rem;
        max-width: 24rem;
        padding: 1rem;
        margin: 1rem auto;
    }
</style>
