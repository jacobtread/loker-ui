import {
    CreateSecretCommand,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import * as FormField from "../components/FormField";
import { mapUnknownError } from "../utils/error";

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
                <FormField.Root id="name">
                    <FormField.Label>Name</FormField.Label>
                    <FormField.TextInput
                        type="text"
                        value={store.name}
                        onInput={[setTextInput, "name"]}
                        required
                        minlength="1"
                        maxlength="512"
                    />
                </FormField.Root>

                <FormField.Root id="description">
                    <FormField.Label>Description</FormField.Label>
                    <FormField.TextInput
                        type="text"
                        value={store.description}
                        onInput={[setTextInput, "description"]}
                        maxlength="2048"
                    />
                </FormField.Root>

                <FormField.Root id="secretString">
                    <FormField.Label>Secret String</FormField.Label>
                    <FormField.TextInput
                        type="password"
                        value={store.secretString}
                        onInput={[setTextInput, "secretString"]}
                        maxlength="65536"
                    />
                </FormField.Root>

                <FormField.Root id="secretBinary">
                    <FormField.Label>Secret Binary</FormField.Label>
                    <FormField.TextInput
                        type="password"
                        value={store.secretBinary}
                        onInput={[setTextInput, "secretBinary"]}
                        maxlength="65536"
                    />
                </FormField.Root>

                <div>
                    <p>Tags</p>

                    <For each={store.tags}>
                        {(tag, index) => {
                            return (
                                <div>
                                    <FormField.Root id={`tag-${index()}-key`}>
                                        <FormField.Label>Key</FormField.Label>
                                        <FormField.TextInput
                                            type="text"
                                            value={store.tags[index()].key}
                                            onInput={[setTagKeyInput, index()]}
                                        />
                                    </FormField.Root>

                                    <FormField.Root id={`tag-${index()}-value`}>
                                        <FormField.Label>Value</FormField.Label>
                                        <FormField.TextInput
                                            type="text"
                                            value={store.tags[index()].value}
                                            onInput={[
                                                setTagValueInput,
                                                index(),
                                            ]}
                                        />
                                    </FormField.Root>

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
