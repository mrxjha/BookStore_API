import { body, validationResult } from 'express-validator';

const ALLOWED_CATEGORIES = ['fiction', 'non-fiction', 'science', 'technology', 'history'];

// CREATE — all required fields enforced.
export const createBookValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be at most 200 characters'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a number greater than 0'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .bail()
    .isIn(ALLOWED_CATEGORIES)
    .withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`),
  body('isbn')
    .optional()
    .isLength({ min: 13, max: 13 })
    .withMessage('ISBN must be exactly 13 characters'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
];

// UPDATE — every field optional, but same constraints when present.
export const updateBookValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must be at most 200 characters'),
  body('author').optional().trim().notEmpty().withMessage('Author cannot be empty'),
  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a number greater than 0'),
  body('category')
    .optional()
    .trim()
    .isIn(ALLOWED_CATEGORIES)
    .withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`),
  body('isbn')
    .optional()
    .isLength({ min: 13, max: 13 })
    .withMessage('ISBN must be exactly 13 characters'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
];

// Collects validation results; on failure returns 400 with a details array.
export function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return res.status(400).json({ error: 'Validation failed', details });
  }
  next();
}
