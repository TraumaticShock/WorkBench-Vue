// 用户状态类型
export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

// 用户实体类型
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

// 登录表单类型
export interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 注册表单类型
export interface SignUpForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
