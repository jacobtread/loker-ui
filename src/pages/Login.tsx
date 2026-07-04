import { createStore } from "solid-js/store";
import { Show } from "solid-js";
import styles from "./Login.module.css";
import { ClientStore } from "../stores/clientStore";

interface Props {
    clientStore: ClientStore;
}

interface FormStore {
    accessKeyId: string;
    secretAccessKey: string;

    loading: boolean;
    error: Error | null;
}

export default function Login({ clientStore }: Props) {
    const [store, setStore] = createStore<FormStore>({
        accessKeyId: "",
        secretAccessKey: "",
        //
        loading: false,
        error: null,
    });

    async function onSubmitLogin(event: SubmitEvent) {
        event.preventDefault();

        try {
            setStore("loading", true);
            await clientStore.authenticate(
                store.accessKeyId,
                store.secretAccessKey,
            );
        } catch (err) {
            console.error(err, "failed to authenticate");
            setStore("error", mapUnknownError(err));
        } finally {
            setStore("loading", false);
        }
    }

    const setTextInput = (
        key: keyof FormStore,
        event: InputEvent & { target: HTMLInputElement },
    ) => {
        setStore(key, event.target.value);
    };

    return (
        <div>
            <form class={styles.form} onsubmit={onSubmitLogin}>
                <div>
                    <label for="accessKeyId">Access Key ID</label>
                    <input
                        id="accessKeyId"
                        name="accessKeyId"
                        type="text"
                        value={store.accessKeyId}
                        onInput={[setTextInput, "accessKeyId"]}
                    />
                </div>

                <div>
                    <label for="secretAccessKey">Access Key Secret</label>
                    <input
                        id="secretAccessKey"
                        name="secretAccessKey"
                        type="password"
                        value={store.secretAccessKey}
                        onInput={[setTextInput, "secretAccessKey"]}
                    />
                </div>

                <Show when={store.loading}>
                    <p>Loading...</p>
                </Show>

                <Show when={store.error}>
                    {(error) => (
                        <div class="error">
                            <b>Error:</b>
                            {error().message}
                        </div>
                    )}
                </Show>

                <button type="submit" disabled={store.loading}>
                    Login
                </button>
            </form>
        </div>
    );
}
