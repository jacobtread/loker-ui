import {
    CreateSecretCommand,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";

interface Props {
    client: SecretsManagerClient;
    onBack: VoidFunction;
}

interface LocalTag {
    key: string;
    value: string;
}

interface FormStore {
    name: string;
    description: string;
    secretString: string;
    secretBinary: string;
    tags: LocalTag[];
}

export default function CreateSecret({ client, onBack }: Props) {
    const [store, setStore] = createStore<FormStore>({
        name: "",
        description: "",
        secretString: "",
        secretBinary: "",
        tags: [],
    });

    const addTag = () => {
        setStore("tags", store.tags.length, {
            key: "",
            value: "",
        });
    };

    const removeTag = (index: number) => {
        setStore("tags", (tags) => {
            const nextArray = [...tags];
            nextArray.splice(index, 1);
            return nextArray;
        });
    };

    const setTextInput = (
        key: keyof FormStore,
        event: InputEvent & { target: HTMLInputElement },
    ) => {
        setStore(key, event.target.value);
    };

    const setTagKeyInput = (
        index: number,
        event: InputEvent & { target: HTMLInputElement },
    ) => {
        setStore("tags", index, "key", event.target.value);
    };

    const setTagValueInput = (
        index: number,
        event: InputEvent & { target: HTMLInputElement },
    ) => {
        setStore("tags", index, "value", event.target.value);
    };

    const onCreate = async (event: SubmitEvent) => {
        event.preventDefault();
        event.stopPropagation();

        let secretPart: { SecretString: string } | { SecretBinary: Uint8Array };

        if (store.secretString.trim().length > 0) {
            secretPart = { SecretString: store.secretString };
        } else if (store.secretBinary.trim().length > 0) {
            // secretPart = { SecretBinary: store.secretBinary };
            throw new Error("binary secret currently unsupported");
        } else {
            throw new Error("missing secret value");
        }

        // TODO: Validate name, description, and tags, remove any that aren't valid

        try {
            const result = await client.send(
                new CreateSecretCommand({
                    Name: store.name,
                    Description: store.description,
                    Tags: store.tags.map((tag) => ({
                        Key: tag.key,
                        Value: tag.value,
                    })),
                    ...secretPart,
                }),
            );
        } catch (err) {
            console.error(err);
            const error = mapUnknownError(err);
            // setStore("error", error);
        } finally {
            // setStore("loading", false);
        }
    };

    return (
        <div>
            <button onClick={onBack}>Back</button>
            <form onSubmit={onCreate}>
                <div>
                    <label for="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={store.name}
                        onInput={[setTextInput, "name"]}
                        required
                        minlength="1"
                        maxlength="512"
                    />
                </div>

                <div>
                    <label for="description">Description</label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        value={store.description}
                        onInput={[setTextInput, "description"]}
                        maxlength="2048"
                    />
                </div>

                <div>
                    <label for="secretString">Secret String</label>
                    <input
                        id="secretString"
                        name="secretString"
                        type="password"
                        value={store.secretString}
                        onInput={[setTextInput, "secretString"]}
                        maxlength="65536"
                    />
                </div>

                <div>
                    <label for="secretString">Secret Binary</label>
                    <input
                        id="secretBinary"
                        name="v"
                        type="password"
                        value={store.secretBinary}
                        onInput={[setTextInput, "secretBinary"]}
                        maxlength="65536"
                    />
                </div>

                <div>
                    <p>Tags</p>

                    <For each={store.tags}>
                        {(tag, index) => {
                            return (
                                <div>
                                    <div>
                                        <label for="secretString">Key</label>
                                        <input
                                            id="tag-{i}-key"
                                            name="tag-{i}-key"
                                            type="text"
                                            value={store.tags[index()].key}
                                            onInput={[setTagKeyInput, index()]}
                                        />
                                        n
                                    </div>

                                    <div>
                                        <label for="secretString">Value</label>
                                        <input
                                            id="tag-{i}-value"
                                            name="tag-{i}-value"
                                            type="text"
                                            value={store.tags[index()].value}
                                            onInput={[
                                                setTagValueInput,
                                                index(),
                                            ]}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onclick={[removeTag, index()]}
                                    >
                                        Remove
                                    </button>
                                </div>
                            );
                        }}
                    </For>

                    <button type="button" onclick={addTag}>
                        Add Tag
                    </button>
                </div>

                <button type="submit">Create</button>
            </form>
        </div>
    );
}
