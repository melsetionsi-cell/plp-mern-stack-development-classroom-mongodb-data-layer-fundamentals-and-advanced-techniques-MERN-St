// aggregation.js - Script to perform MongoDB aggregation pipelines

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

async function runAggregations() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Average price of books by genre
    console.log('\n1. Average price of books by genre:');
    const avgPriceByGenre = await collection.aggregate([
      { $group: { _id: '$genre', averagePrice: { $avg: '$price' }, bookCount: { $sum: 1 } } },
      { $project: { genre: '$_id', averagePrice: { $round: ['$averagePrice', 2] }, bookCount: 1, _id: 0 } },
      { $sort: { averagePrice: -1 } }
    ]).toArray();
    avgPriceByGenre.forEach((result, index) => {
      console.log(`${index + 1}. Genre: ${result.genre}, Average Price: $${result.averagePrice}, Books: ${result.bookCount}`);
    });
    console.log(`Found ${avgPriceByGenre.length} genres`);

    // 2. Find the author with the most books
    console.log('\n2. Author with the most books:');
    const topAuthor = await collection.aggregate([
      { $group: { _id: '$author', bookCount: { $sum: 1 } } },
      { $sort: { bookCount: -1 } },
      { $limit: 1 },
      { $project: { author: '$_id', bookCount: 1, _id: 0 } }
    ]).toArray();
    if (topAuthor.length > 0) {
      console.log(`Author: ${topAuthor[0].author}, Number of Books: ${topAuthor[0].bookCount}`);
    } else {
      console.log('No authors found');
    }

    // 3. Group books by publication decade
    console.log('\n3. Books grouped by publication decade:');
    const booksByDecade = await collection.aggregate([
      { $addFields: { decade: { $floor: { $divide: ['$published_year', 10] } } } },
      { $group: { _id: '$decade', bookCount: { $sum: 1 }, books: { $push: { title: '$title', year: '$published_year' } } } },
      { $project: { decade: { $concat: [{ $toString: { $multiply: ['$_id', 10] } }, 's'] }, bookCount: 1, books: 1, _id: 0 } },
      { $sort: { decade: 1 } }
    ]).toArray();
    booksByDecade.forEach((result, index) => {
      console.log(`${index + 1}. Decade: ${result.decade}, Books: ${result.bookCount}`);
      console.log('   Titles:');
      result.books.forEach((book, bookIndex) => {
        console.log(`   ${bookIndex + 1}. "${book.title}" (${book.year})`);
      });
    });

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the function
runAggregations().catch(console.error);