// Regex Patterns
export const REGEX_PATTERNS = {
  // Password: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

  // Email
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Phone (Indian format)
  PHONE_INDIAN: /^[6-9]\d{9}$/,

  // Phone (International format)
  PHONE_INTERNATIONAL: /^\+?[1-9]\d{1,14}$/,

  // Phone (alias for PHONE_INDIAN for backward compatibility)
  PHONE: /^[6-9]\d{9}$/,

  // Alphanumeric only
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,

  // Letters only (with spaces)
  LETTERS_ONLY: /^[a-zA-Z\s]+$/,

  // URL
  URL: /^(https?:\/\/)?([\ da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,

  // Pincode (Indian)
  PINCODE: /^[1-9][0-9]{5}$/,

  // UUID
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 50,
    REGEX: REGEX_PATTERNS.PASSWORD,
  },
  EMAIL: {
    MAX_LENGTH: 255,
    REGEX: REGEX_PATTERNS.EMAIL,
  },
  PHONE: {
    LENGTH: 10,
    REGEX: REGEX_PATTERNS.PHONE_INDIAN,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REGEX: REGEX_PATTERNS.LETTERS_ONLY,
  },
  BIO: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 1000,
  },
  AGE: {
    MIN: 18,
    MAX: 100,
  },
  HEIGHT: {
    MIN_CM: 120,
    MAX_CM: 250,
  },
  PHOTO: {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_COUNT: 10,
  },
  DOCUMENT: {
    MAX_SIZE_MB: 10,
    MAX_SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  },
} as const;
