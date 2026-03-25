import config from "@prettylab/config";

const message = {
  NOT_FOUND: "not_found",
  INTERNAL_SERVER_ERROR: "internal_server_error",
  TECHNICAL_BREAK: "technical_break",
  OK: "ok",

  CREATE_SUCCESS: "create_success",
  CREATE_ERROR: "create_error",

  UPDATE_SUCCESS: "update_success",
  UPDATE_ERROR: "update_error",

  DELETE_SUCCESS: "delete_success",
  DELETE_ERROR: "delete_error",

  UNAUTHORIZED: "unauthorized",

  NO_TOKEN_PROVIDED: "no_token_provided",
  SESSION_INVALID: "session_invalid",
  SESSION_EXPIRED: "session_expired",

  INVALID_CREDENTIALS: "invalid_credentials",
  LOGIN_SUCCESS: "login_success",
  LOGOUT_SUCCESS: "logout_success",

  ...(config.api?.message || {}),
};

export const matchMessageMeta = {
  [message.NOT_FOUND]: {
    code: 404,
    success: false,
    notifyWariant: "warning",
  },
  [message.INTERNAL_SERVER_ERROR]: {
    code: 500,
    success: false,
    notifyWariant: "error",
  },
  [message.TECHNICAL_BREAK]: {
    code: 503,
    success: false,
    notifyWariant: "warning",
  },
  [message.OK]: {
    code: 200,
    success: true,
    notifyWariant: null,
  },

  [message.CREATE_SUCCESS]: {
    code: 201,
    success: true,
    notifyWariant: "success",
  },
  [message.CREATE_ERROR]: {
    code: 400,
    success: false,
    notifyWariant: "error",
  },

  [message.UPDATE_SUCCESS]: {
    code: 200,
    success: true,
    notifyWariant: "success",
  },
  [message.UPDATE_ERROR]: {
    code: 400,
    success: false,
    notifyWariant: "error",
  },

  [message.DELETE_SUCCESS]: {
    code: 200,
    success: true,
  },
  [message.DELETE_ERROR]: {
    code: 400,
    success: false,
  },

  [message.UNAUTHORIZED]: {
    code: 401,
    success: false,
  },

  [message.NO_TOKEN_PROVIDED]: {
    code: 401,
    success: false,
  },
  [message.SESSION_INVALID]: {
    code: 401,
    success: false,
  },
  [message.SESSION_EXPIRED]: {
    code: 401,
    success: false,
  },

  [message.INVALID_CREDENTIALS]: {
    code: 401,
    success: false,
  },
  [message.LOGIN_SUCCESS]: {
    code: 200,
    success: true,
  },
  [message.LOGOUT_SUCCESS]: {
    code: 200,
    success: true,
  },
};

export default message;
