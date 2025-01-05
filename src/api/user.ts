import request from '@/utils/request';
import type { LoginForm, SignUpForm, User } from '@/types/user';
import type { ApiResponse } from '@/types/ApiResponse';
export const userApi = {
  // 注册
  register(data: SignUpForm) {
    const { confirmPassword, ...userData } = data;
    return request.post<ApiResponse<User>>('/auth/register', {
      userData,
    });
  },

  // 登录
  login(data: LoginForm) {
    return request.post<ApiResponse<User>>('/auth/login', data);
  },

  //检测用户名
  checkUsername(username: string) {
    return request.get<ApiResponse<null>>(
      `/auth/checkUsername?username=${username}`
    );
  },

  // 检测邮箱
  checkEmail(email: string) {
    return request.get<ApiResponse<null>>(`/auth/checkEmail?email=${email}`);
  },
};
