import { ref } from 'vue';

export const useFormValidation = () => {
  const validationStatus = ref({
    username: {
      checking: false,
      isValid: false,
      message: '',
    },
    email: {
      checking: false,
      isValid: false,
      message: '',
    },
    password: {
      isValid: false,
      message: '',
    },
    confirmPassword: {
      isValid: false,
      message: '',
    },
  });

  const updateValidation = (field: string, status: any) => {
    if (field in validationStatus.value) {
      validationStatus.value[field] = {
        ...validationStatus.value[field],
        ...status,
      };
    }
  };

  const validateForm = () => {
    return Object.values(validationStatus.value).every(
      (status) => status.isValid
    );
  };

  return {
    validationStatus: validationStatus.value,
    updateValidation,
    validateForm,
  };
};
