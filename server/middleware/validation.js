const { body, validationResult } = require('express-validator');

const validateProduct = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('category').notEmpty().withMessage('Category is required'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
];

const validateOrder = [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('products').isArray().withMessage('Products must be an array'),
    body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
];

const validateUser = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateProduct,
    validateOrder,
    validateUser,
    validateRequest,
};