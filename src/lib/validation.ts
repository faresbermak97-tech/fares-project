import DOMPurify from 'isomorphic-dompurify';

// Email validation regex
export const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Validate email format
export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

// Sanitize and validate name
export const validateName = (name: string): { isValid: boolean; sanitized: string; error?: string } => {
  if (typeof name !== 'string') {
    return { isValid: false, sanitized: '', error: 'Name must be a string' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, sanitized: '', error: 'Name must be at least 2 characters' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, sanitized: '', error: 'Name must be less than 100 characters' };
  }

  // Sanitize the name to prevent XSS
  const sanitizedName = DOMPurify.sanitize(trimmedName);

  return { isValid: true, sanitized: sanitizedName };
};

// Sanitize and validate email
export const validateEmail = (email: string): { isValid: boolean; sanitized: string; error?: string } => {
  if (typeof email !== 'string') {
    return { isValid: false, sanitized: '', error: 'Email must be a string' };
  }

  const trimmedEmail = email.trim();

  if (!isValidEmail(trimmedEmail)) {
    return { isValid: false, sanitized: '', error: 'Please provide a valid email address' };
  }

  // Sanitize the email to prevent XSS
  const sanitizedEmail = DOMPurify.sanitize(trimmedEmail);

  return { isValid: true, sanitized: sanitizedEmail };
};

// Sanitize and validate message
export const validateMessage = (message: string): { isValid: boolean; sanitized: string; error?: string } => {
  if (typeof message !== 'string') {
    return { isValid: false, sanitized: '', error: 'Message must be a string' };
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length < 10) {
    return { isValid: false, sanitized: '', error: 'Message must be at least 10 characters' };
  }

  if (trimmedMessage.length > 2000) {
    return { isValid: false, sanitized: '', error: 'Message must be less than 2000 characters' };
  }

  // Sanitize the message to prevent XSS
  const sanitizedMessage = DOMPurify.sanitize(trimmedMessage);

  return { isValid: true, sanitized: sanitizedMessage };
};

// Validate all contact form fields
export const validateContactForm = (data: { name: string; email: string; message: string }) => {
  const nameValidation = validateName(data.name);
  const emailValidation = validateEmail(data.email);
  const messageValidation = validateMessage(data.message);

  const isValid = nameValidation.isValid && emailValidation.isValid && messageValidation.isValid;

  return {
    isValid,
    name: nameValidation,
    email: emailValidation,
    message: messageValidation,
  };
};
