import { createSignal, Match, Show, Switch, type Component } from "solid-js";

import styles from "./App.module.css";
import { createClientStore } from "./stores/clientStore";
import Login from "./pages/Login";
import Secrets from "./pages/Secrets";
import CreateSecret from "./pages/CreateSecret";

function App() {
    const clientStore = createClientStore();

    const [mode, setMode] = createSignal<"secrets" | "create">("secrets");

    return (
        <Show
            when={clientStore.client()}
            fallback={<Login clientStore={clientStore} />}
        >
            {(client) => (
                <div>
                    <button onClick={[setMode, "secrets"]}>Secrets</button>
                    <button onClick={[setMode, "create"]}>Create</button>
                    <Switch>
                        <Match when={mode() === "secrets"}>
                            <Secrets client={client()} />
                        </Match>
                        <Match when={mode() === "create"}>
                            <CreateSecret
                                client={client()}
                                onBack={() => setMode("secrets")}
                            />
                        </Match>
                    </Switch>
                    Logged in
                    <button onClick={clientStore.logout}>Logout</button>
                </div>
            )}
        </Show>
    );
}

export default App;
