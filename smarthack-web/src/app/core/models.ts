export type LoginRequest = { username: string; password: string };
export type LoginResponse = { token: string };
export type RegisterRequest = { username: string; password: string; role: string };
export type UserProfile = { id: number; username: string; role: string };
