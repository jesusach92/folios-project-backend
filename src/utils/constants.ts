export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "User not authenticated",
  FORBIDDEN: "Insufficient permissions",
  USER_NOT_FOUND: "User not found",
  FOLIO_NOT_FOUND: "Folio not found",
  PROCESS_NOT_FOUND: "Process not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_INACTIVE: "User account is inactive",
  EMAIL_EXISTS: "User with this email already exists",
  INVALID_QUANTITY: "Invalid quantity provided",
  FOLIO_NOT_CLOSABLE: "Cannot close folio: not all pieces are completed",
  PROCESS_NOT_STARTABLE: "Can only start NOT_STARTED processes",
  PROCESS_NOT_PAUSABLE: "Can only pause IN_PROGRESS processes",
  QUANTITY_EXCEEDS_REMAINING: "Quantity completed exceeds remaining quantity"
};

export const PROCESS_STATUS_TRANSITIONS = {
  NOT_STARTED: ["IN_PROGRESS", "PAUSED"],
  IN_PROGRESS: ["PAUSED", "COMPLETED"],
  PAUSED: ["IN_PROGRESS", "COMPLETED"],
  COMPLETED: []
};

export const UNITARIO_PROCESS_LIMIT = 1;

export const DEFAULT_PAGINATION = {
  LIMIT: 50,
  OFFSET: 0
};

export const AUDIT_RETENTION_DAYS = 365;
