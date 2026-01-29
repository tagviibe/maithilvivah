export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum MaritalStatus {
    NEVER_MARRIED = 'never_married',
    DIVORCED = 'divorced',
    WIDOWED = 'widowed',
    AWAITING_DIVORCE = 'awaiting_divorce',
}

export enum Religion {
    HINDU = 'hindu',
    MUSLIM = 'muslim',
    CHRISTIAN = 'christian',
    SIKH = 'sikh',
    BUDDHIST = 'buddhist',
    JAIN = 'jain',
    PARSI = 'parsi',
    JEWISH = 'jewish',
    OTHER = 'other',
}

export enum BodyType {
    SLIM = 'slim',
    AVERAGE = 'average',
    ATHLETIC = 'athletic',
    HEAVY = 'heavy',
}

export enum Complexion {
    VERY_FAIR = 'very_fair',
    FAIR = 'fair',
    WHEATISH = 'wheatish',
    DARK = 'dark',
}

export enum BloodGroup {
    A_POSITIVE = 'A+',
    A_NEGATIVE = 'A-',
    B_POSITIVE = 'B+',
    B_NEGATIVE = 'B-',
    O_POSITIVE = 'O+',
    O_NEGATIVE = 'O-',
    AB_POSITIVE = 'AB+',
    AB_NEGATIVE = 'AB-',
}

export enum PhysicalStatus {
    NORMAL = 'normal',
    PHYSICALLY_CHALLENGED = 'physically_challenged',
}

export enum EducationLevel {
    HIGH_SCHOOL = 'high_school',
    DIPLOMA = 'diploma',
    BACHELORS = 'bachelors',
    MASTERS = 'masters',
    PHD = 'phd',
    OTHER = 'other',
}

export enum EmploymentType {
    EMPLOYED = 'employed',
    SELF_EMPLOYED = 'self_employed',
    BUSINESS = 'business',
    NOT_WORKING = 'not_working',
    STUDENT = 'student',
}

export enum FamilyType {
    NUCLEAR = 'nuclear',
    JOINT = 'joint',
}

export enum FamilyStatus {
    MIDDLE_CLASS = 'middle_class',
    UPPER_MIDDLE_CLASS = 'upper_middle_class',
    RICH = 'rich',
    AFFLUENT = 'affluent',
}

export enum FamilyValues {
    TRADITIONAL = 'traditional',
    MODERATE = 'moderate',
    LIBERAL = 'liberal',
}

export enum Diet {
    VEGETARIAN = 'vegetarian',
    NON_VEGETARIAN = 'non_vegetarian',
    EGGETARIAN = 'eggetarian',
    VEGAN = 'vegan',
    JAIN = 'jain',
}

export enum DrinkingHabit {
    NEVER = 'never',
    OCCASIONALLY = 'occasionally',
    SOCIALLY = 'socially',
    REGULARLY = 'regularly',
}

export enum SmokingHabit {
    NEVER = 'never',
    OCCASIONALLY = 'occasionally',
    SOCIALLY = 'socially',
    REGULARLY = 'regularly',
}

export enum ReligiousValue {
    VERY_RELIGIOUS = 'very_religious',
    RELIGIOUS = 'religious',
    MODERATE = 'moderate',
    NOT_RELIGIOUS = 'not_religious',
}

export enum ManglikStatus {
    YES = 'yes',
    NO = 'no',
    ANSHIK = 'anshik',
    DONT_KNOW = 'dont_know',
}

export enum ProfileCreatedBy {
    SELF = 'self',
    PARENT = 'parent',
    SIBLING = 'sibling',
    FRIEND = 'friend',
    RELATIVE = 'relative',
}

export enum ProfileFor {
    SELF = 'self',
    SON = 'son',
    DAUGHTER = 'daughter',
    BROTHER = 'brother',
    SISTER = 'sister',
    FRIEND = 'friend',
    RELATIVE = 'relative',
}

export enum ProfileVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
    PREMIUM_ONLY = 'premium_only',
}

export enum AccountStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    DELETED = 'deleted',
    BANNED = 'banned',
}

export enum ConnectionStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    DOCUMENT = 'document',
    LOCATION = 'location',
}

export enum NotificationType {
    CONNECTION_REQUEST = 'connection_request',
    CONNECTION_ACCEPTED = 'connection_accepted',
    MESSAGE = 'message',
    PROFILE_VIEW = 'profile_view',
    MATCH = 'match',
    PHOTO_APPROVED = 'photo_approved',
    PHOTO_REJECTED = 'photo_rejected',
    SUBSCRIPTION_EXPIRING = 'subscription_expiring',
}

export enum DocumentType {
    BIODATA = 'biodata',
    HOROSCOPE = 'horoscope',
    ID_PROOF = 'id_proof',
    ADDRESS_PROOF = 'address_proof',
}

export enum ApprovalStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum SubscriptionPlanType {
    FREE = 'free',
    PREMIUM = 'premium',
    GOLD = 'gold',
    PLATINUM = 'platinum',
}

export enum SubscriptionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
    PAUSED = 'paused',
}

export enum PaymentStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export enum PaymentGateway {
    RAZORPAY = 'razorpay',
    STRIPE = 'stripe',
    PAYTM = 'paytm',
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
    MODERATOR = 'moderator',
}
