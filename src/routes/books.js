import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getStats,
  isbnExists,
} from '../database.js';
import {
  createBookValidation,
  updateBookValidation,
  validate,
} from '../middleware/validate.js';

const router = Router();

function isUniqueViolation(err) {
  return !!err && typeof err.message === 'string' && err.message.includes('UNIQUE constraint failed');
}

router.get('/books', (req, res) => {
  try {
    const { category, search, page, limit } = req.query;
    res.json(getBooks({ category, search, page, limit }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Registered BEFORE /books/:id so "stats" is never treated as an :id.
router.get('/stats', (_req, res) => {
  try {
    res.json(getStats());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

router.get('/books/:id', (req, res) => {
  try {
    const book = getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

router.post('/books', createBookValidation, validate, (req, res) => {
  try {
    if (req.body.isbn && isbnExists(req.body.isbn)) {
      return res.status(409).json({ error: 'A book with this ISBN already exists' });
    }
    const book = createBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    if (isUniqueViolation(err)) {
      return res.status(409).json({ error: 'A book with this ISBN already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

router.put('/books/:id', updateBookValidation, validate, (req, res) => {
  try {
    const existing = getBookById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Book not found' });

    if (req.body.isbn && isbnExists(req.body.isbn, req.params.id)) {
      return res.status(409).json({ error: 'A book with this ISBN already exists' });
    }

    res.json(updateBook(req.params.id, req.body));
  } catch (err) {
    if (isUniqueViolation(err)) {
      return res.status(409).json({ error: 'A book with this ISBN already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

router.delete('/books/:id', (req, res) => {
  try {
    const existing = getBookById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Book not found' });
    deleteBook(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

export default router;
