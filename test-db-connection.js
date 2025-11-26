const { Client } = require('pg');

// Test configuration from .env
const config = {
    connectionString: "postgresql://postgres.ecrybmaumjvmhqklxeqb:2t4ZUTRv5j4NUbWz@aws-1-sa-east-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }, // Equivalent to sslmode=no-verify
    connectionTimeoutMillis: 10000,
};

console.log(`Attempting connection to: ${config.connectionString.replace(/:[^:@]+@/, ':****@')}`);

const client = new Client(config);

async function testConnection() {
    try {
        await client.connect();
        console.log('✅ Connection successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Connection failed:', err);
        process.exit(1);
    }
}

testConnection();
