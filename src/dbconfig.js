import { Client } from "pg";

const client = new Client({
    user: "default",
    host: "ep-icy-boat-a4kjiwri-pooler.us-east-1.aws.neon.tech",
    database: "verceldb",
    password: "laJDH9yGOwR6",
    port: 5432,
});

client.connect();