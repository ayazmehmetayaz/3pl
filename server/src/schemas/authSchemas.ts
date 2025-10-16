import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz',
    'any.required': 'E-posta adresi gereklidir'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Şifre en az 6 karakter olmalıdır',
    'any.required': 'Şifre gereklidir'
  })
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz',
    'any.required': 'E-posta adresi gereklidir'
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).required().messages({
    'string.min': 'Şifre en az 8 karakter olmalıdır',
    'string.pattern.base': 'Şifre en az bir küçük harf, bir büyük harf, bir rakam ve bir özel karakter içermelidir',
    'any.required': 'Şifre gereklidir'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Ad en az 2 karakter olmalıdır',
    'string.max': 'Ad en fazla 50 karakter olmalıdır',
    'any.required': 'Ad gereklidir'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Soyad en az 2 karakter olmalıdır',
    'string.max': 'Soyad en fazla 50 karakter olmalıdır',
    'any.required': 'Soyad gereklidir'
  }),
  phone: Joi.string().pattern(/^(\+90|0)?[5][0-9]{9}$/).optional().messages({
    'string.pattern.base': 'Geçerli bir telefon numarası giriniz'
  })
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token gereklidir'
  })
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Geçerli bir e-posta adresi giriniz',
    'any.required': 'E-posta adresi gereklidir'
  })
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().uuid().required().messages({
    'string.uuid': 'Geçerli bir token giriniz',
    'any.required': 'Token gereklidir'
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).required().messages({
    'string.min': 'Şifre en az 8 karakter olmalıdır',
    'string.pattern.base': 'Şifre en az bir küçük harf, bir büyük harf, bir rakam ve bir özel karakter içermelidir',
    'any.required': 'Şifre gereklidir'
  })
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'any.required': 'Mevcut şifre gereklidir'
  }),
  newPassword: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).required().messages({
    'string.min': 'Yeni şifre en az 8 karakter olmalıdır',
    'string.pattern.base': 'Yeni şifre en az bir küçük harf, bir büyük harf, bir rakam ve bir özel karakter içermelidir',
    'any.required': 'Yeni şifre gereklidir'
  })
});
