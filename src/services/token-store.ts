/**
 * Isolated token store — holds the in-memory access token.
 * Exists solely to break the api-client ↔ auth.service circular dependency.
 * Neither module imports the other; both import this module instead.
 */

let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}
