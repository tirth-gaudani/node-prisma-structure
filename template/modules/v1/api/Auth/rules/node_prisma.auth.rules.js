const Joi = require('joi');

const authRules = {
    signup: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
        }),
        password: Joi.string().required().min(8).messages({
            'string.min': 'Password must be at least 8 characters long',
        }).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/).messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.',
        }).max(24).messages({
            'string.max': 'Password must not exceed 24 characters',
        }),
    }),
    resend_email: Joi.object({
        user_id: Joi.string().required().messages({
            'string.empty': 'User id is required.',
        }),
    }),
    verify_account: Joi.object({
        verify_token: Joi.string().required().min(64).messages({
            'string.min': 'The verify token must be at least 64 characters long.',
        }),
    }),
    complete_profile: Joi.object({
        name: Joi.string().trim().optional().allow('').pattern(/^[A-Za-z\s]+$/).max(250).messages({
            'string.pattern.base': 'Name must contain only letters and numbers',
            'string.max': 'Name limit exceeded',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
        }),
    }),
    login: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
        }),
        password: Joi.string().required().min(8).messages({
            'string.min': 'Password must be at least 8 characters long',
        }).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/).messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.',
        }).max(24).messages({
            'string.max': 'Password must not exceed 24 characters',
        }),
    }),
    forgot_password: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
        }),
    }),
    reset_password: Joi.object({
        forgot_token: Joi.string().required().min(64).messages({
            'string.min': 'The forgot token must be at least 64 characters long.',
        }),
        new_password: Joi.string().required().min(8).messages({
            'string.min': 'New password must be at least 8 characters long',
        }).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/).messages({
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.',
        }).max(24).messages({
            'string.max': 'New password must not exceed 24 characters',
        }),
        confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({ 'any.only': 'New password and confirm password can be same', }),
    }),
    edit_profile: Joi.object({
        name: Joi.string().trim().optional().allow('').pattern(/^[A-Za-z\s]+$/).max(250).messages({
            'string.pattern.base': 'Name must contain only letters and numbers',
            'string.max': 'Name limit exceeded',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email address',
        }),
    }),
    change_password: Joi.object({
        current_password: Joi.string().required().min(8).messages({
            'string.min': 'New password must be at least 8 characters long',
        }).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/).messages({
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.',
        }).max(24).messages({
            'string.max': 'New password must not exceed 24 characters',
        }),
        new_password: Joi.string().required().min(8).messages({
            'string.min': 'New password must be at least 8 characters long',
        }).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/).messages({
            'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.',
        }).max(24).messages({
            'string.max': 'New password must not exceed 24 characters',
        }),
        confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({ 'any.only': 'New password and confirm password can be same', }),
    }),
};

module.exports = authRules;