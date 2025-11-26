const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Config from .env (Port 6543 + SSL no-verify)
const config = {
    connectionString: "postgresql://postgres.ecrybmaumjvmhqklxeqb:2t4ZUTRv5j4NUbWz@aws-1-sa-east-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
};

const client = new Client(config);

async function applyMigration() {
    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('✅ Connected!');

        const sqlPath = path.join(__dirname, 'migration.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Applying migration SQL...');
        // Split by semicolon to execute statements individually if needed, 
        // but pg driver can often handle the block. Let's try the whole block first.
        await client.query(sql);

        console.log('✅ Migration applied successfully!');
        await client.end();
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

applyMigration();
