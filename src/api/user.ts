import request from '@/utils/request';
import type { LoginFormParams, SignUpFormParams, User } from '@/types/user';
import type { ApiResponse } from '@/types/ApiResponse';

export const userApi = {
  signup(data: SignUpFormParams) {
    const { confirmPassword, ...userData } = data;
    return request.post<ApiResponse<User>>('/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
  },

  login(data: LoginFormParams) {
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
