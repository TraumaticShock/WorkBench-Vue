// 用户相关的类型定义
export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  token?: string;
  refreshToken?: string;
}

export interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
