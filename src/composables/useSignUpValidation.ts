import { useFormValidation } from './useSignUpFormValidation';
import { userApi } from '@/api/user';

export const useSignUpValidation = () => {
  const { validationStatus, updateValidation } = useFormValidation();

  const validateUsername = async (username: string) => {
    if (!username) return;

    if (username.length < 3) {
      updateValidation('username', {
        isValid: false,
        message: '用户名至少需要3个字符',
      });
      return;
    }
    if (username.length > 20) {
      updateValidation('username', {
        isValid: false,
        message: '用户名不能超过20个字符',
      });
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      updateValidation('username', {
        isValid: false,
        message: '用户名只能包含字母、数字、下划线和横线',
      });
      return;
    }

    updateValidation('username', { checking: true });
    try {
      const { data } = await userApi.checkUsername(username);
      updateValidation('username', {
        checking: false,
        isValid: data.code === 200,
        message: data.message,
      });
    } catch (error) {
      updateValidation('username', {
        checking: false,
        isValid: false,
        message: '检查用户名失败',
      });
    }
  };

  const validatePassword = (password: string) => {
    if (!password) return;

    if (password.length < 6) {
      updateValidation('password', {
        isValid: false,
        message: '密码至少需要6个字符',
      });
      return;
    }
    if (password.length > 20) {
      updateValidation('password', {
        isValid: false,
        message: '密码不能超过20个字符',
      });
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      updateValidation('password', {
        isValid: false,
        message: '密码必须包含大小写字母和数字',
      });
      return;
    }

    updateValidation('password', { isValid: true, message: '' });
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) {
      updateValidation('confirmPassword', { isValid: false, message: '' });
      return;
    }

    const isMatch = password === confirmPassword;
    updateValidation('confirmPassword', {
      isValid: isMatch,
      message: isMatch ? '' : '两次密码输入不一致',
    });
  };

  const validateEmail = async (email: string) => {
    if (!email) {
      updateValidation('email', { isValid: false, message: '请输入邮箱' });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      updateValidation('email', {
        isValid: false,
        message: '请输入正确的邮箱格式',
      });
      return;
    }

    updateValidation('email', { checking: true });
    try {
      const { data } = await userApi.checkEmail(email);
      updateValidation('email', {
        isValid: data.code === 200,
        message: data.message,
      });
    } catch (error) {
      updateValidation('email', {
        isValid: false,
        message: '检查邮箱失败',
      });
    } finally {
      updateValidation('email', { checking: false });
    }
  };

  return {
    validationStatus,
    validateUsername,
    validatePassword,
    validateConfirmPassword,
    validateEmail,
  };
};
