import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { Show } from "solid-js";
import SecretList from "../components/SecretList";
import PaginationControls from "../components/PaginationControls";
import { createSecretsStore } from "../stores/secretsStore";

interface Props {
    client: SecretsManagerClient;
}

export default function Secrets({ client }: Props) {
    const { pagination, secrets, refetch } = createSecretsStore({ client });

    return (
        <div class="secrets-browser">
            <div class="toolbar">
                <button
                    class="refresh-button"
                    onclick={refetch}
                    disabled={secrets.loading}
                >
                    Refresh
                </button>
            </div>

            <Show when={secrets.error}>
                {(error) => (
                    <div class="error">
                        <b>Error:</b>
                        {error().message}
                    </div>
                )}
            </Show>

            <Show
                when={!secrets.loading}
                fallback={<div class="loading">Loading secrets...</div>}
            >
                <SecretList secrets={secrets()?.secrets ?? []} />
            </Show>

            <PaginationControls
                page={pagination.page}
                hasNextPage={pagination.hasNextPage}
                disabled={() => secrets.loading}
                onPrevious={pagination.previousPage}
                onNext={pagination.nextPage}
            />
        </div>
    );
}
