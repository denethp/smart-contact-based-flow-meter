const response = (success, endpoint, code, data) => {
  return {
    status: success ? "SUCCESS" : "ERROR",
    endpoint,
    code,
    data,
  };
};

export { response };
