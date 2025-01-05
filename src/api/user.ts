import request from '@/utils/request';
import type { LoginForm, SignUpForm, User } from '@/types/user';
import type { ApiResponse } from '@/types/ApiResponse';

export const userApi = {
  register(data: SignUpForm) {
    const { confirmPassword, ...userData } = data;
    return request.post<ApiResponse<User>>('/auth/register', {
      userData,
    });
  },

  login(data: LoginForm) {
    return request.post<ApiResponse<User>>('/auth/login', data);
  },

  checkUsername(username: string) {
    return request.get<ApiResponse<null>>(
      `/auth/checkUsername?username=${username}`
    );
  },

  checkEmail(email: string) {
    return request.get<ApiResponse<null>>(`/auth/checkEmail?email=${email}`);
  },

  refreshToken(refreshToken: string) {
    return request.post<ApiResponse<User>>('/auth/refresh', { refreshToken });
  },
};
