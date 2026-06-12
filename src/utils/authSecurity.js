export const AUTH_SCOPES = Object.freeze({
  DASHBOARD_READ: "dashboard:read",
  CLIENTS_READ: "clients:read",
  CLIENTS_WRITE: "clients:write",
  CONTRACTS_READ: "contracts:read",
  CONTRACTS_DELETE: "contracts:delete",
  FISA_READ: "fisa:read",
  FISA_WRITE: "fisa:write",
  FISA_DELETE: "fisa:delete",
  USERS_ASSIGN: "users:assign",
});

export const ROLE_SCOPES = Object.freeze({
  admin: Object.values(AUTH_SCOPES),
  consultant: [
    AUTH_SCOPES.DASHBOARD_READ,
    AUTH_SCOPES.CLIENTS_READ,
    AUTH_SCOPES.CLIENTS_WRITE,
    AUTH_SCOPES.CONTRACTS_READ,
    AUTH_SCOPES.FISA_READ,
    AUTH_SCOPES.FISA_WRITE,
  ],
});

export const SESSION_STORAGE_KEY = "adminCredit.auth.session";

export const getScopesForRole = (role) => ROLE_SCOPES[role] || [];

export const hasScope = (user, scope) =>
  Boolean(user?.scopes?.includes(scope));

export const requireScope = (user, scope) => {
  if (!hasScope(user, scope)) {
    const error = new Error("You do not have permission to perform this action.");
    error.code = "forbidden";
    error.scope = scope;
    throw error;
  }
};

export const createIdempotencyKey = (prefix = "request") => {
  const randomId =
    globalThis.crypto?.randomUUID?.()
    || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}:${randomId}`;
};

export const createRequestContext = (user, action) => ({
  action,
  idempotencyKey: createIdempotencyKey(action),
  requestedBy: user?.id || null,
  requestedAt: new Date().toISOString(),
});
