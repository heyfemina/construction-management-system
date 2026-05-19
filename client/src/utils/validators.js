export const validateEmail = (email) => {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(
    email
  );
};

export const validatePhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim() !== "";
};