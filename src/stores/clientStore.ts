import {
    GetRandomPasswordCommand,
    SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { getLokerEndpoint } from "../utils/endpoint";
import { createSignal } from "solid-js";

export interface ClientStore {
    client(): SecretsManagerClient | null;
    authenticate(accessKeyId: string, secretAccessKey: string): Promise<void>;
    logout(): void;
}

export function createClientStore(): ClientStore {
    let [client, setClient] = createSignal<SecretsManagerClient | null>(null);

    async function authenticate(accessKeyId: string, secretAccessKey: string) {
        const newClient = new SecretsManagerClient({
            // loker always pretends to be us-east-1
            region: "us-east-1",
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            endpoint: getLokerEndpoint(),
        });

        // Probe our authentication by trying to generate a random password
        await newClient.send(new GetRandomPasswordCommand({}));
        setClient(newClient);
    }

    function logout() {
        setClient(null);
    }

    return {
        client,
        authenticate,
        logout,
    };
}
