// Success Messages
export const SUCCESS_MESSAGES = {
    AUTH: {
        REGISTER_SUCCESS: 'Registration successful. Please verify your email.',
        LOGIN_SUCCESS: 'Login successful',
        LOGOUT_SUCCESS: 'Logout successful',
        EMAIL_VERIFIED: 'Email verified successfully',
        VERIFICATION_EMAIL_SENT: 'Verification email sent',
        PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
        PASSWORD_RESET_SUCCESS: 'Password reset successful',
        PASSWORD_UPDATED: 'Password updated successfully',
    },
    PROFILE: {
        CREATED: 'Profile created successfully',
        UPDATED: 'Profile updated successfully',
        PHOTO_UPLOADED: 'Photo uploaded successfully',
        PHOTO_DELETED: 'Photo deleted successfully',
        DOCUMENT_UPLOADED: 'Document uploaded successfully',
    },
    CONNECTION: {
        REQUEST_SENT: 'Connection request sent',
        REQUEST_ACCEPTED: 'Connection request accepted',
        REQUEST_REJECTED: 'Connection request rejected',
        REQUEST_CANCELLED: 'Connection request cancelled',
    },
    SHORTLIST: {
        ADDED: 'Profile added to shortlist',
        REMOVED: 'Profile removed from shortlist',
    },
    SUBSCRIPTION: {
        SUBSCRIBED: 'Subscription activated successfully',
        CANCELLED: 'Subscription cancelled',
    },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    AUTH: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        EMAIL_ALREADY_EXISTS: 'Email already registered',
        PHONE_ALREADY_EXISTS: 'Phone number already registered',
        USER_NOT_FOUND: 'User not found',
        INVALID_TOKEN: 'Invalid or expired token',
        EMAIL_NOT_VERIFIED: 'Please verify your email first',
        ACCOUNT_SUSPENDED: 'Your account has been suspended',
        ACCOUNT_DELETED: 'This account has been deleted',
        WEAK_PASSWORD: 'Password does not meet security requirements',
        INCORRECT_PASSWORD: 'Current password is incorrect',
    },
    PROFILE: {
        NOT_FOUND: 'Profile not found',
        INCOMPLETE: 'Please complete your profile',
        PHOTO_LIMIT_EXCEEDED: 'Maximum photo limit reached',
        INVALID_FILE_TYPE: 'Invalid file type',
        FILE_TOO_LARGE: 'File size exceeds limit',
        PHOTO_NOT_APPROVED: 'Photo is pending approval',
    },
    CONNECTION: {
        ALREADY_SENT: 'Connection request already sent',
        ALREADY_CONNECTED: 'Already connected with this user',
        REQUEST_NOT_FOUND: 'Connection request not found',
        CANNOT_CONNECT_SELF: 'Cannot send connection request to yourself',
        BLOCKED_USER: 'Cannot connect with this user',
        LIMIT_EXCEEDED: 'Daily connection limit exceeded',
    },
    SUBSCRIPTION: {
        ALREADY_SUBSCRIBED: 'Already have an active subscription',
        PLAN_NOT_FOUND: 'Subscription plan not found',
        PAYMENT_FAILED: 'Payment failed',
    },
    COMMON: {
        UNAUTHORIZED: 'Unauthorized access',
        FORBIDDEN: 'Access forbidden',
        NOT_FOUND: 'Resource not found',
        BAD_REQUEST: 'Invalid request',
        INTERNAL_SERVER_ERROR: 'Internal server error',
        VALIDATION_ERROR: 'Validation failed',
    },
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
    REQUIRED: (field: string) => `${field} is required`,
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PHONE: 'Invalid phone number format',
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
    MAX_LENGTH: (field: string, max: number) => `${field} must not exceed ${max} characters`,
    INVALID_FORMAT: (field: string) => `Invalid ${field} format`,
    MUST_BE_NUMBER: (field: string) => `${field} must be a number`,
    MUST_BE_POSITIVE: (field: string) => `${field} must be positive`,
    INVALID_ENUM: (field: string, values: string[]) => `${field} must be one of: ${values.join(', ')}`,
} as const;
