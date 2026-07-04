import { Component, For } from "solid-js";
import type { SecretListEntry } from "@aws-sdk/client-secrets-manager";
import styles from "./SecretList.module.css";
import SecretListItem from "./SecretListItem";

interface Props {
    secrets: SecretListEntry[];
}

export default function SecretList({ secrets }: Props) {
    if (secrets.length < 1) {
        return <div class={styles.empty}>No secrets found.</div>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Last Changed</th>
                </tr>
            </thead>
            <tbody>
                <For each={secrets}>
                    {(secret, i) => <SecretListItem secret={secret} />}
                </For>
            </tbody>
        </table>
    );
}
