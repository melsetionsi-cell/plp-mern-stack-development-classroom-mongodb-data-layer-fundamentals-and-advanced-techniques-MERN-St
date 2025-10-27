# PLP Bookstore MongoDB Project

This project implements a MongoDB database (`plp_bookstore`) with a `books` collection to manage book data. It includes Node.js scripts to populate the database, perform CRUD operations, execute advanced queries, run aggregation pipelines, and optimize performance with indexing. The project uses the MongoDB Node.js driver and a `.env` file for configuration, assuming a local MongoDB instance by default.

## Table of Contents
- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Database Structure](#database-structure)
- [Scripts](#scripts)
  - [insert_books.js](#insert_booksjs)
  - [queries.js](#queriesjs)
  - [advancedqueries.js](#advancedqueriesjs)
  - [aggregation.js](#aggregationjs)
  - [indexing.js](#indexingjs)
- [Running the Scripts](#running-the-scripts)
- [Verification](#verification)
- [Notes](#notes)
- [License](#license)

## Project Overview
The project creates a MongoDB database (`plp_bookstore`) with a `books` collection containing structured book documents. It includes five scripts to:
1. **Populate the Database**: Inserts 10 book documents with fields like `title`, `author`, `genre`, and `price`.
2. **Perform CRUD Operations**: Demonstrates Create, Read, Update, and Delete operations.
3. **Execute Advanced Queries**: Shows filtering, projection, sorting, and pagination.
4. **Run Aggregation Pipelines**: Analyzes data by calculating averages, counting books, and grouping by decade.
5. **Optimize with Indexing**: Creates indexes and uses `explain()` to demonstrate performance improvements.

The scripts use a `.env` file to manage configuration (e.g., MongoDB URI, database name), ensuring flexibility and security.

## Prerequisites
- **MongoDB**: Version 4.0 or higher, running on `mongodb://localhost:27017`. For MongoDB Atlas, update the URI in `.env`.
- **Node.js**: Version 12 or higher.
- **MongoDB Node.js Driver**: Install via npm.
- **dotenv Package**: For loading environment variables.
- **MongoDB Shell or Compass** (optional): For manual data and query verification.

## Setup Instructions
1. **Install MongoDB**:
   - Install MongoDB locally or use MongoDB Atlas.
   - Ensure the server is running on `mongodb://localhost:27017` (default port) or update the `.env` file for Atlas.

2. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd plp-bookstore
   Install Dependencies:
Install the MongoDB Node.js driver and dotenv:
bashnpm install mongodb dotenv

Create .env File:
Create a .env file in the project root with the following:
envMONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=plp_bookstore
COLLECTION_NAME=books

For MongoDB Atlas, replace MONGODB_URI with your Atlas connection string (e.g., mongodb+srv://<username>:<password>@cluster0.mongodb.net).


Populate the Database:
Run insert_books.js to create and populate the books collection:
bashnode insert_books.js


Database Structure
The plp_bookstore database contains a single collection (books) with 10 documents (initially). Each document has the following schema:
json{
  title: String,
  author: String,
  genre: String,
  published_year: Number,
  price: Number,
  in_stock: Boolean,
  pages: Number,
  publisher: String
}
Example book:
json{
  "title": "Dune",
  "author": "Frank Herbert",
  "genre": "Science Fiction",
  "published_year": 1965,
  "price": 15.99,
  "in_stock": true,
  "pages": 412,
  "publisher": "Chilton Books"
}
Scripts
The project includes five Node.js scripts, each building on the books collection to demonstrate MongoDB’s capabilities. All scripts use environment variables from .env for configuration.
insert_books.js

Purpose: Initializes the books collection with 10 book documents.
Functionality:

Drops the existing books collection (if any) to avoid duplicates.
Inserts 10 books with varied genres (e.g., Science Fiction, Fantasy), authors, and publication years (1963–2018).
Displays inserted books for verification.


Key Features:

Creates a clean dataset for subsequent queries.
Ensures consistent data structure with all required fields.


Example Output:
textConnected to MongoDB server
Collection dropped successfully
10 books were successfully inserted into the database
Inserted books:
1. "Dune" by Frank Herbert (1965)
2. "The Name of the Wind" by Patrick Rothfuss (2007)
...
10. "Circe" by Madeline Miller (2018)
Connection closed


queries.js

Purpose: Demonstrates CRUD operations (Create, Read, Update, Delete).
Functionality:

Read: Finds books by genre ("Science Fiction"), publication year (>2000), and author ("Margaret Atwood").
Update: Updates the price of "Dune" to $17.99.
Delete: Deletes "The Bell Jar".
Displays remaining books after operations.


Key Features:

Shows basic query operations for data retrieval and modification.
Verifies updates and deletions with follow-up queries.


Example Output:
text1. Books in the "Science Fiction" genre:
1. "Dune" by Frank Herbert (1965)
2. "Neuromancer" by William Gibson (1984)
3. "The Martian" by Andy Weir (2014)
...
4. Updating price of "Dune" to 17.99:
Matched 1 book(s), modified 1 book(s)
5. Deleting book "The Bell Jar":
Deleted 1 book(s)
Total books remaining: 9


advancedqueries.js

Purpose: Demonstrates advanced query capabilities with filtering, projection, sorting, and pagination.
Functionality:

Finds books that are in stock and published after 2010, projecting only title, author, and price.
Sorts all books by price (ascending and descending).
Implements pagination (5 books per page) using skip and limit.


Key Features:

Uses projection to limit output fields for efficiency.
Demonstrates sorting and pagination for user-friendly data retrieval.


Example Output:
text1. Books in stock and published after 2010:
1. "Sapiens: A Brief History of Humankind" by Yuval Noah Harari, Price: $18.99
2. "The Martian" by Andy Weir, Price: $12.99
3. "Circe" by Madeline Miller, Price: $16.50
...
4. Pagination - Page 1 (5 books, skip 0):
1. "Dune" by Frank Herbert, Price: $15.99
...


aggregation.js

Purpose: Performs data analysis using aggregation pipelines.
Functionality:

Calculates the average price of books by genre, rounded to 2 decimal places.
Finds the author with the most books in the collection.
Groups books by publication decade (e.g., 1960s, 2010s) and lists titles with counts.


Key Features:

Uses $group, $avg, $sum, $push, and $sort for data transformation.
Projects relevant fields and formats output (e.g., decade as "1960s").


Example Output:
text1. Average price of books by genre:
1. Genre: Non-Fiction, Average Price: $18.99, Books: 1
2. Genre: Fantasy, Average Price: $14.75, Books: 2
...
3. Books grouped by publication decade:
1. Decade: 1960s, Books: 2
   Titles:
   1. "Dune" (1965)
   2. "The Bell Jar" (1963)
...


indexing.js

Purpose: Optimizes query performance with indexes and analyzes results.
Functionality:

Creates a single index on the title field.
Creates a compound index on author and published_year.
Uses explain('executionStats') to compare performance of indexed vs. non-indexed queries (e.g., find({ title: "Dune" })).
Lists all indexes for verification.


Key Features:

Demonstrates performance improvements (fewer documents scanned, faster execution).
Forces a collection scan (COLLSCAN) to simulate non-indexed performance.


Example Output:
text1. Creating index on title field...
Index on title created successfully
1a. Explain plan for query on title (with index):
Query: find({ title: "Dune" })
Execution Time: 0 ms
Documents Scanned: 1
Index Used: title_1
...
3. Explain plan for title query without using title index:
Documents Scanned: 10
Index Used: COLLSCAN


Running the Scripts

Set Up .env:
Ensure the .env file exists with valid values for MONGODB_URI, DATABASE_NAME, and COLLECTION_NAME.
Populate the Database:
bashnode insert_books.js
This creates the books collection with 10 documents. Run this first to ensure a clean dataset.
Execute Other Scripts:
bashnode queries.js
node advancedqueries.js
node aggregation.js
node indexing.js

Note: queries.js deletes "The Bell Jar" and updates "Dune"’s price, reducing the collection to 9 books and affecting subsequent scripts. Rerun insert_books.js to reset the collection if needed.


Order of Execution:

Run insert_books.js first to populate the database.
Run queries.js, advancedqueries.js, aggregation.js, and indexing.js in any order, but note that queries.js modifies the collection.
To restore the original 10 books, rerun insert_books.js before other scripts.



Verification

Inspect the Collection:
Use the MongoDB shell or MongoDB Compass:
javascriptuse plp_bookstore
db.books.find().pretty()

Verify Indexes:
javascriptdb.books.getIndexes()

Test Queries:
Run individual queries or aggregations in the MongoDB shell, e.g.:
javascriptdb.books.find({ genre: "Science Fiction" })
db.books.explain('executionStats').find({ title: "Dune" })
db.books.aggregate([{ $group: { _id: "$genre", averagePrice: { $avg: "$price" } } }])


Notes

.env Configuration:

Ensure the .env file is correctly set up and not committed to version control (add .env to .gitignore).
Update MONGODB_URI for Atlas or other setups.

