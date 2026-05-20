const isConnectionError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "";

  return (
    Boolean(error?.isConnectionError) ||
    message.includes("Could not complete this request") ||
    message.includes("getaddrinfo") ||
    message.includes("EAI_AGAIN") ||
    message.includes("ECONNREFUSED") ||
    message.includes("pooler.supabase.com")
  );
};

export default isConnectionError;
