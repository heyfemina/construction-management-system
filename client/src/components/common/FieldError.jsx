function FieldError({ message }) {
  if (!message) return null;

  return <p className="field-error-line">{message}</p>;
}

export default FieldError;
