<script lang="ts">
    import type { Tag } from "@aws-sdk/client-secrets-manager";

    type LocalTag = { key: string; value: string };

    let name = $state("");
    let description = $state("");
    let secret_string = $state("");
    let secret_binary = $state("");
    let tags: LocalTag[] = $state([]);

    function onAddTag() {
        tags.push({
            key: "",
            value: "",
        });
    }

    function onRemoveTag(index: number) {
        tags = tags.filter((_tag, i) => i !== index);
    }
</script>

<form>
    <div>
        <label for="name">Name</label>
        <input
            id="name"
            name="name"
            type="text"
            bind:value={name}
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
            bind:value={description}
            maxlength="2048"
        />
    </div>

    <div>
        <label for="secretString">Secret String</label>
        <input
            id="secretString"
            name="secretString"
            type="password"
            bind:value={secret_string}
            maxlength="65536"
        />
    </div>

    <div>
        <label for="secretString">Secret Binary</label>
        <input
            id="secretBinary"
            name="v"
            type="password"
            bind:value={secret_binary}
            maxlength="65536"
        />
    </div>

    <div>
        <p>Tags</p>

        {#each tags as tag, i (i)}
            <div>
                <div>
                    <label for="secretString">Key</label>
                    <input
                        id="tag-{i}-key"
                        name="tag-{i}-key"
                        type="text"
                        bind:value={tag.key}
                    />
                </div>

                <div>
                    <label for="secretString">Value</label>
                    <input
                        id="tag-{i}-value"
                        name="tag-{i}-value"
                        type="text"
                        bind:value={tag.value}
                    />
                </div>

                <button type="button" onclick={() => onRemoveTag(i)}>
                    Remove
                </button>
            </div>
        {/each}

        <button type="button" onclick={onAddTag}>Add Tag</button>
    </div>

    <button type="submit">Create</button>
</form>
