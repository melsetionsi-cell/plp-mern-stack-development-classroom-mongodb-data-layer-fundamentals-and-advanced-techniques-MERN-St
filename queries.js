// queries.js - Script to perform MongoDB CRUD operations on the books collection

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

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Find books in the Science Fiction genre
    console.log('\n1. Books in the "Science Fiction" genre:');
    const sciFiBooks = await collection.find({ genre: 'Science Fiction' }).toArray();
    sciFiBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });
    console.log(`Found ${sciFiBooks.length} books in Science Fiction genre`);

    // 2. Find books published after 2000
    console.log('\n2. Books published after 2000:');
    const post2000Books = await collection.find({ published_year: { $gt: 2000 } }).toArray();
    post2000Books.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });
    console.log(`Found ${post2000Books.length} books published after 2000`);

    // 3. Find books by Margaret Atwood
    console.log('\n3. Books by Margaret Atwood:');
    const atwoodBooks = await collection.find({ author: 'Margaret Atwood' }).toArray();
    atwoodBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });
    console.log(`Found ${atwoodBooks.length} books by Margaret Atwood`);

    // 4. Update price of "Dune" to 17.99
    console.log('\n4. Updating price of "Dune" to 17.99:');
    const updateResult = await collection.updateOne(
      { title: 'Dune' },
      { $set: { price: 17.99 } }
    );
    console.log(`Matched ${updateResult.matchedCount} book(s), modified ${updateResult.modifiedCount} book(s)`);
    const updatedBook = await collection.findOne({ title: 'Dune' });
    console.log(`Updated book: "${updatedBook.title}" by ${updatedBook.author}, Price: $${updatedBook.price}`);

    // 5. Delete "The Bell Jar"
    console.log('\n5. Deleting book "The Bell Jar":');
    const deleteResult = await collection.deleteOne({ title: 'The Bell Jar' });
    console.log(`Deleted ${deleteResult.deletedCount} book(s)`);
    const deletedBook = await collection.findOne({ title: 'The Bell Jar' });
    console.log(`Book "The Bell Jar" after deletion: ${deletedBook ? 'Not deleted' : 'Successfully deleted'}`);

    // 6. Display remaining books
    console.log('\nRemaining books in the collection:');
    const remainingBooks = await collection.find({}).toArray();
    remainingBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });
    console.log(`Total books remaining: ${remainingBooks.length}`);

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the function
runQueries().catch(console.error);