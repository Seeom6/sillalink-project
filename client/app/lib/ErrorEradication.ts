export const HandleError = (error: any): string => {
  const message =
    (error.response?.data?.error?.message) ||
    (error.response?.data?.message) ||
    error.message ||
    error.toString();
  return message;
};

export default HandleError;
