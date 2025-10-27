// indexing.js - Script to optimize MongoDB queries with indexes

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Connection settings from .env
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;
const collectionName = process.env.COLLECTION_NAME;

// Validate environment variables
if (!uri || !dbName || !collectionName) {
  console.error('Error: Missing environment variables. Ensure MONGODB_URI, DATABASE_NAME, and COLLECTION_NAME are set in .env');
  process.exit(1);
}

async function runIndexing() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Drop existing indexes (except _id)
    console.log('\nDropping existing indexes (except _id)...');
    await collection.dropIndexes().catch(err => {
      if (err.codeName === 'NamespaceNotFound') {
        console.log('No indexes to drop');
      } else {
        throw err;
      }
    });
    console.log('Existing indexes dropped successfully');

    // 1. Create index on title field
    console.log('\n1. Creating index on title field...');
    await collection.createIndex({ title: 1 }, { name: 'title_1' });
    console.log('Index on title created successfully');

    // 1a. Explain plan for query on title (with index)
    console.log('1a. Explain plan for query on title (with index):');
    const titleExplain = await collection.explain('executionStats').find({ title: 'Dune' });
    console.log('Query: find({ title: "Dune" })');
    console.log(`Execution Time: ${titleExplain.executionStats.executionTimeMillis} ms`);
    console.log(`Documents Scanned: ${titleExplain.executionStats.totalDocsExamined}`);
    console.log(`Index Used: ${titleExplain.queryPlanner.winningPlan.inputStage.indexName || 'None'}`);

    // 2. Create compound index on author and published_year
    console.log('\n2. Creating compound index on author and published_year...');
    await collection.createIndex({ author: 1, published_year: 1 }, { name: 'author_1_published_year_1' });
    console.log('Compound index on author and published_year created successfully');

    // 2a. Explain plan for query on author and published_year
    console.log('2a. Explain plan for query on author and published_year (with compound index):');
    const compoundExplain = await collection.explain('executionStats').find({
      author: 'Margaret Atwood',
      published_year: { $gt: 1980 }
    });
    console.log('Query: find({ author: "Margaret Atwood", published_year: { $gt: 1980 } })');
    console.log(`Execution Time: ${compoundExplain.executionStats.executionTimeMillis} ms`);
    console.log(`Documents Scanned: ${compoundExplain.executionStats.totalDocsExamined}`);
    console.log(`Index Used: ${compoundExplain.queryPlanner.winningPlan.inputStage.indexName || 'None'}`);

    // 3. Explain plan for title query without index (force COLLSCAN)
    console.log('\n3. Explain plan for title query without using title index (using COLLSCAN):');
    const collscanExplain = await collection.explain('executionStats').find({ title: 'Dune' }).hint({ $natural: 1 });
    console.log('Query: find({ title: "Dune" }) without index');
    console.log(`Execution Time: ${collscanExplain.executionStats.executionTimeMillis} ms`);
    console.log(`Documents Scanned: ${collscanExplain.executionStats.totalDocsExamined}`);
    console.log(`Index Used: ${collscanExplain.queryPlanner.winningPlan.inputStage.stage || 'None'}`);

    // 4. List all indexes
    console.log('\n4. Current indexes on the books collection:');
    const indexes = await collection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. Name: ${index.name}, Key: ${JSON.stringify(index.key)}`);
    });

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the function
runIndexing().catch(console.error);