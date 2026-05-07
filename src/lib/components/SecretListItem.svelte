<script lang="ts">
    import type { SecretListEntry } from "@aws-sdk/client-secrets-manager";

    interface Props {
        secret: SecretListEntry;
    }

    const { secret }: Props = $props();

    function formatDate(value?: Date) {
        if (!value) return "-";

        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(value);
    }
</script>

<tr>
    <td>
        <div class="name">
            {secret.Name}
        </div>

        <div class="arn">
            {secret.ARN}
        </div>
    </td>

    <td>
        {secret.Description ?? "-"}
    </td>

    <td>
        {formatDate(secret.LastChangedDate)}
    </td>

    <td>
        {secret.RotationEnabled ? "Enabled" : "Disabled"}
    </td>
</tr>
