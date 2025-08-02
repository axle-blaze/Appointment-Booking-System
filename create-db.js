const { Client } = require('pg');

async function createDatabase() {
  // First connect to postgres database to create our database
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    // Check if database exists
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'doctor_appointment'"
    );
    
    if (checkDb.rows.length === 0) {
      // Create the database
      await client.query('CREATE DATABASE doctor_appointment');
      console.log('Database "doctor_appointment" created successfully!');
    } else {
      console.log('Database "doctor_appointment" already exists');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();
