const hasSession = () =>
  typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';

export class SafeStorage {
  get(key: string): string | null {
    if (!hasSession()) return null;
    try { return sessionStorage.getItem(key); } catch { return null; }
  }
  set(key: string, val: string): void {
    if (!hasSession()) return;
    try { sessionStorage.setItem(key, val); } catch {}
  }
  remove(key: string): void {
    if (!hasSession()) return;
    try { sessionStorage.removeItem(key); } catch {}
  }
}

export const safeStorage = new SafeStorage();
