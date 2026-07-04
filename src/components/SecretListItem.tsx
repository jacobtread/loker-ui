import type { SecretListEntry } from "@aws-sdk/client-secrets-manager";
import { formatDate } from "../utils/date";
import styles from "./SecretListItem.module.css";

interface Props {
    secret: SecretListEntry;
}

export default function SecretListItem({ secret }: Props) {
    const lastChangedDate = formatDate(secret.LastChangedDate);

    return (
        <tr class={styles.item}>
            <td>
                <span class={styles.item__name}>{secret.Name}</span>
                <span class={styles.item__arn}>{secret.ARN}</span>
            </td>

            <td>{secret.Description ?? "-"}</td>
            <td>{lastChangedDate}</td>
        </tr>
    );
}
