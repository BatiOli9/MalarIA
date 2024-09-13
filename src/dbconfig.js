import "dotenv/config";
import pg from "pg";

const { Client } = pg;

export const client = new Client({
    host: "ep-icy-boat-a4kjiwri-pooler.us-east-1.aws.neon.tech",
    database: "verceldb",
    user: "default",
    password: "laJDH9yGOwR6",
    port: 5432,
    ssl: true,
    idle_in_transaction_session_timeout: 0,
    connectionTimeoutMillis: 0
});

client.connect();