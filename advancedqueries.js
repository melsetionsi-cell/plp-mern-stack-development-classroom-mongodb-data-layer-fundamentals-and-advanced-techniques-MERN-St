// advancedqueries.js - Script to perform advanced MongoDB queries

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

async function runAdvancedQueries() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Find books in stock and published after 2010 (projection: title, author, price)
    console.log('\n1. Books in stock and published after 2010:');
    const recentInStockBooks = await collection.find(
      { in_stock: true, published_year: { $gt: 2010 } },
      { projection: { _id: 0, title: 1, author: 1, price: 1 } }
    ).toArray();
    recentInStockBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author}, Price: $${book.price}`);
    });
    console.log(`Found ${recentInStockBooks.length} books`);

    // 2. Sort all books by price ascending
    console.log('\n2. All books sorted by price ascending:');
    const sortedAscBooks = await collection.find({}, { projection: { _id: 0, title: 1, author: 1, price: 1 } })
      .sort({ price: 1 })
      .toArray();
    sortedAscBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author}, Price: $${book.price}`);
    });
    console.log(`Total books: ${sortedAscBooks.length}`);

    // 3. Sort all books by price descending
    console.log('\n3. All books sorted by price descending:');
    const sortedDescBooks = await collection.find({}, { projection: { _id: 0, title: 1, author: 1, price: 1 } })
      .sort({ price: -1 })
      .toArray();
    sortedDescBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author}, Price: $${book.price}`);
    });
    console.log(`Total books: ${sortedDescBooks.length}`);

    // 4. Pagination (5 books per page)
    const pageSize = 5;
    console.log('\n4. Pagination - Page 1 (5 books, skip 0):');
    const page1Books = await collection.find({}, { projection: { _id: 0, title: 1, author: 1, price: 1 } })
      .skip(0)
      .limit(pageSize)
      .toArray();
    page1Books.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author}, Price: $${book.price}`);
    });
    console.log(`Books on page 1: ${page1Books.length}`);

    console.log('\n   Pagination - Page 2 (5 books, skip 5):');
    const page2Books = await collection.find({}, { projection: { _id: 0, title: 1, author: 1, price: 1 } })
      .skip(pageSize)
      .limit(pageSize)
      .toArray();
    page2Books.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author}, Price: $${book.price}`);
    });
    console.log(`Books on page 2: ${page2Books.length}`);

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the function
runAdvancedQueries().catch(console.error);