const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool using the DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Simple query helper function
async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

async function checkDatabase() {
  try {
    console.log('Checking database connection and schema...');
    
    // Test the connection
    await query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Check if the table exists
    const tableCheck = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'json_configs'
      )`
    );
    
    const tableExists = tableCheck.rows[0].exists;
    console.log(`\nTable 'json_configs' exists: ${tableExists}`);
    
    if (tableExists) {
      // Check table structure
      const tableInfo = await query(
        `SELECT column_name, data_type, is_nullable 
         FROM information_schema.columns 
         WHERE table_name = 'json_configs'`
      );
      
      console.log('\nTable structure:');
      console.table(tableInfo.rows);
      
      // Check if we have any data
      const rowCount = await query('SELECT COUNT(*) FROM json_configs');
      console.log(`\nTotal rows in json_configs: ${rowCount.rows[0].count}`);
      
      // Show first few rows
      if (rowCount.rows[0].count > 0) {
        const sampleData = await query('SELECT * FROM json_configs LIMIT 5');
        console.log('\nSample data:');
        sampleData.rows.forEach(row => {
          console.log(`\nKey: ${row.config_key}`);
          console.log('Last Updated:', row.last_updated);
          console.log('Data Keys:', Object.keys(row.config_data || {}));
          console.log('---');
        });
      }
    } else {
      console.log('\nThe json_configs table does not exist. You may need to run your database migrations.');
      
      // Create the table if it doesn't exist
      console.log('\nWould you like to create the json_configs table? (y/n)');
      process.stdin.resume();
      process.stdin.once('data', async (data) => {
        if (data.toString().trim().toLowerCase() === 'y') {
          try {
            await query(`
              CREATE TABLE IF NOT EXISTS json_configs (
                config_key VARCHAR(255) PRIMARY KEY,
                config_data JSONB NOT NULL,
                last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
              )
            `);
            console.log('✅ Created json_configs table');
          } catch (err) {
            console.error('Error creating table:', err);
          } finally {
            pool.end();
            process.exit(0);
          }
        } else {
          console.log('Skipping table creation');
          pool.end();
          process.exit(0);
        }
      });
      return;
    }
    
    // Check database version
    const version = await query('SELECT version()');
    console.log('\nDatabase version:', version.rows[0].version);
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\nCould not connect to the database. Please check:');
      console.error('1. Is your database server running?');
      console.error('2. Is the DATABASE_URL in your .env file correct?');
      console.error('3. Are the database credentials correct?');
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

checkDatabase();
