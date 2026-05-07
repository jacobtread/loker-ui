<script lang="ts">
    import type { SecretListEntry } from "@aws-sdk/client-secrets-manager";
    import SecretListItem from "./SecretListItem.svelte";

    interface Props {
        secrets: SecretListEntry[];
    }

    const { secrets }: Props = $props();
</script>

{#if secrets.length === 0}
    <div class="empty">No secrets found.</div>
{:else}
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Last Changed</th>
                <th>Rotation</th>
            </tr>
        </thead>

        <tbody>
            {#each secrets as secret, i (secret.ARN ?? i)}
                <SecretListItem {secret} />
            {/each}
        </tbody>
    </table>
{/if}
