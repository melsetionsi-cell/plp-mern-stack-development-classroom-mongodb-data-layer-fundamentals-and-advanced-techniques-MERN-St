// insert_books.js - Script to populate MongoDB with sample book data

// Import required modules
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

// Sample book data (10 books)
const books = [
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    published_year: 1965,
    price: 15.99,
    in_stock: true,
    pages: 412,
    publisher: 'Chilton Books'
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genre: 'Fantasy',
    published_year: 2007,
    price: 13.50,
    in_stock: true,
    pages: 662,
    publisher: 'DAW Books'
  },
  {
    title: 'The Bell Jar',
    author: 'Sylvia Plath',
    genre: 'Fiction',
    published_year: 1963,
    price: 10.99,
    in_stock: false,
    pages: 294,
    publisher: 'Heinemann'
  },
  {
    title: 'Neuromancer',
    author: 'William Gibson',
    genre: 'Science Fiction',
    published_year: 1984,
    price: 12.75,
    in_stock: true,
    pages: 271,
    publisher: 'Ace Books'
  },
  {
    title: 'The Handmaid\'s Tale',
    author: 'Margaret Atwood',
    genre: 'Dystopian',
    published_year: 1985,
    price: 11.99,
    in_stock: true,
    pages: 311,
    publisher: 'McClelland & Stewart'
  },
  {
    title: 'Good Omens',
    author: 'Neil Gaiman, Terry Pratchett',
    genre: 'Fantasy',
    published_year: 1990,
    price: 14.25,
    in_stock: true,
    pages: 432,
    publisher: 'Gollancz'
  },
  {
    title: 'The Road',
    author: 'Cormac McCarthy',
    genre: 'Post-Apocalyptic',
    published_year: 2006,
    price: 9.99,
    in_stock: false,
    pages: 287,
    publisher: 'Knopf'
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    published_year: 2011,
    price: 18.99,
    in_stock: true,
    pages: 443,
    publisher: 'Harvill Secker'
  },
  {
    title: 'The Martian',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    published_year: 2014,
    price: 12.99,
    in_stock: true,
    pages: 369,
    publisher: 'Crown Publishing'
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    genre: 'Fantasy',
    published_year: 2018,
    price: 16.50,
    in_stock: true,
    pages: 393,
    publisher: 'Little, Brown and Company'
  }
];

// Function to insert books into MongoDB
async function insertBooks() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Drop existing collection to start fresh
    await collection.drop().catch(err => {
      if (err.codeName === 'NamespaceNotFound') {
        console.log('Collection does not exist, proceeding to create new one');
      } else {
        throw err;
      }
    });
    console.log('Collection dropped successfully');

    // Insert the books
    const result = await collection.insertMany(books);
    console.log(`${result.insertedCount} books were successfully inserted into the database`);

    // Display the inserted books
    console.log('\nInserted books:');
    const insertedBooks = await collection.find({}).toArray();
    insertedBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the function
insertBooks().catch(console.error);