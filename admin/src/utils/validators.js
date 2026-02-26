export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhoneNumber = (phone) => {
  const regex = /^\d{10}$/; // Adjust the regex based on your phone number format
  return regex.test(phone);
};

export const validateRequired = (value) => {
  return value.trim() !== '';
};

export const validatePassword = (password) => {
  return password.length >= 6; // Minimum password length
};

export const validateForm = (form) => {
  const errors = {};
  
  if (!validateRequired(form.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateEmail(form.email)) {
    errors.email = 'Invalid email address';
  }
  
  if (!validatePhoneNumber(form.phone)) {
    errors.phone = 'Invalid phone number';
  }
  
  if (!validatePassword(form.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};