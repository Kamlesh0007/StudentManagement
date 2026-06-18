import { body } from 'express-validator';

export const studentValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name can only contain letters, spaces, and basic punctuation'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('mobile_number')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian mobile number'),

  body('date_of_birth')
    .notEmpty().withMessage('Date of birth is required')
    .isDate().withMessage('Please provide a valid date')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 15 || age > 60) throw new Error('Age must be between 15 and 60 years');
      return true;
    }),

  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),

  body('course')
    .trim()
    .notEmpty().withMessage('Course is required')
    .isLength({ min: 2, max: 100 }).withMessage('Course must be between 2 and 100 characters'),

  body('year')
    .notEmpty().withMessage('Year is required')
    .isInt({ min: 1, max: 6 }).withMessage('Year must be between 1 and 6'),

  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 10, max: 500 }).withMessage('Address must be between 10 and 500 characters'),
];