import { GetRandomPasswordCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { getContext, setContext } from "svelte";
import { getLokerEndpoint } from "../utils/endpoint";



interface ClientStore {
    client: SecretsManagerClient | null;
    authenticate(accessKeyId: string, secretAccessKey: string): Promise<void>;
    logout(): void;
}

const CONTEXT_KEY = 'CLIENT_STORE';

export const clientStoreContext = {
    get(): ClientStore {
        return getContext(CONTEXT_KEY)
    },
    set(value: ClientStore) {
        setContext(CONTEXT_KEY, value);
    }
}


export function createClientStore(): ClientStore {
    let client: SecretsManagerClient | null = $state(null);

    async function authenticate(accessKeyId: string, secretAccessKey: string) {
        const newClient = new SecretsManagerClient({
            // loker always pretends to be us-east-1
            region: "us-east-1",
            credentials: {
                accessKeyId,
                secretAccessKey
            },
            endpoint: getLokerEndpoint()
        });

        // Probe our authentication by trying to generate a random password
        await newClient.send(new GetRandomPasswordCommand({}));

        client = newClient;
    }

    function logout() {
        client = null;
    }


    return {
        get client() {
            return client;
        },
        authenticate,
        logout
    }
}
