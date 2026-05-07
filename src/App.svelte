<script>
    import Login from "./pages/Login.svelte";
    import Secrets from "./pages/Secrets.svelte";
    import {
        clientStoreContext,
        createClientStore,
    } from "./store/clientStore.svelte";

    const clientStore = createClientStore();
    clientStoreContext.set(clientStore);
</script>

{#if clientStore.client === null}
    <Login />
{:else}
    <Secrets client={clientStore.client} />
    Logged in
    <button onclick={clientStore.logout}>Logout</button>
{/if}
