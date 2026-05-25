export function validateRequired(fields) {
  const missing = fields.find(({ value }) => String(value || "").trim() === "");

  if (missing) {
    return `${missing.label} is required`;
  }

  return "";
}

export function validateEmail(value) {
  const email = String(value || "").trim();

  if (!email) {
    return "";
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? ""
    : "Enter a valid email address";
}

export function validatePhone(value) {
  const phone = String(value || "").trim();

  if (!phone) {
    return "";
  }

  return /^[0-9+\-\s()]{7,20}$/.test(phone)
    ? ""
    : "Enter a valid contact number";
}

export function validatePositiveNumber(value, label) {
  return Number(value) > 0 ? "" : `${label} must be greater than 0`;
}

export function validateNonNegativeNumber(value, label) {
  return Number(value) >= 0 ? "" : `${label} cannot be negative`;
}
