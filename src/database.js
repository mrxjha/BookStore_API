import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'bookstore.db');

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

export const ALLOWED_CATEGORIES = [
  'fiction',
  'non-fiction',
  'science',
  'technology',
  'history',
];

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE,
    price REAL NOT NULL CHECK (price > 0),
    category TEXT NOT NULL CHECK (category IN ('fiction','non-fiction','science','technology','history')),
    stock INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

const countRow = db.prepare('SELECT COUNT(*) AS count FROM books').get();
if (countRow.count === 0) {
  const seed = db.prepare(
    'INSERT INTO books (title, author, isbn, price, category, stock) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const samples = [
    ['The Pragmatic Programmer', 'David Thomas & Andrew Hunt', '9780135957059', 49.99, 'technology', 25],
    ['Dune', 'Frank Herbert', '9780441013593', 15.99, 'fiction', 40],
    ['A Brief History of Time', 'Stephen Hawking', '9780553380163', 18.99, 'science', 30],
    ['Clean Code', 'Robert C. Martin', '9780132350884', 39.99, 'technology', 20],
    ['Sapiens', 'Yuval Noah Harari', '9780062316097', 22.99, 'history', 35],
  ];
  db.exec('BEGIN');
  try {
    for (const r of samples) seed.run(...r);
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

export function getBooks({ category, search, page, limit } = {}) {
  const where = [];
  const params = [];
  if (category) {
    where.push('category = ?');
    params.push(category);
  }
  if (search) {
    where.push('(title LIKE ? COLLATE NOCASE OR author LIKE ? COLLATE NOCASE)');
    const pattern = `%${search}%`;
    params.push(pattern, pattern);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (pageNum - 1) * limitNum;

  const totalRow = db.prepare(`SELECT COUNT(*) AS count FROM books ${whereSql}`).get(...params);
  const books = db
    .prepare(`SELECT * FROM books ${whereSql} ORDER BY createdAt DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...params, limitNum, offset);

  return {
    books,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalRow.count,
      totalPages: Math.ceil(totalRow.count / limitNum),
    },
  };
}

export function getBookById(id) {
  return db.prepare('SELECT * FROM books WHERE id = ?').get(Number.parseInt(id, 10));
}

export function createBook(data) {
  const { title, author, isbn = null, price, category, stock = 0 } = data;
  const result = db
    .prepare(
      'INSERT INTO books (title, author, isbn, price, category, stock) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(title, author, isbn, price, category, stock);
  return getBookById(result.lastInsertRowid);
}

export function updateBook(id, data) {
  const existing = getBookById(id);
  if (!existing) return null;

  const fields = ['title', 'author', 'isbn', 'price', 'category', 'stock'];
  const sets = [];
  const values = [];
  for (const f of fields) {
    if (Object.prototype.hasOwnProperty.call(data, f)) {
      sets.push(`${f} = ?`);
      values.push(data[f]);
    }
  }
  // Empty body: return the unchanged book without bumping updatedAt.
  if (sets.length === 0) return existing;

  sets.push('updatedAt = CURRENT_TIMESTAMP');
  values.push(Number.parseInt(id, 10));
  db.prepare(`UPDATE books SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return getBookById(id);
}

export function deleteBook(id) {
  const result = db.prepare('DELETE FROM books WHERE id = ?').run(Number.parseInt(id, 10));
  return result.changes > 0;
}

export function getStats() {
  const totalBooks = db.prepare('SELECT COUNT(*) AS c FROM books').get().c;
  const totalValueRow = db.prepare('SELECT COALESCE(SUM(price * stock), 0) AS v FROM books').get();
  const avgPriceRow = db.prepare('SELECT AVG(price) AS avg FROM books').get();
  const categoryRows = db
    .prepare('SELECT category, COUNT(*) AS c FROM books GROUP BY category')
    .all();

  const booksByCategory = {};
  for (const row of categoryRows) booksByCategory[row.category] = row.c;

  return {
    totalBooks,
    totalValue: Number(Number(totalValueRow.v).toFixed(2)),
    booksByCategory,
    averagePrice: avgPriceRow.avg === null ? 0 : Number(Number(avgPriceRow.avg).toFixed(2)),
  };
}

export function isbnExists(isbn, excludeId = null) {
  if (!isbn) return false;
  const row = excludeId
    ? db.prepare('SELECT id FROM books WHERE isbn = ? AND id != ?').get(isbn, Number.parseInt(excludeId, 10))
    : db.prepare('SELECT id FROM books WHERE isbn = ?').get(isbn);
  return !!row;
}

export default db;
