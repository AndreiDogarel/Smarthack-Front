export function readJwtPayload(token: string): any {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}
export function isJwtExpired(token: string): boolean {
  const p = readJwtPayload(token);
  if (!p || typeof p.exp !== 'number') return true;
  return Date.now() >= p.exp * 1000;
}