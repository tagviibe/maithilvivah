"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
var common_1 = require("@nestjs/common");
var ProfilesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProfilesService = _classThis = /** @class */ (function () {
        function ProfilesService_1(profileRepository, partnerPreferencesRepository, profilePhotoRepository, progressLogRepository, userRepository, logger) {
            this.profileRepository = profileRepository;
            this.partnerPreferencesRepository = partnerPreferencesRepository;
            this.profilePhotoRepository = profilePhotoRepository;
            this.progressLogRepository = progressLogRepository;
            this.userRepository = userRepository;
            this.logger = logger;
            this.SECTION_WEIGHTS = {
                'basic-info': 15,
                'community-info': 10,
                'location-info': 10,
                'education-info': 15,
                'family-info': 15,
                'lifestyle-info': 10,
                'partner-preferences': 15,
                'photos': 10,
            };
            this.SECTION_ORDER = [
                'basic-info',
                'community-info',
                'location-info',
                'education-info',
                'family-info',
                'lifestyle-info',
                'partner-preferences',
                'photos',
            ];
        }
        // Basic Info
        ProfilesService_1.prototype.updateBasicInfo = function (userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, updatedProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!!profile) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.profileRepository.createProfile(userId)];
                        case 2:
                            profile = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.profileRepository.updateBasicInfo(userId, data)];
                        case 4:
                            updatedProfile = _a.sent();
                            return [4 /*yield*/, this.trackProgress(userId, 'basic-info', 'saved')];
                        case 5:
                            _a.sent();
                            this.logger.log("Basic info updated for user: ".concat(userId), 'ProfilesService');
                            return [2 /*return*/, updatedProfile];
                    }
                });
            });
        };
        ProfilesService_1.prototype.getBasicInfo = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!profile) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    first_name: profile.first_name,
                                    middle_name: profile.middle_name,
                                    last_name: profile.last_name,
                                    date_of_birth: profile.date_of_birth,
                                    gender: profile.gender,
                                    height_cm: profile.height_cm,
                                    weight_kg: profile.weight_kg,
                                    marital_status: profile.marital_status,
                                    body_type: profile.body_type,
                                    complexion: profile.complexion,
                                    disability: profile.disability,
                                    about_me: profile.about_me,
                                }];
                    }
                });
            });
        };
        // Community Info
        ProfilesService_1.prototype.updateCommunityInfo = function (userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, updatedProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!!profile) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.profileRepository.createProfile(userId)];
                        case 2:
                            profile = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.profileRepository.updateCommunityInfo(userId, data)];
                        case 4:
                            updatedProfile = _a.sent();
                            return [4 /*yield*/, this.trackProgress(userId, 'community-info', 'saved')];
                        case 5:
                            _a.sent();
                            this.logger.log("Community info updated for user: ".concat(userId), 'ProfilesService');
                            return [2 /*return*/, updatedProfile];
                    }
                });
            });
        };
        ProfilesService_1.prototype.getCommunityInfo = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!profile) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    religion: profile.religion,
                                    caste: profile.caste,
                                    sub_caste: profile.sub_caste,
                                    gotra: profile.gotra,
                                    mother_tongue: profile.mother_tongue,
                                    manglik: profile.manglik,
                                }];
                    }
                });
            });
        };
        // Location Info
        ProfilesService_1.prototype.updateLocationInfo = function (userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, updatedProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!!profile) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.profileRepository.createProfile(userId)];
                        case 2:
                            profile = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.profileRepository.updateLocationInfo(userId, data)];
                        case 4:
                            updatedProfile = _a.sent();
                            return [4 /*yield*/, this.trackProgress(userId, 'location-info', 'saved')];
                        case 5:
                            _a.sent();
                            this.logger.log("Location info updated for user: ".concat(userId), 'ProfilesService');
                            return [2 /*return*/, updatedProfile];
                    }
                });
            });
        };
        ProfilesService_1.prototype.getLocationInfo = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!profile) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    country: profile.country,
                                    state: profile.state,
                                    city: profile.city,
                                    zip_code: profile.zip_code,
                                    citizenship: profile.citizenship,
                                    residing_country: profile.residing_country,
                                    residing_city: profile.residing_city,
                                }];
                    }
                });
            });
        };
        // Education Info
        ProfilesService_1.prototype.updateEducationInfo = function (userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, updatedProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!!profile) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.profileRepository.createProfile(userId)];
                        case 2:
                            profile = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.profileRepository.updateEducationInfo(userId, data)];
                        case 4:
                            updatedProfile = _a.sent();
                            return [4 /*yield*/, this.trackProgress(userId, 'education-info', 'saved')];
                        case 5:
                            _a.sent();
                            this.logger.log("Education info updated for user: ".concat(userId), 'ProfilesService');
                            return [2 /*return*/, updatedProfile];
                    }
                });
            });
        };
        ProfilesService_1.prototype.getEducationInfo = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!profile) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    highest_education: profile.highest_education,
                                    education_details: profile.education_details,
                                    college_name: profile.college_name,
                                    occupation: profile.occupation,
                                    occupation_details: profile.occupation_details,
                                    annual_income: profile.annual_income,
                                    employer_name: profile.employer_name,
                                }];
                    }
                });
            });
        };
        // Family Info
        ProfilesService_1.prototype.updateFamilyInfo = function (userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, updatedProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!!profile) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.profileRepository.createProfile(userId)];
                        case 2:
                            profile = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.profileRepository.updateFamilyInfo(userId, data)];
                        case 4:
                            updatedProfile = _a.sent();
                            return [4 /*yield*/, this.trackProgress(userId, 'family-info', 'saved')];
                        case 5:
                            _a.sent();
                            this.logger.log("Family info updated for user: ".concat(userId), 'ProfilesService');
                            return [2 /*return*/, updatedProfile];
                    }
                });
            });
        };
        ProfilesService_1.prototype.getFamilyInfo = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!profile) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    father_name: profile.father_name,
                                    father_occupation: profile.father_occupation,
                                    mother_name: profile.mother_name,
                                    mother_occupation: profile.mother_occupation,
                                    brothers_count: profile.brothers_count,
                                    brothers_married: profile.brothers_married,
                                    sisters_count: profile.sisters_count,
                                    sisters_married: profile.sisters_married,
                                    family_type: profile.family_type,
                                    family_status: profile.family_status,
                                    family_values: profile.family_values,
                                    family_location: profile.family_location,
                                }];
                    }
                });
            });
        };
        // Lifestyle Info
        ProfilesService_1.prototype.updateLifestyleInfo = function (userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, updatedProfile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!!profile) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.profileRepository.createProfile(userId)];
                        case 2:
                            profile = _a.sent();
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.profileRepository.updateLifestyleInfo(userId, data)];
                        case 4:
                            updatedProfile = _a.sent();
                            return [4 /*yield*/, this.trackProgress(userId, 'lifestyle-info', 'saved')];
                        case 5:
                            _a.sent();
                            this.logger.log("Lifestyle info updated for user: ".concat(userId), 'ProfilesService');
                            return [2 /*return*/, updatedProfile];
                    }
                });
            });
        };
        ProfilesService_1.prototype.getLifestyleInfo = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            if (!profile) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    diet: profile.diet,
                                    drinking: profile.drinking,
                                    smoking: profile.smoking,
                                    hobbies: profile.hobbies,
                                    interests: profile.interests,
                                    languages_known: profile.languages_known,
                                    special_cases: profile.special_cases,
                                }];
                    }
                });
            });
        };
        // Partner Preferences
        ProfilesService_1.prototype.updatePartnerPreferences = function (userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var preferences;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.partnerPreferencesRepository.createOrUpdate(userId, data)];
                        case 1:
                            preferences = _a.sent();
                            return [4 /*yield*/, this.trackProgress(userId, 'partner-preferences', 'saved')];
                        case 2:
                            _a.sent();
                            this.logger.log("Partner preferences updated for user: ".concat(userId), 'ProfilesService');
                            return [2 /*return*/, preferences];
                    }
                });
            });
        };
        ProfilesService_1.prototype.getPartnerPreferences = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.partnerPreferencesRepository.findByUserId(userId)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // Complete Profile
        ProfilesService_1.prototype.getCompleteProfile = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, preferences, photos;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            return [4 /*yield*/, this.partnerPreferencesRepository.findByUserId(userId)];
                        case 2:
                            preferences = _a.sent();
                            return [4 /*yield*/, this.profilePhotoRepository.findByUserId(userId)];
                        case 3:
                            photos = _a.sent();
                            return [2 /*return*/, {
                                    profile: profile,
                                    preferences: preferences,
                                    photos: photos,
                                }];
                    }
                });
            });
        };
        // Progress Calculation
        ProfilesService_1.prototype.calculateSectionCompletion = function (section, profile, preferences, hasPhotos) {
            switch (section) {
                case 'basic-info':
                    if (!profile)
                        return 0;
                    var basicFields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'height_cm', 'marital_status'];
                    var basicFilled = basicFields.filter(function (f) { return profile[f] != null; }).length;
                    return Math.round((basicFilled / basicFields.length) * 100);
                case 'community-info':
                    if (!profile)
                        return 0;
                    var communityFields = ['religion', 'caste', 'mother_tongue'];
                    var communityFilled = communityFields.filter(function (f) { return profile[f] != null; }).length;
                    return Math.round((communityFilled / communityFields.length) * 100);
                case 'location-info':
                    if (!profile)
                        return 0;
                    var locationFields = ['country', 'state', 'city'];
                    var locationFilled = locationFields.filter(function (f) { return profile[f] != null; }).length;
                    return Math.round((locationFilled / locationFields.length) * 100);
                case 'education-info':
                    if (!profile)
                        return 0;
                    var educationFields = ['highest_education', 'occupation'];
                    var educationFilled = educationFields.filter(function (f) { return profile[f] != null; }).length;
                    return Math.round((educationFilled / educationFields.length) * 100);
                case 'family-info':
                    if (!profile)
                        return 0;
                    var familyFields = ['father_name', 'mother_name', 'family_type'];
                    var familyFilled = familyFields.filter(function (f) { return profile[f] != null; }).length;
                    return Math.round((familyFilled / familyFields.length) * 100);
                case 'lifestyle-info':
                    if (!profile)
                        return 0;
                    return profile.diet ? 100 : 0;
                case 'partner-preferences':
                    if (!preferences)
                        return 0;
                    var prefFields = ['age_min', 'age_max', 'height_min_cm', 'height_max_cm'];
                    var prefFilled = prefFields.filter(function (f) { return preferences[f] != null; }).length;
                    return Math.round((prefFilled / prefFields.length) * 100);
                case 'photos':
                    return hasPhotos ? 100 : 0;
                default:
                    return 0;
            }
        };
        ProfilesService_1.prototype.calculateProfileCompletion = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, preferences, hasPhotos, totalCompletion, _i, _a, section, sectionCompletion, weight;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _b.sent();
                            return [4 /*yield*/, this.partnerPreferencesRepository.findByUserId(userId)];
                        case 2:
                            preferences = _b.sent();
                            return [4 /*yield*/, this.profilePhotoRepository.hasApprovedPhoto(userId)];
                        case 3:
                            hasPhotos = _b.sent();
                            totalCompletion = 0;
                            for (_i = 0, _a = this.SECTION_ORDER; _i < _a.length; _i++) {
                                section = _a[_i];
                                sectionCompletion = this.calculateSectionCompletion(section, profile, preferences, hasPhotos);
                                weight = this.SECTION_WEIGHTS[section];
                                totalCompletion += (sectionCompletion / 100) * weight;
                            }
                            return [2 /*return*/, Math.round(totalCompletion)];
                    }
                });
            });
        };
        // Resume Journey
        ProfilesService_1.prototype.getResumeJourney = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var profile, preferences, hasPhotos, user, progress, lastCompletedSection, currentSection, currentStep, i, section, completion, isCompleted, nextIndex, nextRecommendedSection, completionPercentage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.profileRepository.findByUserId(userId)];
                        case 1:
                            profile = _a.sent();
                            return [4 /*yield*/, this.partnerPreferencesRepository.findByUserId(userId)];
                        case 2:
                            preferences = _a.sent();
                            return [4 /*yield*/, this.profilePhotoRepository.hasApprovedPhoto(userId)];
                        case 3:
                            hasPhotos = _a.sent();
                            return [4 /*yield*/, this.userRepository.findById(userId)];
                        case 4:
                            user = _a.sent();
                            progress = {};
                            lastCompletedSection = null;
                            currentSection = user.last_active_section || 'basic-info';
                            currentStep = user.onboarding_step || 1;
                            for (i = 0; i < this.SECTION_ORDER.length; i++) {
                                section = this.SECTION_ORDER[i];
                                completion = this.calculateSectionCompletion(section, profile, preferences, hasPhotos);
                                isCompleted = completion === 100;
                                progress[section] = {
                                    completed: isCompleted,
                                    percentage: completion,
                                };
                                if (isCompleted) {
                                    lastCompletedSection = section;
                                    currentStep = i + 2; // Next step
                                }
                            }
                            nextIndex = this.SECTION_ORDER.indexOf(lastCompletedSection || 'basic-info') + 1;
                            nextRecommendedSection = nextIndex < this.SECTION_ORDER.length
                                ? this.SECTION_ORDER[nextIndex]
                                : null;
                            return [4 /*yield*/, this.calculateProfileCompletion(userId)];
                        case 5:
                            completionPercentage = _a.sent();
                            return [2 /*return*/, {
                                    currentStep: currentStep,
                                    currentSection: currentSection,
                                    lastCompletedSection: lastCompletedSection,
                                    nextRecommendedSection: nextRecommendedSection,
                                    completionPercentage: completionPercentage,
                                    progress: progress,
                                    lastActivity: user.last_onboarding_activity,
                                }];
                    }
                });
            });
        };
        // Track Progress
        ProfilesService_1.prototype.trackProgress = function (userId, sectionName, action) {
            return __awaiter(this, void 0, void 0, function () {
                var completionPercentage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.calculateProfileCompletion(userId)];
                        case 1:
                            completionPercentage = _a.sent();
                            // Update user's progress fields
                            return [4 /*yield*/, this.userRepository.update(userId, {
                                    last_active_section: sectionName,
                                    last_onboarding_activity: new Date(),
                                    onboarding_step: this.SECTION_ORDER.indexOf(sectionName) + 1,
                                    profile_completion_percentage: completionPercentage,
                                })];
                        case 2:
                            // Update user's progress fields
                            _a.sent();
                            // Log progress
                            return [4 /*yield*/, this.progressLogRepository.logProgress(userId, sectionName, action, completionPercentage)];
                        case 3:
                            // Log progress
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Complete Onboarding
        ProfilesService_1.prototype.completeOnboarding = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var completionPercentage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.calculateProfileCompletion(userId)];
                        case 1:
                            completionPercentage = _a.sent();
                            if (completionPercentage < 100) {
                                throw new common_1.BadRequestException("Profile is only ".concat(completionPercentage, "% complete. Please complete all sections."));
                            }
                            return [4 /*yield*/, this.userRepository.update(userId, {
                                    onboarding_completed: true,
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.progressLogRepository.logProgress(userId, 'onboarding', 'completed', 100)];
                        case 3:
                            _a.sent();
                            this.logger.log("Onboarding completed for user: ".concat(userId), 'ProfilesService');
                            return [2 /*return*/, { message: 'Onboarding completed successfully' }];
                    }
                });
            });
        };
        return ProfilesService_1;
    }());
    __setFunctionName(_classThis, "ProfilesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProfilesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProfilesService = _classThis;
}();
exports.ProfilesService = ProfilesService;
