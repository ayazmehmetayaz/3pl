import Joi from 'joi';

export const createUserSchema = Joi.object({
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
  }),
  roles: Joi.array().items(Joi.string().uuid()).optional().messages({
    'array.base': 'Roller bir dizi olmalıdır',
    'string.uuid': 'Geçerli rol ID\'leri giriniz'
  })
});

export const updateUserSchema = Joi.object({
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
  }),
  isActive: Joi.boolean().optional().messages({
    'boolean.base': 'Durum true veya false olmalıdır'
  })
});

export const assignRoleSchema = Joi.object({
  roleId: Joi.string().uuid().required().messages({
    'string.uuid': 'Geçerli bir rol ID giriniz',
    'any.required': 'Rol ID gereklidir'
  })
});

export const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    'boolean.base': 'Durum true veya false olmalıdır',
    'any.required': 'Durum gereklidir'
  })
});
