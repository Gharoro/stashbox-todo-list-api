const errorResponse = (res, status_code, error) => {
  return res.status(status_code).json({
    success: false,
    error: error,
  });
}

const successResponse = (res, status_code, message, data = null) => {
  return res.status(status_code).json({
    success: true,
    message: message,
    data: data || null,
  });
}

module.exports = { successResponse, errorResponse };
