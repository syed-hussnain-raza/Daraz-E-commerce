// HTTP status codes
const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

// Error messages
const ERRORS = {
  REQUIRED: (param) => `Bad Request: '${param}' is required`,
  INVALID_TYPE: (param) => `Bad Request: invalid '${param}' format`,
  NOT_FOUND: (resource) => `${resource} not found`,
};

// Response shape helpers
const successResponse = (data) => ({ success: true, data });
const errorResponse = (message) => ({ success: false, message });

const handleResponse = (res, data, options = {}) => {
  const { rules = {}, required = {}, notFoundResource } = options;

  // 400: required param missing (used for req.params)
  for (const [param, value] of Object.entries(required)) {
    if (!value) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(errorResponse(ERRORS.REQUIRED(param)));
    }
  }

  // 400: wrong type (used for req.query)
  for (const [param, { value, type }] of Object.entries(rules)) {
    if (value !== undefined && typeof value !== type) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(errorResponse(ERRORS.INVALID_TYPE(param)));
    }
  }

  // 404: data not found
  if (notFoundResource && (data === null || data === undefined)) {
    return res
      .status(STATUS.NOT_FOUND)
      .json(errorResponse(ERRORS.NOT_FOUND(notFoundResource)));
  }

  // 200: all good
  return res.status(STATUS.OK).json(successResponse(data));
};

module.exports = { handleResponse, STATUS, ERRORS };
